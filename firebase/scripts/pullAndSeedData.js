const admin = require("firebase-admin");
const serviceAccount = require("../digishelf-app-firebase-adminsdk-servicekey.json");

// Remove emulator environment variable for production connection
delete process.env.FIRESTORE_EMULATOR_HOST;

// Log service account details first
console.log('🔑 Service Account Details:');
console.log('Project ID:', serviceAccount.project_id);
console.log('Client Email:', serviceAccount.client_email);
console.log('Database URL:', "https://digishelf-app.firebaseio.com");

// Initialize production app with explicit database URL
const prodApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://digishelf-app.firebaseio.com"
}, 'production');

// Log the initialized app details
console.log('\n🔧 Initialized App Details:');
console.log('App Name:', prodApp.name);
console.log('Project ID:', prodApp.options.projectId);
console.log('Database URL:', prodApp.options.databaseURL);

const prodDb = prodApp.firestore();

// Initialize emulator app separately
const emuApp = admin.initializeApp({
  projectId: 'digishelf-app',
}, 'emulator');

const emuDb = emuApp.firestore();

// Configure emulator connection
emuDb.settings({
  host: 'localhost:8081',
  ssl: false,
});

const TARGET_USER_ID = 'mpsPwfLNAjb94aiyXKWGdzh0LcT2';

// Define collections in order of dependencies
const COLLECTIONS = [
  { name: 'users', isUserSpecific: true },
  { name: 'sources', isUserSpecific: false },
  { name: 'integrations', isUserSpecific: true },
  { name: 'shelves', isUserSpecific: true },
  { name: 'items', isUserSpecific: true }
];

async function testProductionConnection() {
  console.log('\n🔍 Testing Production Connection...');
  
  try {
    // Test 1: Simple collection list
    console.log('\nTest 1: Listing collections...');
    const collections = await prodDb.listCollections();
    console.log('Available collections:', collections.map(c => c.id));

    // Test 2: Direct document access
    console.log('\nTest 2: Direct document access...');
    const userDoc = await prodDb.collection('users').doc(TARGET_USER_ID).get();
    console.log('User document exists:', userDoc.exists);
    if (userDoc.exists) {
      console.log('User data:', userDoc.data());
    }

    // Test 3: Query test
    console.log('\nTest 3: Query test...');
    const querySnapshot = await prodDb.collection('users')
      .where('userId', '==', TARGET_USER_ID)
      .get();
    
    console.log('Query results:', {
      empty: querySnapshot.empty,
      size: querySnapshot.size,
      docs: querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }))
    });

    return true;
  } catch (error) {
    console.error('❌ Production connection test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
}

async function pullAndSeedData() {
  try {
    console.log('\n🚀 Starting data pull and seed process...');
    console.log('Target User ID:', TARGET_USER_ID);

    let totalDocs = 0;
    let totalCollections = 0;

    for (const collection of COLLECTIONS) {
      console.log(`\n📥 Processing ${collection.name}...`);
      
      let query;
      if (collection.isUserSpecific) {
        query = prodDb.collection(collection.name)
          .where('userId', '==', TARGET_USER_ID);
      } else {
        query = prodDb.collection(collection.name);
      }

      try {
        console.log('Executing query:', {
          collection: collection.name,
          where: query._queryOptions.filters
        });

        const snapshot = await query.get();
        
        console.log('Query results:', {
          empty: snapshot.empty,
          size: snapshot.size,
          docs: snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }))
        });
        
        if (snapshot.empty) {
          console.log(`No ${collection.name} found`);
          continue;
        }

        // Create a batch write for the emulator
        let batch = emuDb.batch();
        let batchCount = 0;
        const BATCH_SIZE = 500;

        for (const doc of snapshot.docs) {
          const data = doc.data();
          console.log(`Processing ${collection.name} document:`, doc.id);
          
          // Use the same document ID as production
          const emuRef = emuDb.collection(collection.name).doc(doc.id);
          batch.set(emuRef, data);
          
          batchCount++;
          totalDocs++;

          // If we've reached the batch size limit, commit and start a new batch
          if (batchCount >= BATCH_SIZE) {
            await batch.commit();
            console.log(`Committed batch of ${batchCount} documents`);
            batch = emuDb.batch();
            batchCount = 0;
          }
        }

        // Commit any remaining documents
        if (batchCount > 0) {
          await batch.commit();
          console.log(`Committed final batch of ${batchCount} documents`);
        }

        totalCollections++;
        console.log(`✅ Finished processing ${collection.name}`);

      } catch (error) {
        console.error(`Error processing ${collection.name}:`, error);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`Total collections processed: ${totalCollections}`);
    console.log(`Total documents copied: ${totalDocs}`);
    console.log('\n🎉 Data pull and seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run connection test first
testProductionConnection()
  .then(connected => {
    if (connected) {
      console.log('\n✅ Production connection test passed, proceeding with data pull...');
      return pullAndSeedData();
    } else {
      console.error('\n❌ Production connection test failed, aborting...');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }); 