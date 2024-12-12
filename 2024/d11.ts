import { trimStart } from "effect/String";
import { ass, asseq } from "../2023/ts/common";
import { memo } from "effect/FastCheck";

const test = ``;

function blink(input: string[]): string[] {
  const shit = input;

  const newString: string[] = [];

  for (const brickString of shit) {
    // console.log(brickString, "turns to", blinkBrickOnce(brickString));
    newString.push(...blinkBrickOnce(brickString));
    // console.log(newString);
  }
  return newString;
}

function blinkBrickOnce(brick: string): [string] | [string, string] {
  if (brick === "0") {
    return ["1"];
  }
  if (brick.length % 2 == 0) {
    return [
      Number(brick.slice(0, brick.length / 2)).toString(),
      Number(brick.slice(brick.length / 2, brick.length)).toString(),
    ];
  }

  return [(Number(brick) * 2024).toString()];
}

asseq(blinkn("0 1 10 99 999", 1).join(" "), "1 2024 1 0 9 9 2021976");
asseq(s(blinkn("0 1 10 99 999", 1)), 7);
asseq(
  blink(blink(blink(blink(blink(blink("125 17".split(" "))))))).join(" "),
  "2097446912 14168 4048 2 0 2 4 40 48 2024 40 48 80 96 2 8 6 7 6 0 3 2"
);
asseq(s(blinkn("125 17", 6)), 22);
function blinkn(input: string, count: number): string[] {
  let newShit: string[] = input.split(" ");
  for (let i = 0; i < count; i++) {
    console.log(i);
    newShit = blink(newShit);
  }
  return newShit;
}

function s(stones: string[]): number {
  return stones.length;
}
asseq(s(blinkn("125 17", 25)), 55312);
asseq(s(blinkn("1950139 0 3 837 6116 18472 228700 45", 25)), 235850);
asseq(s(blinkn("1950139 0 3 837 6116 18472 228700 45", 75)));

const memory: Record<string, string> = {};
function memoize(func: (arg0: string) => string): (arg0: string) => string {
  return (arg1) => {
    const memoized = memory[arg1];
    if (memoized) {
      return memoized;
    } else return func(arg1);
  };
}

const blinkMemoized = memoize(blink);
// pseudocode:
// a brick has to blink n times.
// when a brick is blinked, it creates multiple new bricks, each brick has
// when a brick is

function newBlink(brick: string, blinksLeft: number): unknown {
  return;
}
