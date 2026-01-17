import { Temporal } from "temporal-polyfill";
import {
  add,
  ass,
  asseq,
  assInt,
  diff,
  nonNull,
  type Rang,
  type Vector,
} from "./common.ts";
import { d12RealInput } from "./d12-realinput.ts";
import { validateHeaderName } from "node:http";

const defaultOpt = true;

const perfLog = 100000;

export let opts = {
  isProfiling: false,
  isValidBoardRuns: 0,
  logCurrentBoardAndProgress: defaultOpt,
  logHasAlreadyBeenValidated: true,
  reuseOptimizations: 0,
  validateAdjacencyToAnyGift: true, // this needs to be true, we are dropping some valid boards
  validateEveryGiftCellInside: defaultOpt,
  validateGifts: defaultOpt,
  validateLastGiftCellInside: defaultOpt,
  validateRadices: defaultOpt,
  validateRadicesMoreStuff: defaultOpt,
  validateThrowOnGiftOutside: defaultOpt,
  validateTooLargeGifts: defaultOpt,
};

const optsDuplicate = { ...opts };

export function resetOpts() {
  opts = optsDuplicate;
}

export type Gift = ("." | "#")[][];
export type Gifts = Gift[];
export type Int = number;
type GiftCounts = Int[];
export type Tree = { giftCounts: GiftCounts } & RootRectangle;
export type Puzzle = { gifts: Gifts; trees: Tree[] };
export type GiftsWithRotations = Gifts[];

export function disableValidations() {
  const enableValidations = false;
  opts = {
    isProfiling: false,
    isValidBoardRuns: 0,
    logCurrentBoardAndProgress: enableValidations,
    logHasAlreadyBeenValidated: true,
    reuseOptimizations: 0,
    validateAdjacencyToAnyGift: true,
    validateEveryGiftCellInside: enableValidations,
    validateGifts: enableValidations,
    validateLastGiftCellInside: enableValidations,
    validateRadices: enableValidations,
    validateRadicesMoreStuff: enableValidations,
    validateThrowOnGiftOutside: enableValidations,
    validateTooLargeGifts: enableValidations,
  };
}

export function bigBoy() {
  disableValidations();

  opts.isProfiling = true;

  console.log("start bigboy");
  asseq(countValidTrees(d12RealInput), -1);
  console.log("end bigboy");
}

export function matrixToString(stringMatrix: string[][]): string {
  return stringMatrix
    .map(function matrixToStringMapRow(row) {
      return row.join("");
    })
    .join("\n");
}

export function parseInput(input: string): Puzzle {
  const matchedInput = input
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim()
    .split("\n\n");

  const giftsTuple = matchedInput.toSpliced(matchedInput.length - 1);

  asseq(giftsTuple.length, matchedInput.length - 1);

  const gifts: Gifts = giftsTuple.map(
    function mapGiftsTuple(giftStringWithNumber) {
      const giftString = nonNull(giftStringWithNumber.split(":")[1]);
      return stringToGift(giftString);
    },
  );

  const trees: Tree[] = nonNull(matchedInput.at(-1))
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

      return { giftCounts, height, width };
    });

  return { gifts, trees };
}

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
    }),
  );

  return matrix;
}

export function stringToGift(giftString: string): Gift {
  return assIsGiftMatrix(stringToMatrix(giftString));
}

function assMatrix<T extends string>(
  stringMatrix: unknown[][],
  assertionCallback: (input: unknown) => input is T,
): T[][] {
  ass(
    stringMatrix.every(function checkMatrixEveryRow(row) {
      return row.every(function checkMatrixEveryChar(char) {
        return assertionCallback(char);
      });
    }),
  );

  return stringMatrix;
}

function isGiftChar(char: unknown): char is "#" | "." {
  return char === "#" || char === ".";
}

export function assIsGiftMatrix(stringMatrix: string[][]): Gift {
  return assMatrix<"#" | ".">(stringMatrix, isGiftChar);
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
      return row.at(-1) === ".";
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
    nonNull(rows.at(-1)).every(function checkRowsEveryLastChar(char) {
      return char === ".";
    })
  ) {
    rows = rows.toSpliced(rows.length - 1, 1);
  }
  return rows;
}

type RootRectangle = { width: Int; height: Int };
export type Rectangle = Vector & RootRectangle;

function assVector(
  vector: Vector | undefined | null,
): asserts vector is Vector {
  ass(vector);
  toNumInt(vector.x);
  toNumInt(vector.y);
}

function assRootRectangle(
  rootRectangle: RootRectangle | null | undefined,
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

export function assMatrixSquare(matrix: unknown[][]): void {
  ass(
    matrix.every(function checkMatrixEveryRowLength(row) {
      return row.length === nonNull(matrix[0]).length;
    }),
  );
}

export type PlacedGift = {
  type: Int;
  rotation: Int;
} & Vector;

function matrixToRootRectangle(matrix: unknown[][]): RootRectangle {
  assMatrixSquare(matrix);
  return { height: matrix.length, width: nonNull(matrix[0]).length };
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
        { x: inner.x, y: inner.y },
      ),
      outer,
    )
  );
}

function placedGiftToGift(
  giftsWithRotations: GiftsWithRotations,
  placedGift: Pick<PlacedGift, "type" | "rotation">,
) {
  return nonNull(giftsWithRotations[placedGift.type]?.[placedGift.rotation]);
}

function placedGiftToBoundingRectangle(
  giftsWithRotations: GiftsWithRotations,
  placedGift: PlacedGift,
): Rectangle {
  const gift = placedGiftToGift(giftsWithRotations, placedGift);
  const giftRootRectangle = matrixToRootRectangle(gift);

  return {
    ...placedGift,
    ...giftRootRectangle,
  };
}

const startTime = performance.now();

export function isValidBoard(board: Board): boolean {
  if (opts.validateTooLargeGifts && hasTooLargeGifts(board.gifts, board)) {
    return false;
  }

  const { placedGifts } = board;
  // shit rename to giftswithrotations on board
  const giftsWithRotations = board.gifts;

  if (opts.validateGifts) {
    for (const giftWithRotations of giftsWithRotations) {
      for (const gift of giftWithRotations) {
        assMatrixSquare(gift);
        asseq(wrapGift(gift), gift);
      }
    }
  }

  const giftInside = (placedGift: PlacedGift): boolean => {
    const giftRectangle = placedGiftToBoundingRectangle(
      giftsWithRotations,
      placedGift,
    );

    const isRectangleInside = rectangleIsInside(giftRectangle, board);

    if (
      opts.validateThrowOnGiftOutside &&
      giftRectangle.width <= board.width &&
      giftRectangle.height <= board.height
    ) {
      ass(
        isRectangleInside,
        `gift was placed outside of the board. placed gift ${JSON.stringify(
          giftRectangle,
        )} should be inside of ${JSON.stringify({
          height: board.height,
          width: board.width,
        })}. gift shape:
    ---
    ${matrixToString(placedGiftToGift(giftsWithRotations, placedGift))}
    ---`,
      );
    }

    return isRectangleInside;
  };

  if (opts.validateEveryGiftCellInside) {
    for (const placedGift of placedGifts) {
      if (!giftInside(placedGift)) return false;
    }
  } else if (opts.validateLastGiftCellInside) {
    const lastGift: PlacedGift = nonNull(placedGifts.at(-1));
    if (!giftInside(lastGift)) return false;
  }

  const placedMultiGift1Index = placedGifts.length - 1;
  const placedMultiGift1 = nonNull(placedGifts.at(-1));

  for (const [
    placedMultiGift2Index,
    placedMultiGift2,
  ] of placedGifts.entries()) {
    if (
      placedMultiGift1Index !== placedMultiGift2Index &&
      giftsOverlap(giftsWithRotations, placedMultiGift1, placedMultiGift2)
    )
      return false;
  }

  if (opts.validateAdjacencyToAnyGift) {
    const is2OrMoreGifts = placedGifts.length <= 2;
    const isAdjacentToAnyGift =
      is2OrMoreGifts ||
      placedGifts.some(
        (otherGift, otherGiftIndex) =>
          placedMultiGift1Index !== otherGiftIndex &&
          isAdjacent(giftsWithRotations, placedMultiGift1, otherGift),
      );

    if (!isAdjacentToAnyGift) return false;
  } else {
    const otherGift = placedGifts.at(-2);
    if (otherGift) {
      const isAdjacentToAnyGift = isAdjacent(
        giftsWithRotations,
        placedMultiGift1,
        otherGift,
      );
      if (!isAdjacentToAnyGift) return false;
    }
  }

  return true;
}

const reset = "\x1b[0m";

const colors = {
  black: "\x1b[30m",
  blue: "\x1b[34m",
  brightRed: "\x1b[91m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  purple: "\x1b[35m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  yellow: "\x1b[33m",
};

const colorMap = {
  A: colors.blue,
  B: colors.yellow,
  C: colors.cyan,
  D: colors.green,
  E: colors.purple,
  // F: colors.white,
  X: colors.brightRed,
};

function colorize(rawInput: string): string {
  let input = rawInput;
  const colorEntries = Object.entries(colorMap);

  for (const [char, colorCode] of colorEntries) {
    // console.log(colorCode + char + reset);
    input = input.replaceAll(char, colorCode + char + reset);
  }

  return input;
}

export function isAdjacent(
  giftsWithRotations: GiftsWithRotations,
  placedGiftA: PlacedGift,
  placedGiftB: PlacedGift,
): boolean {
  // giftsOverlapCount++;

  const gift1 = placedGiftToGift(giftsWithRotations, placedGiftA);
  const gift2 = placedGiftToGift(giftsWithRotations, placedGiftB);

  for (const [gift1LocalY, gift1Row] of gift1.entries()) {
    for (const [gift1LocalX, gift1Cell] of gift1Row.entries())
      if (gift1Cell === "#") {
        const globalPos = add(
          { x: placedGiftA.x, y: placedGiftA.y },
          { x: gift1LocalX, y: gift1LocalY },
        );

        const gift2Local = diff(globalPos, {
          x: placedGiftB.x,
          y: placedGiftB.y,
        });

        const directions: [Vector, Vector, Vector, Vector] = [
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: 0, y: -1 },
        ];

        const neighborsOnGift2Local = directions.map((direction) =>
          add(direction, gift2Local),
        );

        return neighborsOnGift2Local.some(
          (neghborOnGift2Local) =>
            gift2?.[neghborOnGift2Local.y]?.[neghborOnGift2Local.x] === "#",
        );
      }
  }
  return false;
}

export let giftsOverlapCount = 0;

export function giftsOverlap(
  giftsWithRotations: GiftsWithRotations,
  placedMultiGift1: PlacedGift,
  placedMultiGift2: PlacedGift,
): boolean {
  giftsOverlapCount++;

  const doGiftsCoarseOverlap: boolean = giftsCoarseOverlap(
    giftsWithRotations,
    placedMultiGift1,
    placedMultiGift2,
  );

  if (!doGiftsCoarseOverlap) return false;

  const gift1 = placedGiftToGift(giftsWithRotations, placedMultiGift1);
  const gift2 = placedGiftToGift(giftsWithRotations, placedMultiGift2);

  for (const [gift1LocalY, gift1Row] of gift1.entries()) {
    for (const [gift1LocalX, gift1Cell] of gift1Row.entries())
      if (gift1Cell === "#") {
        const globalPos = add(
          { x: placedMultiGift1.x, y: placedMultiGift1.y },
          { x: gift1LocalX, y: gift1LocalY },
        );

        const gift2Local = diff(globalPos, {
          x: placedMultiGift2.x,
          y: placedMultiGift2.y,
        });

        const gift2Cell = gift2?.[gift2Local.y]?.[gift2Local.x];

        if (gift2Cell === "#") {
          return true;
        }
      }
  }
  return false;
}

function giftsCoarseOverlap(
  giftsWithRotations: GiftsWithRotations,
  placedGift1: PlacedGift,
  placedGift2: PlacedGift,
): boolean {
  const gift1 = nonNull(
    giftsWithRotations[placedGift1.type]?.[placedGift1.rotation],
  );

  const gift2 = nonNull(
    giftsWithRotations[placedGift2.type]?.[placedGift2.rotation],
  );

  if (
    placedGift1.x > placedGift2.x + nonNull(gift2[0]).length - 1 ||
    placedGift2.x > placedGift1.x + nonNull(gift1[0]).length - 1
  )
    return false;

  if (
    placedGift1.y > placedGift2.y + gift2.length - 1 ||
    placedGift2.y > placedGift1.y + gift1.length - 1
  )
    return false;

  return true;
}

export type Board = {
  gifts: GiftsWithRotations;
  placedGifts: PlacedGift[];
} & RootRectangle;

// shit max safe integer
// shit handle -0 and +0
// shit not infinite
// shit not nan
// shit rename to asint
function toNumInt(input: Int | undefined | null): Int {
  ass(typeof input === "number");
  ass(Math.abs(input) % 1 === 0);
  return input;
}

export function combinationToPlacedGifts(
  combination: Int[],
  giftCounts: Int[],
): PlacedGift[] {
  asseq(combination.length % 3, 0);
  const giftPlacement: PlacedGift[] = [];

  let currentGiftMultiIndex = 0;

  // shit todo performance optimization is to not create this array,
  // but instead use the combination directly, and then exit on the
  // first invalid piece that would be placed

  for (const [type, giftCount] of giftCounts.entries()) {
    for (let i = 0; i < giftCount; i++) {
      const newLocal = combination[currentGiftMultiIndex * 3];
      if (newLocal === undefined) {
        return giftPlacement;
      }
      giftPlacement.push({
        rotation: toNumInt(newLocal),
        type,
        x: toNumInt(combination[currentGiftMultiIndex * 3 + 1]),
        y: toNumInt(combination[currentGiftMultiIndex * 3 + 2]),
      });

      currentGiftMultiIndex++;
    }
  }

  asseq(currentGiftMultiIndex * 3, combination.length);
  return giftPlacement;
}

export function someValidPlacements(
  giftsWithRotations: GiftsWithRotations,
  tree: Tree,
): boolean {
  const validPlacementCounts = countAllValidPlacementsInner(giftsWithRotations, [tree]);
  ass(validPlacementCounts.length===1)
  const validPlacementCount = nonNull(validPlacementCounts[0])
  return (validPlacementCount > 0)
}

function hasTooLargeGifts(
  giftsWithRotations: GiftsWithRotations,
  board: RootRectangle,
): boolean {
  for (const giftWithRotations of giftsWithRotations) {
    for (const gift of giftWithRotations) {
      const giftRootRectangle = matrixToRootRectangle(gift);

      const maxGiftSize = Math.max(
        giftRootRectangle.width,
        giftRootRectangle.height,
      );
      const minGiftSize = Math.min(
        giftRootRectangle.width,
        giftRootRectangle.height,
      );

      const maxBoardSize = Math.max(board.width, board.height);
      const minBoardSize = Math.min(board.width, board.height);

      const hasBigEnoughBigAxis = maxGiftSize <= maxBoardSize;
      const hasBigEnoughSmallAxis = minGiftSize <= minBoardSize;

      if (!(hasBigEnoughBigAxis && hasBigEnoughSmallAxis)) {
        return true;
      }
    }
  }
  return false;
}

export type CombinationChecker = (combination: Int[]) => boolean;

function createRange(to: Int): Int[] {
  const retval: Int[] = [];
  for (let i = 0; i < to; i++) {
    retval.push(i);
  }
  return retval;
}

function combinationsWithCheck(
  combinationsInput: Int[],
  check: CombinationChecker,
  whenAllChildrenAreInvalid?: (combination: Int[]) => void,
): boolean {
  let hasFound1ValidCombination = false;

  return combinationsWithNext<Int>(
    function f5(combination) {
      const isRoot = combination.length === 0;
      const combinationsInputValue = combinationsInput[combination.length];
      const isLeaf = combinationsInputValue === undefined;

      if (!isLeaf && isRoot) {
        return createRange(combinationsInputValue);
      }

      const isPartiallyValid = check(combination);

      if (isLeaf && isPartiallyValid) {
        hasFound1ValidCombination = true;
        return [];
      }

      if (isLeaf && !isPartiallyValid) {
        return [];
      }

      if (!isLeaf && isPartiallyValid) {
        return createRange(combinationsInputValue);
      }

      if (!(isLeaf || isPartiallyValid)) {
        return [];
      }

      ass(false);
    },
    (_combination) => hasFound1ValidCombination,
    whenAllChildrenAreInvalid,
  );
}

export type GetNext<T = unknown> = (combination: T[]) => T[];
export type IsComplete<T = unknown> = (combination: T[]) => boolean;

// todo cleanup, maybe use recursion instead
export function combinationsWithNext<T>(
  getNext: GetNext<T>,
  isComplete: IsComplete<T> = () => false,
  whenAllChildrenAreInvalid?: (combination: Int[]) => void,
): boolean {
  const currentCombinations: T[][] = [];
  const indices: Int[] = [];

  // biome-ignore lint/nursery/noUnnecessaryConditions: while loop is used right now, maybe better solution exists?
  while (true) {
    let nextValue: T[] = [];
    while (nextValue.length === 0) {
      // const currentCombination: T[] = indices.map(function f3(radix, index): T {return currentCombinations[index]![radix]!});
      const currentCombination: T[] = radicesToCurrentCombination(
        currentCombinations,
        indices,
      );
      nextValue = getNext(currentCombination);

      if (nextValue.length === 0) {
        if (isComplete(currentCombination)) return true;
        const lastIndex = indices.at(-1);
        if (lastIndex === undefined) {
          return false;
        }
        ass(typeof lastIndex === "number");
        indices[indices.length - 1] = lastIndex + 1;
        // biome-ignore lint/nursery/noUnnecessaryConditions: while loop is used right now, maybe better solution exists?
        while (true) {
          if (
            nonNull(currentCombinations.at(-1))[nonNull(indices.at(-1))] ===
            undefined
          ) {
            indices.pop();

            if (whenAllChildrenAreInvalid !== undefined)
              whenAllChildrenAreInvalid([...indices]);

            const newLocal = indices.at(-1);
            if (typeof newLocal === "number") {
              indices[indices.length - 1] = newLocal + 1;
              currentCombinations.pop();
            } else {
              return false;
            }
          } else {
            break;
          }
        }
      } else {
        break;
      }
    }
    ass(nextValue);
    currentCombinations.push(nextValue);
    indices.push(0);
  }
}

export function radicesToCurrentCombination<T = unknown>(
  currentCombinations: T[][],
  radices: Int[],
): T[] {
  if (opts.validateRadices) {
    ass(
      radices.length === currentCombinations.length,
      `${radices.length} radices but ${currentCombinations.length} combinations`,
    );
  }

  if (opts.validateRadicesMoreStuff) {
    return radices.map(function f1(radix, index): T {
      const row = currentCombinations[index];
      ass(row !== undefined, "there are more radices than combinations");
      const value = row[toNumInt(radix)];
      ass(
        value !== undefined,
        `a radix was out of bounds. radices[${radices}] combinationLengths[${currentCombinations.map((combination) => combination.length)}]`,
      );
      return value;
    });
  }
  return radices.map(function f6(radix, index): T {
    // biome-ignore lint/style/noNonNullAssertion: this is the unsafe version, safe version is done in tests
    return currentCombinations[index]![radix]!;
  });
}

export function flipGiftVertically<T>(gift: T[][]): T[][] {
  return gift.toReversed();
}

export function transposeGift<T>(gift: T[][]): T[][] {
  return nonNull(gift[0]).map((_, colIndex) =>
    gift.map((row) => nonNull(row[colIndex])),
  );
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
      rotateGift90Right(rotateGift90Right(rotateGift90Right(gift))),
    ),
  ];
}

export function createDedupedTransmutations<T>(gift: T[][]): T[][][] {
  const uniqueTransmutations = new Set<string>();

  return createAllTransmutations(gift).filter(
    function filterDedupedTransmutations(transmutation) {
      const stringTransmutation = matrixToString(
        assMatrix(transmutation, isGiftChar),
      );

      if (uniqueTransmutations.has(stringTransmutation)) {
        return false;
      }
      uniqueTransmutations.add(stringTransmutation);
      return true;
    },
  );
}

export function getProgress(
  totalCombination: Int[],
  currentCombination: Int[],
): number {
  const ranges = lerpMultiple(totalCombination, currentCombination);
  const progress = nonNull(ranges.at(-1)).to;

  ass(
    Number.isFinite(progress),
    `${totalCombination.join(", ")}---${currentCombination.join(
      ", ",
    )} ${progress} `,
  );

  ass(progress >= 0);
  ass(progress <= 1);

  return progress;
}

export function lerpMultiple(totals: number[], currents: number[]): Rang[] {
  const new2: Rang[] = [];
  let currentRange: Rang = { from: 0, to: 1 };

  for (const [index, total] of totals.entries()) {
    const current = currents[index];
    if (typeof current !== "number") {
      break;
    }

    const { from, to } = lerp(total - 1, current);
    currentRange = lerpRange(currentRange, { from, to });
    new2.push(currentRange);
  }

  return new2;
}

export function lerp(total: number, current: number): Rang {
  return {
    from: current / (total + 1),
    to: (current + 1) / (total + 1),
  };
}

export function lerpRange(bigRange: Rang, smallRange: Rang): Rang {
  const newStart = lerp2(bigRange.from, bigRange.to, smallRange.from);
  const newEnd = lerp2(bigRange.from, bigRange.to, smallRange.to);

  return { from: newStart, to: newEnd };
}

function lerp2(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

const hasBeenValidatedCount = 0;

export function hasBeenValidated(
  placedGifts: PlacedGift[],
  seen: Seen,
): boolean {
  return seen.has(boardToString(placedGifts));
}

export function setHasBeenValidated(
  placedGifts: PlacedGift[],
  seen: Seen,
): void {
  seen.add(boardToString(placedGifts));
}

function boardToString(placedGifts: PlacedGift[]) {
  return placedGifts
    .flatMap((placedGift) =>
      [placedGift.type, placedGift.rotation, placedGift.x, placedGift.y].join(
        ",",
      ),
    )
    .toSorted()
    .join("|");
}

export function countValidTrees(input: string): number {
  const parsedInput = parseInput(input);

  const wrappedAndRotatedGifts: GiftsWithRotations = parsedInput.gifts
    .map((gift) => wrapGift(gift))
    .map(createDedupedTransmutations);

  return parsedInput.trees.filter((tree): boolean => {
    const isTreeValid = someValidPlacements(wrappedAndRotatedGifts, tree);
    return isTreeValid;
  }).length;
}

type VisualizedBoard = string[][];

export function boardToVizualizedBoard(board: Board): {
  visualizedBoard: VisualizedBoard;
  warning: string | undefined;
} {
  let warning = "";

  const boardMatrix: string[][] = new Array(board.height)
    .fill([] as string[])
    .map(function fillBoardMatrix() {
      return new Array(board.width).fill(".");
    });

  for (const placedGift of board.placedGifts) {
    const chars = "ABCDE";
    const letter = nonNull(chars[placedGift.type % chars.length]);
    const giftShape = placedGiftToGift(board.gifts, placedGift);

    // shit use helper to loop through 2d array

    for (const [localY2, row] of giftShape.entries()) {
      for (const [localX2, char] of row.entries()) {
        if (char === "#") {
          const globalX = placedGift.x + localX2;
          const globalY = placedGift.y + localY2;

          const row2 = boardMatrix[globalY];
          // shit create helper to set a single value in a 2d char matrix
          const char2 = row2?.[globalX];
          if (char2 === undefined) {
            warning =
              "---piece is outside of board:" +
              globalX +
              "," +
              globalY +
              "\n" +
              matrixToString(giftShape) +
              "\n---";
          } else if (char2 === "X") {
            // nothing
          } else if (char2 === ".") {
            ass(row2);
            row2[globalX] = letter;
          } else {
            ass(row2);
            row2[globalX] = "X";
          }
        }
      }
    }
  }

  if (warning) {
    console.log(warning);
  }

  return { visualizedBoard: boardMatrix, warning };
}

export function countAllValidPlacements(input: string): Int[] {
  const parsed2: Puzzle = parseInput(input);

  const gifts = parsed2.gifts.map(function mapGifts(gift) {
    return wrapGift(gift);
  });

  const giftsWithRotations = gifts.map(createDedupedTransmutations);

  const validPlacementCounts = countAllValidPlacementsInner(
    giftsWithRotations,
    parsed2.trees,
  );

  return validPlacementCounts;
}

function countAllValidPlacementsInner(
  giftsWithRotations: GiftsWithRotations,
  trees: Tree[],
): Int[] {
  const validPlacementCounts: Int[] = trees.map((tree): Int => {
    const { giftCounts } = tree;
    const board = tree;

    asseq(giftsWithRotations.length, giftCounts.length);

    if (board.width <= 0) {
      return 0;
    }
    if (board.height <= 0) {
      return 0;
    }

    if (hasTooLargeGifts(giftsWithRotations, board)) {
      return 0;
    }

    const countValidPlacements: Int = combinationsWithCheck2(
      giftCounts,
      giftsWithRotations,
      board.width,
      board.height,
    );

    return countValidPlacements;
  });

  return validPlacementCounts;
}

type Seen = Set<string>;

const newLocal_1 = (
  combination: Int[],
  board: RootRectangle,
  giftsWithRotations: GiftsWithRotations,
  seen: Seen,
) => {
  if (combination.length % 4 !== 0 || combination.length === 0) return;

  const placedGifts: PlacedGift[] = combinationToPlacedGifts2(combination);

  const isPlacementValid = isValidBoard({
    ...board,
    gifts: giftsWithRotations,
    placedGifts,
  });

  if(opts.logHasAlreadyBeenValidated && (isPlacementValid)){

    
    
    // shit gifts with rotations seem to have been doubly defined here
    setHasBeenValidated(placedGifts, seen);
    
  }
};

function chunk<T>(arr: readonly T[], size: number): T[][] {
  if (size <= 0) throw new Error("size must be > 0");

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function countOccurrences(values: number[]): Record<number, number> {
  return values.reduce(
    (acc, v) => {
      acc[v] = (acc[v] ?? 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );
}

//                 // shit i think this thing is done twice. dedupe.
//                 const currentGiftCounts: Int[] = totalGiftCounts.map((_) => 0);

//                 for (const placedGift of placedGifts) {
//                   const index = placedGift.type;
//                   ass(currentGiftCounts[index] !== undefined);

//                   currentGiftCounts[index]++;
//                 }

//                 asseq(currentGiftCounts.length, totalGiftCounts.length);

//                 if (
//                   !totalGiftCounts.every((totalGiftCount, index) => {
//                     const currentGiftCount = nonNull(currentGiftCounts[index]);
//                     ass(totalGiftCount >= currentGiftCount);
//                     return totalGiftCount === currentGiftCount;
//                   })
//                 ) {
//                   return false;
//                 }

export function combinationToPlacedGifts2(combination: Int[]): PlacedGift[] {
  ass(combination.length % 4 === 0);
  const chunked = chunk(combination, 4);
  return chunked.map(
    (arr): PlacedGift => ({
      rotation: nonNull(arr[1]),
      type: nonNull(arr[0]),
      x: nonNull(arr[2]),
      y: nonNull(arr[3]),
    }),
  );
}

function getAvailableTypes(
  placedGifts: PlacedGift[],
  totalGiftCounts: GiftCounts,
): Int[] {
  const placedGiftTypes = placedGifts.map((placedGift) => placedGift.type);

  const occurences = countOccurrences(placedGiftTypes);

  const availableTypes = totalGiftCounts
    .map((totalGiftCount, index) => {
      const currentGiftTypeCount = occurences[index] ?? 0;

      return totalGiftCount > currentGiftTypeCount ? index : undefined;
    })
    .filter((i) => i !== undefined);
  return availableTypes;
}

export function getNextGiftPlacementCombination(
  _combination: Int[],
  totalGiftCounts: GiftCounts,
  giftsWithRotations: GiftsWithRotations,
  board: RootRectangle,
  seen: Seen,
): Int[] | "completelyValid" {
  // if modulo 4 is 0, then we have to check partially and completely valid.

  if (_combination.length % 4 === 0) {
    const placedGifts = combinationToPlacedGifts2(_combination);

    if (_combination.length === 0) {
      return getAvailableTypes(placedGifts, totalGiftCounts);
    }

    const isValidatedBefore = hasBeenValidated(placedGifts, seen);
    if (isValidatedBefore) {
      return [];
    }


    const isPartiallyValid = isValidBoard({
      gifts: giftsWithRotations,
      height: board.height,
      placedGifts,
      width: board.width,
    });

    // if it is not partially valid, then return empty array.
    if (!isPartiallyValid) {
      return [];
    }

    const availableTypes = getAvailableTypes(placedGifts, totalGiftCounts);
    // if it is partially valid and it has not been seen before, then we should
    //   choose a type from the available types, and return the valid types in an array..

    if (availableTypes.length === 0) {
      return "completelyValid";
    }
    return availableTypes;
  }

  // if both partially valid and completely valid, then increase the "found complete placements" by 1,
  //   and return empty array.

  // if modulo 4 is 1, then we have chosen type, and need to choose rotation,
  //   we can pick any one rotation
  if (_combination.length % 4 === 1) {
    const type = nonNull(_combination.at(-1));
    const availableRotations = nonNull(giftsWithRotations[type]).length;
    return createRange(availableRotations);
  }

  // if modulo 4 is 2, then we have chosen type and rotation, and need to choose x.
  //   this should range such that the gift's width is always inside the board width.

  if (_combination.length % 4 === 2) {
    const boardWidth = board.width;
    const type = nonNull(_combination.at(-2));
    const rotation = nonNull(_combination.at(-1));
    const giftShape = placedGiftToGift(giftsWithRotations, { rotation, type }); // the function to get a gift shape based on type and rotation
    const giftWidth = nonNull(giftShape[0]?.length);
    const maxX = boardWidth - giftWidth;

    return createRange(maxX + 1);
  }

  // if modulo 4 is 3, then we need to choose y, such that the gift's height is inside the board height

  if (_combination.length % 4 === 3) {
    const boardHeight = board.height;
    const type = nonNull(_combination.at(-3));
    const rotation = nonNull(_combination.at(-2));
    const giftShape = placedGiftToGift(giftsWithRotations, { rotation, type }); // the function to get a gift shape based on type and rotation
    const giftHeight = giftShape.length;
    const maxY = boardHeight - giftHeight;

    return createRange(maxY + 1);
  }

  // if (isLeaf && isPartiallyValid) {
  //   _hasFound1ValidCombination = true;
  //   return [];
  // }
  ass(false);
}

export function c(f: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(f)) {
    console.log(key, ":", value);
  }
}

function sortPlacedGifts(placedGifts: PlacedGift[]): PlacedGift[] {
  return placedGifts.toSorted(
    (a, b) =>
      a.type - b.type || a.rotation - b.rotation || a.x - b.x || a.y - b.y,
  );
}

export function combinationsWithCheck2(
  totalGiftCounts: Int[],
  giftsWithRotations: GiftsWithRotations,
  // shit change to rootrectangle
  width: Int,
  height: Int,
): Int {
  type MyT = Int;

  const seen: Seen = new Set<string>();

  const validBoards: Set<string> = new Set<string>();

  combinationsWithNext2<MyT>(
    function f5(combination): MyT[] {
      const completelyValidOrNextEntries = getNextGiftPlacementCombination(
        combination,
        totalGiftCounts,
        giftsWithRotations,
        { height, width },
        seen,
      );
      

      if (completelyValidOrNextEntries === "completelyValid") {
        const placedGifts = combinationToPlacedGifts2(combination);

        const sortedPlacedGifts = sortPlacedGifts(placedGifts);
        validBoards.add(JSON.stringify(sortedPlacedGifts));

        return [];
      }
      // if is partially valid and completely valid, and not seen before,

      return completelyValidOrNextEntries;
    },
    (combination) =>
      newLocal_1(combination, { height, width }, giftsWithRotations, seen),
  );
  return validBoards.size;
}

function combinationsWithNext2<T>(
  getNext: GetNext<T>,
  // isComplete: IsComplete<T> = () => false,
  whenAllChildrenAreInvalid: (combination: Int[]) => void,
): boolean {
  const currentCombinations: T[][] = [];
  const indices: Int[] = [];

  // biome-ignore lint/nursery/noUnnecessaryConditions: while loop is used right now, maybe better solution exists?
  while (true) {
    let nextValue: T[] = [];
    while (nextValue.length === 0) {
      const currentCombination: T[] = radicesToCurrentCombination(
        currentCombinations,
        indices,
      );
      nextValue = getNext(currentCombination);

      if (nextValue.length === 0) {
        const lastIndex = indices.at(-1);
        if (lastIndex === undefined) {
          ass(false);
        }
        ass(typeof lastIndex === "number");
        indices[indices.length - 1] = lastIndex + 1;
        // biome-ignore lint/nursery/noUnnecessaryConditions: while loop is used right now, maybe better solution exists?
        while (true) {
          if (
            nonNull(currentCombinations.at(-1))[nonNull(indices.at(-1))] ===
            undefined
          ) {
            indices.pop();

            if (whenAllChildrenAreInvalid !== undefined)
              whenAllChildrenAreInvalid([...indices]);

            const newLocal = indices.at(-1);
            if (typeof newLocal === "number") {
              indices[indices.length - 1] = newLocal + 1;
              currentCombinations.pop();
            } else {
              // ass(false)
              return false;
            }
          } else {
            break;
          }
        }
      } else {
        break;
      }
    }
    ass(nextValue);
    currentCombinations.push(nextValue);
    indices.push(0);
  }
}

/**
# performance optimizations

[ ] we can dedupe work between trees by reusing the same placement for multiple trees
  pseudo: if we place a next piece, then only place it if it would cause the bounding box to be inside another AND it would not cause

[ ] we can also cache gift placements, although we should probably try to avoid using multiple gift placements
[ ] if not done already, then we should not make a distinction between 2 different gifts of the same shape
[ ] instead of placing the gifts randomly, then we can place them only directly beside the previous gift
[ ] we can use multiple cores
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

*/
// notes: 419000000 is the total amount of is valid board runs for all the test outputs
