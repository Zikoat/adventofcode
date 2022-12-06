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

  expect(commonItem).toStrictEqual(["p"]);
  expect(getItemScore(commonItem[0])).toBe(16);

  const itemSum = getScoreSum(exampleinput);
  expect(itemSum).toBe(157);
});

test("part1", async () => {
  expect(getScoreSum(await getDayInput(3))).toBe(7826);
});

test("part2Example", () => {
  const groupScoreSum = getGroupScoreSum(exampleinput);
  expect(groupScoreSum).toBe(70);
});

test("part2", async () => {
  expect(getGroupScoreSum(await getDayInput(3))).toBe(2577);
});

function getGroupScoreSum(shit: string) {
  const parsed = shit.split("\n");

  const groups: string[][] = [];
  let currentGroup: string[] = [];

  for (let i = 0; i < parsed.length; i++) {
    const backPack = parsed[i];
    currentGroup.push(backPack);
    if (i % 3 === 2) {
      groups.push([...currentGroup]);
      currentGroup = [];
    }
  }
  
  const groupScoreSum = sum(groups.map((group) => getGroupScore(group)));
  return groupScoreSum;
}

function getGroupScore(group: string[]) {
  const firstIntersection = intersection(group[1], group[2]);
  const secondIntersection = intersection(group[0], firstIntersection);
  const groupItem = secondIntersection;
  const groupScore = getItemScore(groupItem[0]);
  return groupScore;
}

function getScoreSum(inputString: string) {
  const parsed = inputString.split("\n");

  const itemScores = parsed.map((backpackString) =>
    getItemScore(getCommonItem(backpackString)[0])
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

function intersection(
  inA: string | Set<string> | string[],
  inB: string | Set<string> | string[]
) {
  let a = new Set(inA);
  let b = new Set(inB);
  let intersection = [...new Set([...a].filter((x) => b.has(x)))];
  return intersection;
}

function getItemScore(item: string) {
  return " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(item);
}
