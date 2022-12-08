import { expect, test } from 'vitest'
import _ from 'lodash'
import { getDayInput } from './god'
import { sum } from 'mathjs'

const exampleinput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`

test('part1example', () => {
  const output = shit(exampleinput, doOverlap1)
  expect(output).toBe(2)
})

test('part1', async () => {
  const input = await getDayInput(4)
  const output = shit(input, doOverlap1)
  expect(output).toBe(532)
})

test('part2Example', () => {
  const output = shit(exampleinput, doOverlap2)

  expect(output).toBe(4)
})
test('part2', async () => {
  const input = await getDayInput(4)
  const output = shit(input, doOverlap2)
  // expect(output).toBe(532);
})

function shit (
  input: string,
  doOverlap: (first: [number, number], second: [number, number]) => boolean
) {
  return sum(
    input.split('\n').map((pair) => {
      const { first, second } = parsePair(pair)

      const overlaps = doOverlap(first, second)

      return overlaps ? 1 : 0
    })
  )
}
function parsePair (pair: string) {
  const pairArray = pair.split(',')

  const first = pairArray[0].split('-').map(Number) as [number, number]
  const second = pairArray[1].split('-').map(Number) as [number, number]
  return { first, second }
}

function doOverlap1 (first: [number, number], second: [number, number]) {
  return (
    (first[0] >= second[0] && first[1] <= second[1]) ||
    (first[0] <= second[0] && first[1] >= second[1])
  )
}

function doOverlap2 (first: [number, number], second: [number, number]) {
  const overlapFirstAfter = first[1] >= second[0]
  const overlapFirstBefore = first[0] >= second[1]
  return overlapFirstAfter || overlapFirstBefore
}
