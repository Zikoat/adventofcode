import { max, sum, sort } from "mathjs";
import { expect, test } from "bun:test";
import { readFile, readFileSync } from "fs-extra";

const input = await (await readFile(__dirname + "/day1Input.txt")).toString();
const exampleinput = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

test("part1example", () => {
  expect(findMaxElf(exampleinput)).toBe(24000);
});

test("part1", async () => {
  expect(findMaxElf(input)).toBe(68775);
});

test("part2example", async () => {
  expect(sum(top3Elves(exampleinput))).toBe(45000);
});

test("part2", async () => {
  expect(sum(top3Elves(input))).toBe(202585);
});



function findMaxElf(input: string) {
  const elvesSum = elvesSums(input);

  return max(elvesSum);
}

function top3Elves(input: string) {
  const elvesSum = elvesSums(input);
  const sortedElves = sort(elvesSum, (a, b) => b - a);
  return sortedElves.slice(0, 3);
}

function elvesSums(input: string) {
  const elves = input.split(/\n\s*\n/).map((elf) => {
    return elf.split(/\n/).map((fruit) => Number(fruit.trim()));
  });

  const elvesSum = elves.map((elf) => {
    return sum(elf) as number;
  });
  return elvesSum;
}
