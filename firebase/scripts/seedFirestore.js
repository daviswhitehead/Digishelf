// node seedFirestore.js

const admin = require("firebase-admin");
const serviceAccount = require("../digishelf-app-firebase-adminsdk-servicekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🧪 Connect to the Firestore emulator if it's running
if (process.env.FIRESTORE_EMULATOR_HOST) {
  const db = admin.firestore();
  db.settings({
    host: process.env.FIRESTORE_EMULATOR_HOST,
    ssl: false,
  });
  console.log(
    "⚙️ Connected to Firestore Emulator:",
    process.env.FIRESTORE_EMULATOR_HOST
  );
}

const db = admin.firestore();

async function seedFirestore() {
  const now = admin.firestore.FieldValue.serverTimestamp();

  // 1. Create a User
  const userRef = db.collection("users").doc();
  const userId = userRef.id;
  await userRef.set({
    userId,
    displayName: "Davis Whitehead",
    firstName: "Davis",
    lastName: "Whitehead",
    email: "whitehead.davis@gmail.com",
    createdAt: now,
    updatedAt: now,
  });
  console.log("✅ Created user");

  // 2. Create a Source (e.g., Goodreads)
  const sourceRef = db.collection("sources").doc();
  const sourceId = sourceRef.id;
  await sourceRef.set({
    sourceId,
    displayName: "Goodreads",
    url: "https://www.goodreads.com/",
    createdAt: now,
    updatedAt: now,
    shelves: ["All", "Read", "Currently Reading", "Want to Read"],
  });
  console.log("✅ Created source");

  // 3. Create an Integration
  const integrationRef = db.collection("integrations").doc();
  const integrationId = integrationRef.id;
  await integrationRef.set({
    integrationId,
    userId,
    sourceId,
    createdAt: now,
    updatedAt: now,
    accountSlug: "61851004-davis-whitehead",
    myBooksURL:
      "https://www.goodreads.com/review/list/61851004-davis-whitehead",
    shelves: ["All", "Read", "Currently Reading", "Want to Read"],
  });
  console.log("✅ Created integration");

  console.log("🎉 Seeding complete");
}

seedFirestore().catch(console.error);
