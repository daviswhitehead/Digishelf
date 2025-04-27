import { CallableRequest } from 'firebase-functions/v2/https';
import { refreshGoodreadsShelf } from '../sources/goodreads/handlers.jsx';
import { getFirestore } from 'firebase-admin/firestore';

export interface RefreshShelfData {
  shelfId: string;
}

export interface RefreshShelfResponse {
  success: boolean;
  message: string;
  error?: {
    code?: string;
    message: string;
    stack?: string;
  };
}

// Get the default Firestore instance
const db = getFirestore();

export async function handleRefreshShelf(
  request: CallableRequest<RefreshShelfData>
): Promise<RefreshShelfResponse> {
  const data = request.data;
  const shelfId = data.shelfId;

  if (!shelfId) {
    return {
      success: false,
      message: 'Shelf ID is required',
    };
  }

  try {
    console.info(`🔄 Refresh request received for shelfId: ${shelfId}`);
    await refreshGoodreadsShelf(shelfId, db);
    return { success: true, message: 'Shelf refreshed successfully.' };
  } catch (error: unknown) {
    console.error(`❌ Error refreshing shelf: ${shelfId}`, error);
    const err = error as Error & { code?: string };
    return {
      success: false,
      message: err.message || 'Failed to refresh shelf',
      error: {
        code: err.code,
        message: err.message,
        stack: err.stack,
      },
    };
  }
}
