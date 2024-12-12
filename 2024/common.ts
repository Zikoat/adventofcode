import { deepEquals } from "bun";

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

export function div(v: Vector, scalar: number): Vector {
  ass(scalar % 1 === 0);

  const newVector = { x: v.x / scalar, y: v.y / scalar };

  ass(newVector.x % 1 === 0);
  ass(newVector.y % 1 === 0);

  return newVector;
}
export function negate(v: Vector): Vector {
  return div(v, -1);
}

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
    throw Error(
      (message ?? "") + actualString + " should be " + JSON.stringify(want)
    );
  }
}

export function nonNull<T>(shit: NonNullable<T> | undefined): T {
  ass(shit);
  return shit;
}

export function assInt(input: string): asserts input {
  ass(/^\d+$/.test(input));
  return;
}
