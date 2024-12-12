import { asseq } from "./common";

const memory: Record<string, number> = {};
{
  // asseq(blinkBricks("0", 0), 1);
  // asseq(blinkBricks("0", 1), 1);
  // asseq(blinkBricks("1", 1), 1);
  // asseq(blinkBricks("10", 1), 2);
  // asseq(blinkBricks("99", 1), 2);
  // asseq(blinkBricks("999", 1), 1);
  asseq(blinkBricks("0 1 10 99 999", 1), 7);
  // asseq(blinkBricks("125", 6), 7);
  // asseq(blinkBricks("125 17", 6), 22);
  asseq(blinkBricks("125 17", 25), 55312);
  // asseq(blinkBricks("1950139 0 3 837 6116 18472 228700 45", 25), 235850);
  // asseq(
  //   blinkBricks("1950139 0 3 837 6116 18472 228700 45", 75),
  //   279903140844645
  // );
}

function blinkN(brick: string, blinksLeft: number): number {
  const key = brick + "|" + blinksLeft;
  const memoized = memory[key];

  if (memoized) {
    return memoized;
  } else {
    if (blinksLeft === 0) return 1;
    let newBricks: [string] | [string, string];

    if (brick === "0") {
      newBricks = ["1"];
    } else if (brick.length % 2 == 0) {
      newBricks = [
        Number(brick.slice(0, brick.length / 2)).toString(),
        Number(brick.slice(brick.length / 2, brick.length)).toString(),
      ];
    } else {
      newBricks = [(Number(brick) * 2024).toString()];
    }

    if (blinksLeft === 1) return newBricks.length;

    let totalBricks = 0;
    for (const newBrick of newBricks) {
      const newBlinksLeft = blinksLeft - 1;
      totalBricks += blinkN(newBrick, newBlinksLeft);
    }
    memory[key] = totalBricks;
    return totalBricks;
  }
}

function blinkBricks(input: string, blinksTotal: number): number {
  const bricks = input.split(" ");
  let score = 0;
  for (const brick of bricks) {
    score += blinkN(brick, blinksTotal);
  }
  return score;
}
