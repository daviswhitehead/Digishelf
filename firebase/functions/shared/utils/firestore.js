"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBatch = processBatch;
const firestore_1 = require("firebase-admin/firestore");
async function processBatch(query, processFn, description) {
    const db = (0, firestore_1.getFirestore)();
    const snapshot = await query.get();
    const batchSize = 500;
    const batches = [];
    let currentBatch = db.batch();
    let operationCount = 0;
    console.log(`${description}: Processing ${snapshot.size} documents`);
    for (const doc of snapshot.docs) {
        processFn(currentBatch, doc);
        operationCount++;
        if (operationCount === batchSize) {
            batches.push(currentBatch);
            currentBatch = db.batch();
            operationCount = 0;
        }
    }
    if (operationCount > 0) {
        batches.push(currentBatch);
    }
    console.log(`${description}: Committing ${batches.length} batches`);
    await Promise.all(batches.map(batch => batch.commit()));
    console.log(`${description}: Completed successfully`);
}
//# sourceMappingURL=firestore.js.map