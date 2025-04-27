const { getFirestore, collection, query, where, getDocs, limit } = require('firebase/firestore');
const { getFunctions, httpsCallable } = require('firebase/functions');
const { initializeApp } = require('firebase/app');

// Initialize Firebase app
const firebaseApp = initializeApp({
  projectId: 'digishelf-app',
});

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Initialize Functions
const functions = getFunctions(firebaseApp);

const TARGET_USER_ID = 'mpsPwfLNAjb94aiyXKWGdzh0LcT2';

async function testRefresh() {
  try {
    console.log('🔍 Testing refresh function...');

    // 1. Get a shelf to refresh
    const shelvesQuery = query(
      collection(db, 'shelves'),
      where('userId', '==', TARGET_USER_ID),
      limit(1)
    );
    const shelvesSnapshot = await getDocs(shelvesQuery);

    if (shelvesSnapshot.empty) {
      console.error('❌ No shelves found for user');
      return;
    }

    const shelf = shelvesSnapshot.docs[0];
    const shelfId = shelf.id;
    console.log(`\n📚 Found shelf: ${shelfId}`);
    console.log('Shelf data:', shelf.data());

    // 2. Get items before refresh
    const itemsQuery = query(collection(db, 'items'), where('shelfId', '==', shelfId));
    const itemsBefore = await getDocs(itemsQuery);

    console.log(`\n📦 Items before refresh: ${itemsBefore.size}`);
    console.log(
      'First few items:',
      itemsBefore.docs.slice(0, 3).map(doc => ({
        id: doc.id,
        title: doc.data().title,
      }))
    );

    // 3. Call refresh function through emulator
    console.log('\n🔄 Calling refresh function...');
    const refreshShelf = httpsCallable(functions, 'refreshShelf');
    const result = await refreshShelf({ shelfId });

    console.log('Refresh result:', result.data);

    // 4. Get items after refresh
    const itemsAfter = await getDocs(itemsQuery);

    console.log(`\n📦 Items after refresh: ${itemsAfter.size}`);
    console.log(
      'First few items:',
      itemsAfter.docs.slice(0, 3).map(doc => ({
        id: doc.id,
        title: doc.data().title,
      }))
    );

    // 5. Compare results
    console.log('\n📊 Comparison:');
    console.log(`Items before: ${itemsBefore.size}`);
    console.log(`Items after: ${itemsAfter.size}`);
    console.log(`Difference: ${itemsAfter.size - itemsBefore.size}`);

    // 6. Check for new items
    const beforeIds = new Set(itemsBefore.docs.map(doc => doc.id));
    const newItems = itemsAfter.docs.filter(doc => !beforeIds.has(doc.id));

    if (newItems.length > 0) {
      console.log('\n🆕 New items found:');
      newItems.forEach(doc => {
        console.log(`- ${doc.data().title} (${doc.id})`);
      });
    }

    console.log('\n✅ Test complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testRefresh();
