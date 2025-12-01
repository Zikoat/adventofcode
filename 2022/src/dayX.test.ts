import { expect, test } from 'vitest'
import _ from 'lodash'
import { getDayInput } from './god'

const exampleinput = ''

test('part1example', () => {
  _.noop()
  expect(exampleinput).toBe('')
})

test('part1', async () => {
  expect(await getDayInput(1)).toBeTypeOf('string')
})
// test("part2Example", () => {expect(exampleinput).toBe(-1);});
// test("part2", async () => {expect(getDayInput(1));});
