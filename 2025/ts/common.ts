import { deepEquals } from "bun";

const numberRegex = /^\d+$/;

export type Vector = {
  x: number;
  y: number;
};

export function add(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function diff(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function ass(truthy: unknown, message?: string): asserts truthy {
  if (!truthy) {
    throw new Error(message ?? "assertion failed");
  }
}

export function asseq<T>(got: T, want: T, message?: string): asserts want is T {
  if (!deepEquals(want, got, true)) {
    const actualString = JSON.stringify(got);
    throw new Error(
      `${(message ?? "") + actualString} should be ${JSON.stringify(want)}`,
    );
  }
}

export function nonNull<T>(shit: T | undefined): NonNullable<T> {
  ass(shit !== undefined && shit !== null);
  return shit;
}

export function assInt(input: string): asserts input {
  ass(numberRegex.test(input));
  return;
}

export function sum(nums: number[]) {
  return nums.reduce((prev, cur, _i, _arr) => prev + cur, 0);
}

export type Rang = {
  from: number;
  to: number;
};
