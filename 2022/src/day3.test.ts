import { expect, test } from "vitest";
import _ from "lodash";
import { getDayInput } from "./god";
import { sum } from "mathjs";

const exampleinput = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

test("part1example", () => {
  const parsed = exampleinput.split("\n");

  const firstBackpack = parsed[0];

  const commonItem = getCommonItem(firstBackpack);

  expect(commonItem).toBe("p");
  expect(getItemScore(commonItem)).toBe(16);

  const itemSum = getScoreSum(exampleinput);
  expect(itemSum).toBe(157);
});

test("part1", async () => {
  expect(getScoreSum(await getDayInput(3))).toBe(7826);
});

function getScoreSum(inputString: string) {
  const parsed = inputString.split("\n");

  const itemScores = parsed.map((backpackString) =>
    getItemScore(getCommonItem(backpackString))
  );
  const itemSum = sum(itemScores);
  return itemSum;
}

function getCommonItem(backpack: string) {
  const len = backpack.length;
  const halfLength = len / 2;

  var first = backpack.slice(0, halfLength);
  var second = backpack.slice(halfLength);

  const commonItem = intersection(first, second);
  return commonItem;
}

// test("part2Example", () => {expect(exampleinput).toBe(-1);});
// test("part2", async () => {expect(getDayInput(1));});

function intersection(inA: string, inB: string) {
  let a = new Set(inA);
  let b = new Set(inB);
  let intersection = [...new Set([...a].filter((x) => b.has(x)))][0];
  return intersection;
}

function getItemScore(item: string) {
  return " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(item);
}
