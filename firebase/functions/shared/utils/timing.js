'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.withTiming = withTiming;
/**
 * A utility function to time async operations and ensure proper cleanup
 * @param label The label for the timing operation
 * @param operation The async operation to time
 * @returns The result of the operation
 */
async function withTiming(label, operation) {
    console.time(label);
    try {
        const result = await operation();
        console.timeEnd(label);
        return result;
    }
    catch (error) {
        console.timeEnd(label);
        throw error;
    }
}
// # sourceMappingURL=timing.js.map