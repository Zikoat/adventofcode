import { max, sum } from "mathjs";
import { expect, test } from "bun:test";

test("example", () => {
  const input = `1000
  2000
  3000
  
  4000
  
  5000
  6000
  
  7000
  8000
  9000
  
  10000`;

  expect(findMaxElf(input)).toBe(24000);
});

test("part1", () => {
  const input = `1000
  2000
  3000
  
  4000
  
  5000
  6000
  
  7000
  8000
  9000
  
  10000`;
  const maxElf = findMaxElf(input);
});

function findMaxElf(input: string) {
  const elves = input.split(/\n\s*\n/).map((elf) => {
    return elf.split(/\n/).map((fruit) => Number(fruit.trim()));
  });

  const elvesSum = elves.map((elf) => {
    return sum(elf);
  });

  return max(elvesSum);
}
