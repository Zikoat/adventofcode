import { expect, test } from 'vitest'
import _ from 'lodash'
import { getDayInput } from './god'

const exampleinput = `A Y
B X
C Z`

test('part1example', () => {
  expect(getScore(['A', 'Y'])).toBe(8)
  expect(getScoreSum(exampleinput, getScore)).toBe(15)
})

test('part1', async () => {
  expect(getScoreSum(await getDayInput(2), getScore)).toBe(12740)
})

function getScoreSum (
  input: string,
  scoreFunc: (game: ParsedGame) => number
): any {
  const scores = input
    .split('\n')
    .map(
      (gameString) =>
        gameString.split(' ') as ['A' | 'B' | 'C', 'X' | 'Y' | 'Z']
    )
    .map((game) => scoreFunc(game))
  return _.sum(scores)
}

test('getGameResult', () => {
  let result = getScore(['A', 'Y'])
  expect(result).toBe(8)
  result = getScore(['B', 'X'])
  expect(result).toBe(1)
  result = getScore(['C', 'Z'])
  expect(result).toBe(6)
})

test('part2Example', () => {
  let result = getScore2(['A', 'Y'])
  expect(result).toBe(4)
  result = getScore2(['B', 'X'])
  expect(result).toBe(1)
  result = getScore2(['C', 'Z'])
  expect(result).toBe(7)

  expect(getScoreSum(exampleinput, getScore2)).toBe(12)
})

test('part2', async () => {
  expect(getScoreSum(await getDayInput(2), getScore2)).toBe(11980)
})

enum Outcome {
  'Win' = 'Win',
  'Loss' = 'Loss',
  'Draw' = 'Draw',
}

type Hand = 'Rock' | 'Paper' | 'Scissor'

const outcome: Record<Hand, Record<Hand, Outcome>> = {
  // first is opponent, then you
  Rock: {
    Rock: Outcome.Draw,
    Paper: Outcome.Win,
    Scissor: Outcome.Loss
  },
  Paper: {
    Rock: Outcome.Loss,
    Paper: Outcome.Draw,
    Scissor: Outcome.Win
  },
  Scissor: {
    Rock: Outcome.Win,
    Paper: Outcome.Loss,
    Scissor: Outcome.Draw
  }
}

const outcomeScore: { [key in Outcome]: number } = {
  Loss: 0,
  Draw: 3,
  Win: 6
}

const shapeScore: { [key in Hand]: number } = {
  Rock: 1,
  Paper: 2,
  Scissor: 3
}

type ParsedGame = ['A' | 'B' | 'C', 'X' | 'Y' | 'Z']

function getHandOutcome (opponent: Hand, you: Hand): Outcome {
  return outcome[opponent][you]
}

function getScore (firstGame: ParsedGame): number {
  const opponent = firstGame[0]

  const opponentHand: Hand = {
    A: 'Rock' as const,
    B: 'Paper' as const,
    C: 'Scissor' as const
  }[opponent]

  const you = firstGame[1]

  const yourHand: Hand = {
    X: 'Rock' as const,
    Y: 'Paper' as const,
    Z: 'Scissor' as const
  }[you]

  const outCome = getHandOutcome(opponentHand, yourHand)
  const resultScore = outcomeScore[outCome]

  return resultScore + shapeScore[yourHand]
}

function getScore2 (firstGame: ParsedGame): number {
  const opponent = firstGame[0]

  const opponentHand: Hand = {
    A: 'Rock' as const,
    B: 'Paper' as const,
    C: 'Scissor' as const
  }[opponent]

  const wantedResult: Outcome = {
    X: Outcome.Loss,
    Y: Outcome.Draw,
    Z: Outcome.Win
  }[firstGame[1]]

  let wantedYourHand: Hand | null = null

  for (const shit of Object.entries(outcome[opponentHand]) as Array<
  [Hand, Outcome]
  >) {
    if (shit[1] === wantedResult) wantedYourHand = shit[0]
  }

  if (wantedYourHand === null) {
    throw Error('shit hit the fan')
  }

  const resultScore = outcomeScore[wantedResult]

  const wantedShapeScore: number = shapeScore[wantedYourHand]
  return resultScore + wantedShapeScore
}
