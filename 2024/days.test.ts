import { test } from "bun:test";

test.each([
  11,
  // 10,
  // 9,
  8,
  // 7,
  // 6,
  5, 4, 3, 2, 1,
])("day%i", async (day) => {
  await import(`./d${day}`);
});
