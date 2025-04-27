/**
 * A utility function to time async operations and ensure proper cleanup
 * @param label The label for the timing operation
 * @param operation The async operation to time
 * @returns The result of the operation
 */
export async function withTiming<T>(label: string, operation: () => Promise<T>): Promise<T> {
  console.time(label);
  try {
    const result = await operation();
    console.timeEnd(label);
    return result;
  } catch (error) {
    console.timeEnd(label);
    throw error;
  }
}
