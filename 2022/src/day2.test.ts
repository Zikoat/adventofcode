import { max, sum, sort } from "mathjs";
import { expect, test } from "bun:test";
import { readFile, readFileSync } from "fs-extra";
import _ from "lodash";

// shit refactor
const input = await (await readFile(__dirname + "/day2Input.txt")).toString();
const exampleinput = `A Y
B X
C Z`;

test("part1example", () => {
  expect(getScoreSum(exampleinput)).toBe(15);
});

test("part1", () => {
  expect(getScoreSum(input)).toBe(12740);
});

function getScoreSum(input: string) {
  return sum(
    input
      .split("\n")
      .map((gameString) => gameString.split(" "))
      .map((game) => getScore(game))
  );
}

const outcome = {
  A: {
    X: 3,
    Y: 6,
    Z: 0,
  },
  B: {
    X: 0,
    Y: 3,
    Z: 6,
  },
  C: {
    X: 6,
    Y: 0,
    Z: 3,
  },
};

const shapeScore = {
  X: 1,
  Y: 2,
  Z: 3,
};

function getScore(firstGame: string[]) {
  return outcome[firstGame[0]][firstGame[1]] + shapeScore[firstGame[1]];
}
