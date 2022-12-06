import { expect, test } from "vitest";
import _ from "lodash";
import { getDayInput } from "./god";

const exampleinput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

test("part1example", () => {
  // expect(exampleinput).toBe(-1);
});

test("part1", async () => {expect(getDayInput(1));});
// test("part2Example", () => {expect(exampleinput).toBe(-1);});
// test("part2", async () => {expect(getDayInput(1));});
