console.log("start")
type TupleOf<T, N extends number, R extends readonly T[] = []> =
  R['length'] extends N ? R : TupleOf<T, N, readonly [...R, T]>

export function assertTupleOf<T, N extends number>(
  value: readonly T[],
  length: N,
): asserts value is TupleOf<T, N> {
  asseq(value.length, length)
}

export function isTupleOf<T, N extends number>(
  value: readonly T[],
  length: N,
): TupleOf<T, N> {
  asseq(value.length, length)
  return value as TupleOf<T, N>;
}

const x: number[] = [1, 2, 3]
assertTupleOf(x, 3)
const x_1: number = x[0]
const x_2: number = x[2]
// @ts-expect-error
const x_3: number = x[3]

void x_1, x_2, x_3;

import { deepEquals } from "bun";
import { add, ass, asseq, assInt, diff, nonNull, sum, type Vector } from "./common";
import { isValid } from "zod/v3";

const testInput2 = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2` as const;

type Gift = ("." | "#")[][];
type Gifts = readonly Gift[]
type Int = number;
type GiftCounts = readonly Int[]
type Tree = { width: Int, height: Int, giftCounts: GiftCounts }
type Puzzle = { gifts: Gifts, trees: Tree[] }

function shape(twoDArray: unknown[][]): [number, number] {
  const firstRow = nonNull(twoDArray[0])
  ass(twoDArray.every(row => row.length === firstRow.length))
  return [twoDArray.length, firstRow.length]
}


function parseInput(input: string): Puzzle {

  const matchedInput = input.split("\n\n")

  const giftsTuple = matchedInput.toSpliced(matchedInput.length - 1)
  asseq(giftsTuple.length, matchedInput.length - 1)
  // console.log(matchedInput)
  const giftsShit: Gifts = (giftsTuple.map(giftString => {
    const shit = nonNull(giftString.split(":")[1]).trim().split("\n");
    // console.log("shit", shit, giftString)
    return shit.map(line => {
      const splittedLines = line.split("");
      // console.log(splittedLines)
      return splittedLines.map(char => {
        ass(char === "#" || char === ".")
        return char;
      })
    })
  }))
  const trees: Tree[] = nonNull(matchedInput[matchedInput.length - 1]).split('\n').map(tree => {
    const [size, gifts] = tree.split(": ")
    const [widthString, heightString] = nonNull(size).split("x")
    assInt(nonNull(widthString)); assInt(nonNull(heightString))

    const giftCounts = (nonNull(gifts).split(" ").map(numString => {
      assInt(numString)
      return Number(numString)
    }))

    const width = Number(widthString);
    const height = Number(heightString);

    asseq(giftCounts.length, giftsShit.length)

    return { width, height, giftCounts }
  })

  return { gifts: giftsShit, trees }
}

function validateTest() {

  const parsedInput = parseInput(testInput2);
  const gifts = parsedInput.gifts
  const first_gift: Gift = nonNull(gifts[0])


  asseq(first_gift, [["#", "#", "#"],
  ["#", "#", "."],
  ["#", "#", "."]])

  gifts.forEach(gift => asseq(shape(gift), [3, 3]));
}

validateTest()

function trimGift(gift: string): string {
  let rows = gift.split("\n").map(row => {
    const chars = row.split(""); ass(chars.every(char => char === "." || char == "#"));
    return chars;
  });


  const trimmedGifts = trimGift2(rows);
  // console.log("rows", rows, "trimmedGifts", trimmedGifts)
  return trimmedGifts.map(row => row.join("")).join("\n")
}

asseq(trimGift(`#`), "#")
asseq(trimGift(`##`), "##")
asseq(trimGift(`#
#`), `#
#`)
asseq(trimGift(`.#`), "#")
asseq(trimGift(`#.`), "#")
asseq(trimGift(`#.#`), "#.#")
asseq(trimGift(
  `
#.#
#..`.trim()), `
#.#
#..`.trim())
asseq(trimGift("..#"), "#")
asseq(trimGift(`.
.
#`), "#")
asseq(trimGift(`#
.
.`), "#")

function trimGift2(input: Gift): Gift {
  let rows = [...input];
  while (rows.every(row => row[0] === ".")) {
    rows = rows.map(row => row.toSpliced(0, 1))
  }

  while (rows.every(row => row[row.length - 1] === ".")) {
    rows = rows.map(row => row.toSpliced(row.length - 1, 1))
  }


  while (nonNull(rows[0]).every(char => char === ".")) {
    rows = rows.toSpliced(0, 1)
  }

  while (nonNull(rows[rows.length - 1]).every(char => char === ".")) {
    rows = rows.toSpliced(rows.length - 1, 1)
  }
  return rows;
}

asseq(trimGift2([[".", ".", "."], [".", "#", "."], [".", ".", "."],]), [["#"]])

const performanceOptimizations = { countGiftSpaces: false } as const;

function canFitString(input: string): boolean {
  // console.log(input)
  const parsed2: Puzzle = parseInput(input)

  const gifts = parsed2.gifts.map(gift => {
    // console.log(gift)

    return trimGift2(gift)
  })

  const firstTree = nonNull(parsed2.trees[0])
  const freeSpaces = firstTree.width * firstTree.height;
  const giftsWithCounts: { gift: Gift, count: Int }[] = firstTree.giftCounts.map((value, index, array) => {
    return { gift: nonNull(gifts[index]), count: value } satisfies { gift: Gift, count: Int }
  })

  // shit this can be refactored to use a helper to turn a 2d array to a flat thing, with positions.
  const eachGiftTypeSpacesCount: number[] = giftsWithCounts.map((giftWithCount): number => {
    const giftSpacesCount = giftWithCount.gift.flatMap(row => row.flatMap(row => row)).filter(char => char === "#").length
    return giftSpacesCount * giftWithCount.count
  })
  const totalGiftSpaces: number = sum(eachGiftTypeSpacesCount)
  // console.log(eachGiftTypeSpacesCount, totalGiftSpaces)

  if (totalGiftSpaces > freeSpaces && performanceOptimizations.countGiftSpaces) {
    // shit note that the code should still work without this. this is only a performance optimization!
    return false
  }

  console.log("next shape")
  // loop over each tile under the tree
  // try to place the gift there
  // if every tile of the gift is inside the bounds, then we can place it there. 
  // shit this can be refactored to map over each of the tiles under the tree


  const gift = nonNull(gifts[0])

  // if all positions say that this gift cannot fit under the tree, then this 
  let canPlaceGiftAnywhereUnderTree = false;

  for (let y = 0; y < firstTree.height; y++) {

    for (let x = 0; x < firstTree.width; x++) {
      // console.log(x, y)
      let giftFitsUnderTreeAtThisLocation = true;
      // for each tile in the gift
      for (let giftY = 0; giftY < gift.length; giftY++) {

        for (let giftX = 0; giftX < nonNull(gift[0]).length; giftX++) {
          const tile = nonNull(nonNull(gift[giftY])[giftX])
          // console.log("gift", giftX, giftY, tile)
          if (tile === "#") {
            const worldPos = add({ x: giftX, y: giftY }, { x, y });
            const width = firstTree.width;
            const height = firstTree.height;
            const isGiftTileInBounds = isInBounds(worldPos.x, worldPos.y, width, height);
            // console.log(worldPos, "should be in", width, height, isGiftTileInBounds)
            if (!isGiftTileInBounds) {
              giftFitsUnderTreeAtThisLocation = false;
            }
          }
        }
      }

      if (giftFitsUnderTreeAtThisLocation) {
        // shit performance optimization is to cut loop here.
        canPlaceGiftAnywhereUnderTree = true;
      }
    }
  }

  const giftPlacements: PlacedGift[] = [];
  // for each gift
  for (const [giftType, gift] of gifts.entries()) {
    const giftCount = nonNull(firstTree.giftCounts[giftType])
    // console.log("giftCount", giftCount)
    for (let i = 0; i < giftCount; i++) {
      for (let x = 0; x < firstTree.width; x++) {
        for (let y = 0; y < firstTree.height; y++) {
          // console.log(x, y)
          giftPlacements.push({ type: giftType, x, y })
        }
      }
    }
  }
  // console.log(giftPlacements)
  const thisIsValidPlacement = isValidPlacement(gifts, firstTree.width, firstTree.height, giftPlacements);
  // console.log(thisIsValidPlacement)
  return thisIsValidPlacement
  // for each x of the board
  // for each y of the board
  // create the placement
  // validate the placement


  if (canPlaceGiftAnywhereUnderTree) return true;
  else return false
}

// shit refactor to use vectors
// shit refactor to use rectangles
function isInBounds(x: Int, y: Int, width: Int, height: Int): boolean {
  asseq(Math.abs(x % 1), 0)
  asseq(Math.abs(y % 1), 0)
  asseq(Math.abs(width % 1), 0)
  asseq(Math.abs(height % 1), 0)

  return (!(x < 0 || y < 0 || x > width - 1 || y > height - 1))
}

asseq(isInBounds(0, 0, 1, 1), true)
asseq(isInBounds(-1, 0, 1, 1), false)
asseq(isInBounds(0, -1, 1, 1), false)
asseq(isInBounds(1, 0, 1, 1), false)
asseq(isInBounds(0, 1, 1, 1), false)
asseq(isInBounds(2, 0, 3, 1), true)
asseq(isInBounds(3, 0, 3, 1), false)

const gifts = [[["#"]]] satisfies Gifts;
const boardWidth = 1;
const boardHeight = 1;

// shit use vector & type here?
type PlacedGift = {
  type: number;
  x: number;
  y: number;
};

function placeGift(pieceIndex: Int, location: Vector, previousPlacedGifts: PlacedGift[]): PlacedGift[] {
  return [...previousPlacedGifts, { type: pieceIndex, x: location.x, y: location.y }]
}

asseq(placeGift(0, { x: 0, y: 0 }, []),
  [{ type: 0, x: 0, y: 0 }])

asseq(placeGift(0, { x: 0, y: 0 }, placeGift(0, { x: 1, y: 0 }, [])),
  [{ type: 0, x: 1, y: 0 }, { type: 0, x: 0, y: 0 }])

function isValidPlacement(gifts: Gifts, width: Int, height: Int, placedGifts: PlacedGift[]): boolean {

  // if any gift has a location out of bounds
  // WARNING: assumes wrapped gifts, and verified that they aren't jagged 
  for (const placedGift of placedGifts) {
    if (!isInBounds(placedGift.x, placedGift.y, width, height)) {
      return false;
    }

    const gift = nonNull(gifts[placedGift.type])
    const giftHeight = gift.length;
    const giftWidth = nonNull(gift[0]).length

    // shit replace this with something like "rectangles completely overlap"
    const lowerRightGiftCorner = add({
      x: giftWidth
        - 1, y: giftHeight - 1
    }, { x: placedGift.x, y: placedGift.y });
    if (!isInBounds(lowerRightGiftCorner.x, lowerRightGiftCorner.y, width, height)) {
      return false;
    }
  }

  for (const [placedGift1Index, placedGift1] of placedGifts.entries()) {
    for (const [placedGift2Index, placedGift2] of placedGifts.entries()) {
      if (placedGift1Index === placedGift2Index) continue;

      const gift1 = nonNull(gifts[placedGift1.type]);

      // shit todo performance optimization, if the gifts have no overlapping bounds then they cannot have gift tiles on each other
      // shit todo performance optimization, if we sort the gifts top to bottom, then we can find the first gift at the correct height, and then only run until the gifts are at different heights again. all of the ones before and after definitely don't overlap.
      // shit todo performance optimization, if we have a single board, then we can "cache" which tiles are occupied by storing the field and flipping the bits. maybe its faster to get the exact one instead.
      // shit todo performance optimization, we only need to loop through the tiles that are actually #'s, not the .'s


      for (const [gift1LocalY, gift1Row] of gift1.entries()) {
        for (const [gift1LocalX, gift1Cell] of gift1Row.entries())
          if (gift1Cell === "#") {
            const globalPos = add({ y: placedGift1.y, x: placedGift1.x }, { x: gift1LocalX, y: gift1LocalY });


            // note, need to verify this is checking the correct direction. 
            const gift2Local = diff(globalPos, { x: placedGift2.x, y: placedGift2.y })
            const gift2Cell = nonNull((gifts[placedGift2.type])?.[gift2Local.y]?.[gift2Local.x])
            if (gift2Cell === "#") {
              // console.log("there is overlap");
              return false
            }
          }
      }
    }
  }

  return true;
}

asseq(isValidPlacement(gifts, boardWidth, boardHeight, placeGift(0, { x: 0, y: 0 }, [])), true)
asseq(isValidPlacement(gifts, boardWidth, boardHeight, placeGift(0, { x: 1, y: 0 }, [])), false)
asseq(isValidPlacement([[["#", "#"]]], boardWidth, boardHeight, placeGift(0, { x: 0, y: 0 }, [])), false)
// shit create placeGifts helper?
// shit create a type for a "validated board", and then we have to pass validated boards to each other?
asseq(isValidPlacement([[["#"]]], boardWidth, boardHeight, placeGift(0, { x: 0, y: 0 }, placeGift(0, { x: 0, y: 0 }, []))), false, "overlapping pieces ")
asseq(isValidPlacement([[["#"]]], 0, 0, []), true)

asseq(canFitString(`1:
#

1x1: 1`), true)

asseq(canFitString(`1:
#

0x0: 1`), false)

// SIGURD, TO JUMP BACK IN TO IMPLEMENTATION, you have to implement trying to place a piece at a specific point, and then check if the board is valid.
asseq(canFitString(`1:
#

1x1: 2`), false)

asseq(canFitString(`1:
#

2x1: 2`), true)

asseq(canFitString(`1:
##
##

2x1: 1`), false)

asseq(canFitString(`1:
#.#

2x2: 1`), false)

asseq(canFitString(`1:
.#

1x1: 1`), true)

asseq(canFitString(`1:
##

2x2: 2`), true)

asseq(canFitString(`1:
##

2x2: 3`), false)

/**
# simple and correct algorithm, in small steps
implement only the first tree
implement all rotations of the pieces
try every single placement
create a function which verifies that a complete board is correct
create a "progress bar" which gives the total count, and how far we have gotten, with this naive implementation
create edge cases: no wanted gifts, a single gift, board is too small for a single gift, a piece which fits completely inside another piece. 2 pieces that need to be rotated to fit. 2 pieces that need to be flipped to fit.

# performance optimizations
when the first correct placement is found for a tree, then stop that.
we can dedupe work between trees by reusing the same placement for multiple trees
we can also cache gift placements, although we should probably try to avoid using multiple gift placements
if not done already, then we should not make a distinction between 2 different gifts of the same shape
instead of placing the gifts randomly, then we can place them only directly beside the previous gift
we can use multiple cores.
maybe we can cache 2-and-2 placements of directly near each other gifts, so we have some simple shapes we can put beside each other?
maybe when we try to place the next gift, then we only check the gifts that potentially overlap this gift.
we should probably check on memory usage, to make sure that we don't overload the cpu and cause thrashing and stuff.
start with a single one.
where we use the function to verify that a complete board is correct, we can use a previously "verified" board where we don't have to check all the other pieces against each other, but instead use the function where we have the previous board and we try to place a single gift, then we only have to check the gift against the pieces which are already on the board.
when we try to place a new piece, only try to place it if the bounding box is outside of the bounds, not if the first piece is outside of the bounds
// shit todo performance optimization: when we try place the next piece, and it is valid, then we can memoize the result. this means we have to stably stringify the current placement, and check if it is in the set. we have to double check memory tho if we do that.
// shit todo performance optimization to handle rotations and flippings for the whole board, calculate all of the permutations of the current board whenever you memoize it, that way can do the calculation for only one of the permutations. this does mean we have to create some code to do permutations on placements.

# correctness verifications
we can count the amonut of tests it tried, then sort the amount by correct and incorrect tests.
at the beginning, when we rule out a test then we should always double check by actually checking if the thing is valid.
when we do a performance optimization then we can check that the amount of duplicate work has been reduced, and that all of the cases have been checked, or somehow are known that they do not fit.
we need to check that the trees are correctly marked as fillable or not able to be filled

*/

console.log("done")