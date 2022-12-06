import { sum } from "mathjs";
import { describe, expect, test } from "vitest";
import _ from "lodash";
import { getDayInput } from "./god";

const exampleinput = `A Y
B X
C Z`;

test("part1example", () => {
  expect(getScore(["A", "Y"])).toBe(8);
  expect(getScoreSum(exampleinput)).toBe(15);
});

test("part1", async () => {
  expect(getScoreSum(await getDayInput(2))).toBe(12740);
});

function getScoreSum(input: string) {
  const scores = input
    .split("\n")
    .map(
      (gameString) =>
        gameString.split(" ") as ["A" | "B" | "C", "X" | "Y" | "Z"]
    )
    .map((game) => getScore(game));
  return sum(scores);
}

test("getGameResult", () => {
  let result = getScore(["A", "Y"]);
  expect(result).toBe(8);
  result = getScore(["B", "X"]);
  expect(result).toBe(1);
  result = getScore(["C", "Z"]);
  expect(result).toBe(6);
});

enum Outcome {
  "Win" = "Win",
  "Loss" = "Loss",
  "Draw" = "Draw",
}

type Hand = "Rock" | "Paper" | "Scissor";

const outcome: Record<Hand, Record<Hand, Outcome>> = {
  // first is opponent, then you
  Rock: {
    Rock: Outcome.Draw,
    Paper: Outcome.Win,
    Scissor: Outcome.Loss,
  },
  Paper: {
    Rock: Outcome.Loss,
    Paper: Outcome.Draw,
    Scissor: Outcome.Win,
  },
  Scissor: {
    Rock: Outcome.Win,
    Paper: Outcome.Loss,
    Scissor: Outcome.Draw,
  },
};

const outcomeScore: { [key in Outcome]: number } = {
  Loss: 0,
  Draw: 3,
  Win: 6,
};

const shapeScore = {
  X: 1,
  Y: 2,
  Z: 3,
};

type ParsedGame = ["A" | "B" | "C", "X" | "Y" | "Z"];

function getScore(firstGame: ParsedGame): number {
  const opponent = firstGame[0];

  const opponentHand: Hand = {
    A: "Rock" as const,
    B: "Paper" as const,
    C: "Scissor" as const,
  }[opponent];

  const you = firstGame[1];

  const yourHand: Hand = {
    X: "Rock" as const,
    Y: "Paper" as const,
    Z: "Scissor" as const,
  }[you];

  const outCome = getHandOutcome(opponentHand, yourHand);
  const resultScore = outcomeScore[outCome];

  return resultScore + shapeScore[firstGame[1]];
}

function getHandOutcome(opponent: Hand, you: Hand) {
  return outcome[opponent][you];
}
