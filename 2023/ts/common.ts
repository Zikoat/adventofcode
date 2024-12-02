export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) throw Error(message ?? "assertion failed");
}
export function assertEqual<T>(
  actual: T,
  expected: T
  // message?: string,
): asserts expected is T {
  if (!Object.is(expected, actual)) {
    const actualString = JSON.stringify(actual);
    throw Error(actualString + " should be " + expected);
  }
}
