import { expect, mock } from "bun:test";
import { add, ass, asseq, assInt, diff, nonNull, type Vector } from "./common";


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

export type Gift = ("." | "#")[][];
export type Gifts = Gift[];
type Int = number;
type GiftCounts = Int[];
type Tree = { giftCounts: GiftCounts } & RootRectangle;
type Puzzle = { gifts: Gifts; trees: Tree[] };
type GiftsWithRotations = Gifts[];

function shape(matrix: unknown[][]): [number, number] {
  const firstRow = nonNull(matrix[0]);
  assMatrixSquare(matrix);

  return [matrix.length, firstRow.length];
}

function parseInput(input: string): Puzzle {
  const matchedInput = input.trim().split("\n\n");

  const giftsTuple = matchedInput.toSpliced(matchedInput.length - 1);

  asseq(giftsTuple.length, matchedInput.length - 1);

  const gifts: Gifts = giftsTuple.map(function mapGiftsTuple(
    giftStringWithNumber
  ) {
    const giftString = nonNull(giftStringWithNumber.split(":")[1]);
    return stringToGift(giftString);
  });

  const trees: Tree[] = nonNull(matchedInput[matchedInput.length - 1])
    .split("\n")
    .map(function mapTree(tree) {
      const [size, giftsCountString] = tree.split(": ");
      const [widthString, heightString] = nonNull(size).split("x");

      assInt(nonNull(widthString));
      assInt(nonNull(heightString));

      const giftCounts = nonNull(giftsCountString)
        .split(" ")
        .map(function mapGiftCounts(numString) {
          assInt(numString);
          return Number(numString);
        });

      const width = Number(widthString);
      const height = Number(heightString);

      asseq(giftCounts.length, gifts.length);

      return { width, height, giftCounts };
    });

  return { gifts, trees };
}

function validateTest() {
  const parsedInput = parseInput(testInput2);
  const gifts = parsedInput.gifts;
  const first_gift: Gift = nonNull(gifts[0]);

  assmeq(
    first_gift,
    `###
     ##.
     ##.`
  );

  gifts.forEach(function forEachGifts(gift) {
    asseq(shape(gift), [3, 3]);
  });
}

validateTest();

export function stringToMatrix(input: string): string[][] {
  const matrix = input
    .trim()
    .split("\n")
    .map(function splitStringToMatrixMapRow(row) {
      return row.trim().split("");
    });
  const firstRow = nonNull(matrix[0]);

  ass(
    matrix.every(function checkMatrixEveryRowLength(row) {
      return row.length === firstRow.length;
    })
  );

  return matrix;
}

function matrixToString(stringMatrix: string[][]): string {
  return stringMatrix
    .map(function matrixToStringMapRow(row) {
      return row.join("");
    })
    .join("\n");
}

export function assmeq(stringMatrix: string[][], expected: string): void {
  const visualizedBoard = matrixToString(stringMatrix);

  const cleanViz = function cleanViz(input: string): string {
    return input.trim().replaceAll(/\s+/g, "\n");
  };

  expect(
    cleanViz(visualizedBoard),
    "the visualized matrix is not correct. it is \n---\n" +
    visualizedBoard +
    "\n---"
  ).toBe(cleanViz(expected));
}

export function stringToGift(giftString: string): Gift {
  return assIsGiftMatrix(stringToMatrix(giftString));
}

function assMatrix<T extends string>(
  stringMatrix: unknown[][],
  assertionCallback: (input: unknown) => input is T
): T[][] {
  ass(
    stringMatrix.every(function checkMatrixEveryRow(row) {
      return row.every(function checkMatrixEveryChar(char) {
        return assertionCallback(char);
      });
    })
  );

  return stringMatrix;
}

function isGiftChar(char: unknown): char is "#" | "." {
  return char === "#" || char === ".";
}

export function assIsGiftMatrix(stringMatrix: string[][]): Gift {
  return assMatrix<"#" | ".">(stringMatrix, isGiftChar);
}

export function wrapGiftString(giftString: string): Gift {
  return wrapGift(stringToGift(giftString));
}

export function wrapGift(input: Gift): Gift {
  let rows = [...input];
  while (
    rows.every(function checkRowsEveryFirstChar(row) {
      return row[0] === ".";
    })
  ) {
    rows = rows.map(function mapRowsToSpliced(row) {
      return row.toSpliced(0, 1);
    });
  }

  while (
    rows.every(function checkRowsEveryLastChar(row) {
      return row[row.length - 1] === ".";
    })
  ) {
    rows = rows.map(function mapRowsToSpliced(row) {
      return row.toSpliced(row.length - 1, 1);
    });
  }

  while (
    nonNull(rows[0]).every(function checkRowsEveryFirstChar(char) {
      return char === ".";
    })
  ) {
    rows = rows.toSpliced(0, 1);
  }

  while (
    nonNull(rows[rows.length - 1]).every(function checkRowsEveryLastChar(char) {
      return char === ".";
    })
  ) {
    rows = rows.toSpliced(rows.length - 1, 1);
  }
  return rows;
}


export function canFitString(input: string): boolean {
  const parsed2: Puzzle = parseInput(input);
  asseq(parsed2.trees.length, 1);

  const gifts = parsed2.gifts.map(function mapGifts(gift) {
    return wrapGift(gift);
  });

  const tree: Tree = nonNull(parsed2.trees[0]);


  const dedupedTransmutedGifts = gifts.map(createDedupedTransmutations);

  const anyValidPlacements = (someValidPlacements(
    dedupedTransmutedGifts,
    tree
  ));

  return anyValidPlacements;
}

type RootRectangle = { width: Int; height: Int };
type Rectangle = Vector & RootRectangle;

function assVector(
  vector: Vector | undefined | null
): asserts vector is Vector {
  ass(vector);
  toNumInt(vector.x);
  toNumInt(vector.y);
}

function assRootRectangle(
  rootRectangle: RootRectangle | null | undefined
): asserts rootRectangle is RootRectangle {
  ass(rootRectangle);
  toNumInt(rootRectangle.width);
  toNumInt(rootRectangle.height);
  ass(rootRectangle.width > 0);
  ass(rootRectangle.height > 0);
}

export function isInBounds(vector: Vector, rectangle: RootRectangle): boolean {
  assVector(vector);
  assRootRectangle(rectangle);

  return !(
    vector.x < 0 ||
    vector.y < 0 ||
    vector.x > rectangle.width - 1 ||
    vector.y > rectangle.height - 1
  );
}

type PlacedGift = {
  type: Int;
  rotation: Int;
} & Vector;

/** hint: place multiple gifts on a board by using createBoard with an array of placedGifts */
export function placeGift(board: Board, placement: PlacedGift): Board {
  return {
    ...board,
    placedGifts: [...board.placedGifts, placement],
  };
}


function assMatrixSquare(matrix: unknown[][]): void {
  ass(
    matrix.every(function checkMatrixEveryRowLength(row) {
      return row.length === nonNull(matrix[0]).length;
    })
  );
}

function matrixToRootRectangle(matrix: unknown[][]): RootRectangle {
  assMatrixSquare(matrix);
  return { width: nonNull(matrix[0]).length, height: matrix.length };
}

function rectangleIsInside(inner: Rectangle, outer: RootRectangle): boolean {
  return (
    isInBounds(inner, outer) &&
    isInBounds(
      add(
        {
          x: inner.width - 1,
          y: inner.height - 1,
        },
        { x: inner.x, y: inner.y }
      ),
      outer
    )
  );
}

function placedGiftToGift(
  giftsWithRotations: GiftsWithRotations,
  placedGift: PlacedGift
) {
  return nonNull(giftsWithRotations[placedGift.type]?.[placedGift.rotation]);
}

function placedGiftToBoundingRectangle(
  giftsWithRotations: GiftsWithRotations,
  placedGift: PlacedGift
): Rectangle {
  const gift = placedGiftToGift(giftsWithRotations, placedGift);
  const giftRootRectangle = matrixToRootRectangle(gift);

  return {
    ...placedGift,
    ...giftRootRectangle,
  };
}

let isValidBoardRuns = 0;

export function isValidBoard(board: Board): boolean {
  isValidBoardRuns++;

  const placedGifts = board.placedGifts;
  const giftsWithRotations = board.gifts;

  giftsWithRotations.forEach(function forEachGiftsWithRotations(
    giftWithRotations
  ) {
    return giftWithRotations.forEach(function forEachGiftWithRotations(gift) {
      assMatrixSquare(gift);
      asseq(wrapGift(gift), gift);
    });
  });

  for (const placedGift of placedGifts) {
    const giftRectangle = placedGiftToBoundingRectangle(
      giftsWithRotations,
      placedGift
    );

    if (!rectangleIsInside(giftRectangle, board)) return false;
  }

  for (const [
    placedMultiGift1Index,
    placedMultiGift1,
  ] of placedGifts.entries()) {
    for (const [
      placedMultiGift2Index,
      placedMultiGift2,
    ] of placedGifts.entries()) {
      if (placedMultiGift1Index === placedMultiGift2Index) continue;

      const gift1 = placedGiftToGift(giftsWithRotations, placedMultiGift1);

      for (const [gift1LocalY, gift1Row] of gift1.entries()) {
        for (const [gift1LocalX, gift1Cell] of gift1Row.entries())
          if (gift1Cell === "#") {
            const globalPos = add(
              { y: placedMultiGift1.y, x: placedMultiGift1.x },
              { x: gift1LocalX, y: gift1LocalY }
            );

            const gift2Local = diff(globalPos, {
              x: placedMultiGift2.x,
              y: placedMultiGift2.y,
            });

            const gift2 = placedGiftToGift(
              giftsWithRotations,
              placedMultiGift2
            );

            const gift2Cell = gift2?.[gift2Local.y]?.[gift2Local.x];

            if (gift2Cell === "#") {
              return false;
            }
          }
      }
    }
  }

  return true;
}

export type Board = {
  gifts: GiftsWithRotations;
  placedGifts: PlacedGift[];
} & RootRectangle;

// shit this method is probably not necessary?
export function createBoard(options: {
  gifts: Gifts;
  width: Int;
  height: Int;
  placedGifts?: PlacedGift[];
}): Board {
  return {
    gifts: options.gifts.map(createDedupedTransmutations),
    width: options.width,
    height: options.height,
    placedGifts: options.placedGifts ?? [],
  };
}

type VisualizedBoard = string[][];

function boardToVizualizedBoard(board: Board): VisualizedBoard {
  let warning = "";

  const boardMatrix: string[][] = Array(board.height)
    .fill([] as string[])
    .map(function fillBoardMatrix() {
      return Array(board.width).fill(".");
    });

  for (const [placedGiftIndex, placedGift] of board.placedGifts.entries()) {
    const letter = nonNull("ABCDEFGHIJKLMNOPQRSTUVWYZ"[placedGiftIndex]);
    const giftShape = placedGiftToGift(board.gifts, placedGift);

    // shit use helper to loop through 2d array

    giftShape.map(function giftShapeMapRow(row, localY2) {
      row.map(function giftShapeMapCol(char, localX2) {
        if (char === "#") {
          const globalX = placedGift.x + localX2;
          const globalY = placedGift.y + localY2;

          const row = boardMatrix[globalY];
          // shit create helper to set a single value in a 2d char matrix

          const char = row?.[globalX];
          if (char === undefined) {
            warning =
              "---piece is outside of board:" +
              globalX +
              "," +
              globalY +
              "\n" +
              matrixToString(giftShape) +
              "\n---";
          } else if (char === "X") {
            // nothing
          } else if (char === ".") {
            ass(row);
            row[globalX] = letter;
          } else {
            ass(row);
            row[globalX] = "X";
          }
        }
      });
    });
  }

  if (warning) {
    console.log(warning);
  }

  return boardMatrix;
}

export function visualizeBoard(board: Board, expected: string) {
  assmeq(boardToVizualizedBoard(board), expected);
}


function toNumInt(input: Int | undefined | null): Int {
  ass(typeof input === "number");
  ass(Math.abs(input) % 1 === 0);
  return input;
}



function combinationsWithCheck_old(combinationsInput: Int[], check: CombinationChecker): boolean {

  ass(
    combinationsInput.every(
      (radix) =>
        typeof radix === "number"
        && Number.isSafeInteger(radix)
        && radix !== 0
    )
  );

  const allCombinations: Int[][] = [];

  const acc: Int[] = Array.from({ length: combinationsInput.length }).map(() => 0);
  let done = false;

  const advance = (): void => {
    let pos = acc.length - 1;

    while (true) {
      acc[pos] = toNumInt(acc[pos]) + 1;

      if (toNumInt(acc[pos]) === toNumInt(combinationsInput[pos])) {
        acc[pos] = 0;
        pos--;
      } else {
        return;
      }

      if (pos === -1) {
        done = true;
        return;
      }
    }
  };

  const generator: Generator = () => {
    if (done) {
      return undefined;
    } else {
      const prevAcc = [...acc];

      advance();

      ass(acc.every(num => num == 0 || toNumInt(num)))
      return prevAcc;
    }
  };

  let nextItem = generator();

  while (nextItem !== undefined) {
    allCombinations.push(nextItem);
    nextItem = generator();
  }


  const anyValidPlacements: boolean = allCombinations.some((combination) =>
    check(combination)
  )
  return anyValidPlacements;
}

export function someValidPlacements(
  gifts: GiftsWithRotations,
  tree: Tree,
): boolean {
  const giftCounts = tree.giftCounts;
  const board = tree;

  asseq(gifts.length, giftCounts.length);

  ass(board.width !== 0)
  ass(board.height !== 0)

  const combinationsInput: Int[] = giftCounts.flatMap((giftCount,
    index) => {
    const giftRotationCount = nonNull(gifts[index]).length;
    ass(giftRotationCount !== 0)
    return Array(giftCount)
      .fill([giftRotationCount, board.width, board.height])
      .flat();
  });

  const combinationToGiftPlacement = (combination: Int[]): PlacedGift[] => {
    asseq(combination.length % 3, 0)
    const giftPlacement: PlacedGift[] = [];

    let currentGiftMultiIndex = 0;
    for (const [type, giftCount] of giftCounts.entries()) {
      for (let i = 0; i < giftCount; i++) {
        const newLocal = combination[currentGiftMultiIndex * 3];
        if (newLocal === undefined) {
          return giftPlacement;
        }
        giftPlacement.push({
          type,
          rotation: toNumInt(newLocal),
          x: toNumInt(combination[currentGiftMultiIndex * 3 + 1]),
          y: toNumInt(combination[currentGiftMultiIndex * 3 + 2]),
        });

        currentGiftMultiIndex++;
      }
    }

    asseq(currentGiftMultiIndex * 3, combination.length);
    return giftPlacement;
  }

  const anyValidPlacements = combinationsWithCheck(combinationsInput, (combination: Int[]): boolean => {

    if (combination.length % 3 !== 0) return true;

    console.log(combination.join(", "))

    const giftPlacement = combinationToGiftPlacement(combination)

    const isPlacementValid = isValidBoard(
      { ...board, placedGifts: giftPlacement, gifts }
    );

    return isPlacementValid;
  })

  return anyValidPlacements;
}


type Generator = () => Int[] | undefined;

export type CombinationChecker = (c: Int[]) => boolean;

export function combinationsWithCheck(combinationsInput: Int[], check: CombinationChecker): boolean {
  ass(
    combinationsInput.every(
      (radix) => typeof radix === "number" && Number.isSafeInteger(radix) && radix !== 0
    ), "invalid inputs found: " + combinationsInput.join()
  );

  console.log("starting recurse")
  const recurse = (combination: Int[]): boolean => {
    const isValid = check(combination)


    if (combination.length === combinationsInput.length) {
      if (isValid) {
        console.log("valid solution found")
        return true;
      }
    }

    if (isValid) {
      return recurse([...combination, 0])
    }
    else if (combination.length > 0) {
      const acc = [...combination]
      while (true) {

        if (acc.length === 0) break;
        acc[acc.length - 1] = toNumInt(acc[acc.length - 1]) + 1;



        if (toNumInt(acc[acc.length - 1]) >= toNumInt(combinationsInput[acc.length - 1])) {
          toNumInt(acc.pop())
        } else {
          break;
        }
      }

      if (acc.length === 0) return false;

      return recurse(acc)
    }

    return false
  }


  return recurse([0])

}



export function flipGiftVertically<T>(gift: T[][]): T[][] {
  return gift.toReversed();
}

export function transposeGift<T>(gift: T[][]): T[][] {
  return nonNull(gift[0]).map((_, colIndex) => gift.map((row) => nonNull(row[colIndex])));
}

export function rotateGift90Right<T>(gift: T[][]): T[][] {
  return transposeGift(flipGiftVertically(gift));
}

export function createAllTransmutations<T>(gift: T[][]): T[][][] {
  return [
    gift,
    rotateGift90Right(gift),
    rotateGift90Right(rotateGift90Right(gift)),
    rotateGift90Right(rotateGift90Right(rotateGift90Right(gift))),
    flipGiftVertically(gift),
    flipGiftVertically(rotateGift90Right(gift)),
    flipGiftVertically(rotateGift90Right(rotateGift90Right(gift))),
    flipGiftVertically(
      rotateGift90Right(rotateGift90Right(rotateGift90Right(gift)))
    ),
  ];
}

export function createDedupedTransmutations<T>(gift: T[][]): T[][][] {
  const uniqueTransmutations = new Set<string>();

  return createAllTransmutations(gift).filter(
    function filterDedupedTransmutations(transmutation) {
      const stringTransmutation = matrixToString(
        assMatrix(transmutation, isGiftChar)
      );

      if (uniqueTransmutations.has(stringTransmutation)) {
        return false;
      } else {
        uniqueTransmutations.add(stringTransmutation);
        return true;
      }
    }
  );
}

/**
# simple and correct algorithm, in small steps
[ ] create a "progress bar" which gives the total count, and how far we have gotten, with this naive implementation
 [ ] needs a generator function because all placements take too much time to compute.
[x] implement only the first tree
[x] implement all rotations of the pieces
[x] try every single placement
[x] create a function which verifies that a complete board is correct
[ ] create edge cases: 
[x] no wanted gifts
[x] a single gift
[x] board is too small for a single gift
[x] a piece which fits completely inside another piece
[x] 2 pieces that need to be rotated to fit
[x] 2 pieces that need to be flipped to fit

# performance optimizations
[ ] when the first correct placement is found for a tree, then stop that.
[ ] we can dedupe work between trees by reusing the same placement for multiple trees
[ ] we can also cache gift placements, although we should probably try to avoid using multiple gift placements
[ ] if not done already, then we should not make a distinction between 2 different gifts of the same shape
[ ] instead of placing the gifts randomly, then we can place them only directly beside the previous gift
[ ] we can use multiple cores.
[ ] maybe we can cache 2-and-2 placements of directly near each other gifts, so we have some simple shapes we can put beside each other?
[ ] maybe when we try to place the next gift, then we only check the gifts that potentially overlap this gift.
[ ] we should probably check on memory usage, to make sure that we don't overload the cpu and cause thrashing and stuff.
[ ] start with a single one.
[ ] where we use the function to verify that a complete board is correct, we can use a previously "verified" board where we don't have to check all the other pieces against each other, but instead use the function where we have the previous board and we try to place a single gift, then we only have to check the gift against the pieces which are already on the board.
[ ] when we try to place a new piece, only try to place it if the bounding box is outside of the bounds, not if the first piece is outside of the bounds
[ ] when we try place the next piece, and it is valid, then we can memoize the result. this means we have to stably stringify the current placement, and check if it is in the set. we have to double check memory tho if we do that.
[ ] to handle rotations and flippings for the whole board, calculate all of the permutations of the current board whenever you memoize it, that way can do the calculation for only one of the permutations. this does mean we have to create some code to do permutations on placements.
[ ] if the gifts have no overlapping bounds then they cannot have gift tiles on each other
[ ] if we sort the gifts top to bottom, then we can find the first gift at the correct height, and then only run until the gifts are at different heights again. all of the ones before and after definitely don't overlap.
[ ] if we have a single board, then we can "cache" which tiles are occupied by storing the field and flipping the bits. maybe its faster to get the exact one instead.
[ ] we only need to loop through the tiles that are actually #'s, not the .'s
[ ] when we place a piece, reuse the previous board.
[ ] use a matrix when placing and un-placing gifts
[ ] create a set and then make a placement deterministic, and then check if the placement has already been checked.
[] use the set to check rotational symmetries
[] start at the middle and whenever you place something then expand the area. maybe start at the middle? 
  that means that we have to change the order of when we place tiles
  we also have to move things closer to the center
  we also have to keep track of the bounding border
[] in the recursion, when we place or remove a gift, then we edit the current board instead of creating a new one.

# correctness verifications
[ ] we can count the amonut of tests it tried, then sort the amount by correct and incorrect tests.
[ ] at the beginning, when we rule out a test then we should always double check by actually checking if the thing is valid.
[ ] when we do a performance optimization then we can check that the amount of duplicate work has been reduced, and that all of the cases have been checked, or somehow are known that they do not fit.
[ ] we need to check that the trees are correctly marked as fillable or not able to be filled
[ ] print the board when it is finished
[ ] log the amount of check calls per second
[ ] debug check call speed
[] create a type for a "validated board", and then we have to pass validated boards to each other?

# DX
[x] proper test suite
[x] no comments (current comments are ok)
[ ] remove tests and check usages
[ ] formatting, after type check and test?
[ ] 
[ ] 

*/

console.log("done");
console.log({ isValidBoardRuns })