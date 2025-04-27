'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.retry = retry;
/**
 * Retries an async operation with exponential backoff
 * @param operation The async operation to retry
 * @param options Retry options
 * @returns The result of the operation
 */
async function retry(operation, { retries = 3, minTimeout = 1000, factor = 2, onRetry = () => { } } = {}) {
    let lastError;
    let attempt = 0;
    while (attempt < retries) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            attempt++;
            if (attempt === retries) {
                throw new Error(`Failed after ${retries} attempts: ${lastError.message}`);
            }
            const timeout = minTimeout * Math.pow(factor, attempt - 1);
            onRetry(lastError);
            await new Promise(resolve => setTimeout(resolve, timeout));
        }
    }
    throw new Error(`Failed after ${retries} attempts: ${lastError.message}`);
}
// # sourceMappingURL=retry.js.map