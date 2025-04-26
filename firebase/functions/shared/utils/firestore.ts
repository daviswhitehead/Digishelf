import { Query, WriteBatch, QueryDocumentSnapshot, getFirestore } from "firebase-admin/firestore";

export async function processBatch(
  query: Query,
  processFn: (batch: WriteBatch, doc: QueryDocumentSnapshot) => void,
  description: string
): Promise<void> {
  const db = getFirestore();
  const snapshot = await query.get();
  const batchSize = 500;
  const batches: WriteBatch[] = [];
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