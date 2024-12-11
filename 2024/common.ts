import { ass } from "../2023/ts/common";

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
