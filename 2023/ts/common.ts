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
    throw Error((message ?? "") + actualString + " should be " + JSON.stringify(want));
  }
}

export function nonNull<T>(shit: NonNullable<T> | undefined): T {
  ass(shit);
  return shit;
}
