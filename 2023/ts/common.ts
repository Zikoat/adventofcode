export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) throw Error(message ?? "assertion failed");
}
export function assertEqual(
  actual: unknown,
expected: unknown,
  // message?: string,
): asserts expected is typeof actual {
  
  if (!Object.is(expected,actual)){
    const actualString = JSON.stringify(actual);
    throw Error(actualString +" should be "+expected);
  } 
}
