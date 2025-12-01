import { expect, test } from 'vitest'
import _ from 'lodash'
import { getDayInput } from './god'

const exampleinput = `30373
25512
65332
33549
35390`

test('part1example', () => {
  const output = exampleinput
    .split('\n')
    .map((row) => row.split('').map(Number))

  let leftVisible = false
  // const rightVisible = false
  // const tobVisible = false
  // const bottomVisible = false

  const currentCoords = [1, 1]
  const currentHeight = output[currentCoords[1]][currentCoords[0]]

  for (let i = 0; i < output[0].length; i++) {
    const cell = output[0][i]
    if (currentHeight >= cell) leftVisible = true
    expect(cell).toBeTypeOf('number')
  }

  expect(output).toBe(-1)
  expect(leftVisible).toBe(true)
})

test('part1', async () => {
  expect(await getDayInput(1)).toBeTypeOf('string')
})
// test("part2Example", () => {expect(exampleinput).toBe(-1);});
// test("part2", async () => {expect(getDayInput(1));});
