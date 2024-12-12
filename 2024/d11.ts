import { ass, asseq, assInt } from "../2023/ts/common";

function blinkBrickOnce(brick: string): [string] | [string, string] {
  // assInt(brick);
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

function memoize(
  func: (arg0: string, arg2: number) => number
): (arg0: string, arg2: number) => number {
  return (arg1, arg4) => {
    if ((memoryHit + memoryMiss) % 10000 === 0)
      console.log(memoryHit / memoryMiss, memoryHit, memoryMiss);
    const key = arg1 + "|" + arg4;
    const memoized = memory[key];
    if (memoized) {
      memoryHit++;
      return memoized;
    } else {
      memoryMiss++;
      const output = func(arg1, arg4);
      memory[key] = output;
      return output;
    }
  };
}

const memory: Record<string, number> = {};
let memoryHit = 0;
let memoryMiss = 0;
const blinkMemoized = memoize(__newBlink);
asseq(newBlinkMultiple("0 1 10 99 999", 1), 7);
asseq(newBlinkMultiple("125 17", 6), 22);
asseq(newBlinkMultiple("0", 0), 1);
asseq(newBlinkMultiple("0", 1), 1);
asseq(newBlinkMultiple("1", 1), 1);
asseq(newBlinkMultiple("10", 1), 2);
asseq(newBlinkMultiple("99", 1), 2);
asseq(newBlinkMultiple("999", 1), 1);
asseq(newBlinkMultiple("125", 6), 7);
asseq(newBlinkMultiple("125 17", 6), 22);
asseq(newBlinkMultiple("125 17", 25), 55312);
asseq(newBlinkMultiple("1950139 0 3 837 6116 18472 228700 45", 25), 235850);
asseq(
  newBlinkMultiple("1950139 0 3 837 6116 18472 228700 45", 75),
  279903140844645
);

function __newBlink(brick: string, blinksLeft: number): number {
  if (blinksLeft === 0) return 1;
  const newBricks = blinkBrickOnce(brick);

  if (blinksLeft === 1) return newBricks.length;
  let totalBricks = 0;
  for (const newBrick of newBricks) {
    totalBricks += blinkMemoized(newBrick, blinksLeft - 1);
  }
  return totalBricks;
}

function newBlinkMultiple(input: string, blinksTotal: number): number {
  const bricks = input.split(" ");
  let score = 0;
  for (const brick of bricks) {
    score += blinkMemoized(brick, blinksTotal);
  }
  return score;
}
