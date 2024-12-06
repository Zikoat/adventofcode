import { test } from "bun:test";

test.each([1, 2, 3, 4, 5, 6])("day%i", async (day) => {
  await import(`./d${day}`);
});
