interface RetryOptions {
  retries?: number;
  minTimeout?: number;
  factor?: number;
  onRetry?: (error: Error) => void;
}

/**
 * Retries an async operation with exponential backoff
 * @param operation The async operation to retry
 * @param options Retry options
 * @returns The result of the operation
 */
export async function retry<T>(
  operation: () => Promise<T>,
  { retries = 3, minTimeout = 1000, factor = 2, onRetry = () => {} }: RetryOptions = {}
): Promise<T> {
  let lastError: Error | unknown;
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      attempt++;

      if (attempt === retries) {
        throw lastError;
      }

      const timeout = minTimeout * Math.pow(factor, attempt - 1);
      onRetry(error instanceof Error ? error : new Error(String(error)));
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }

  throw lastError;
}
