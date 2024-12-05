import { deepEquals } from "bun";

export function ass(truthy: unknown, message?: string): asserts truthy {
  if (!truthy) throw Error(message ?? "assertion failed");
}

export function asseq<T>(
  got: T,
  want?: T,
  message?: string
): asserts want is T {
  if (!deepEquals(want, got, true)) {
    const actualString = JSON.stringify(got);
    throw Error((message ?? "") + actualString + " should be " + want);
  }
}
