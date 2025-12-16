import { expect } from "bun:test";
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

type Gift = ("." | "#")[][];
type Gifts = Gift[];
type Int = number;
type GiftCounts = Int[];
type Tree = { width: Int; height: Int; giftCounts: GiftCounts };
type Puzzle = { gifts: Gifts; trees: Tree[] };
type GiftsWithRotations = Gifts[];

function shape(twoDArray: unknown[][]): [number, number] {
  const firstRow = nonNull(twoDArray[0]);
  ass(twoDArray.every((row) => row.length === firstRow.length));
  return [twoDArray.length, firstRow.length];
}

function parseInput(input: string): Puzzle {
  const matchedInput = input.split("\n\n");

  const giftsTuple = matchedInput.toSpliced(matchedInput.length - 1);

  asseq(giftsTuple.length, matchedInput.length - 1);

  const giftsShit: Gifts = giftsTuple.map((giftStringWithNumber) => {
    const giftString = nonNull(giftStringWithNumber.split(":")[1])
      .trim()
      .split("\n");

    return giftString.map((line) => {
      const splittedLines = line.split("");

      return splittedLines.map((char) => {
        ass(char === "#" || char === ".");

        return char;
      });
    });
  });

  const trees: Tree[] = nonNull(matchedInput[matchedInput.length - 1])
    .split("\n")
    .map((tree) => {
      const [size, gifts] = tree.split(": ");
      const [widthString, heightString] = nonNull(size).split("x");

      assInt(nonNull(widthString));
      assInt(nonNull(heightString));

      const giftCounts = nonNull(gifts)
        .split(" ")
        .map((numString) => {
          assInt(numString);
          return Number(numString);
        });

      const width = Number(widthString);
      const height = Number(heightString);

      asseq(giftCounts.length, giftsShit.length);

      return { width, height, giftCounts };
    });

  return { gifts: giftsShit, trees };
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

  gifts.forEach((gift) => asseq(shape(gift), [3, 3]));
}

validateTest();

function stringToMatrix(input: string): string[][] {
  const matrix = input
    .trim()
    .split("\n")
    .map((row) => row.trim().split(""));
  const firstRow = nonNull(matrix[0]);

  ass(matrix.every((row) => row.length === firstRow.length));

  return matrix;
}

function matrixToString(stringMatrix: string[][]): string {
  return stringMatrix.map((row) => row.join("")).join("\n");
}

function assmeq(stringMatrix: string[][], expected: string): void {
  const visualizedBoard = matrixToString(stringMatrix);

  const cleanViz = (input: string): string => {
    return input.trim().replaceAll(/\s+/g, "\n");
  };

  expect(
    cleanViz(visualizedBoard),
    "the visualized matrix is not correct. it is \n---\n" +
      visualizedBoard +
      "\n---"
  ).toBe(cleanViz(expected));
}

// function map2d<T>(
//   field: Field,
//   callback: (cell: boolean, loc: Vector) => T
// ): T[][] {
//   return field.map((row, y) => row.map((cell, x) => callback(cell, { x, y })));
// }

function assMatrix<T extends string>(
  stringMatrix: string[][],
  assertionCallback: (input: string) => input is T
): T[][] {
  ass(
    stringMatrix.every((row) => row.every((char) => assertionCallback(char)))
  );

  return stringMatrix;
}

function testStringToMatrix() {
  const giftString = `##
                      ..`;

  const matrix = stringToMatrix(giftString);

  // @ts-expect-error
  const gift: Gift = matrix;

  asseq(gift, [
    ["#", "#"],
    [".", "."],
  ]);

  assmeq(
    gift,
    `##
     ..`
  );

  // shit create assMatrix which takes a validator function and turns a matrix into a more strictly typed element matrix. no interdependencies
  const gift2: Gift = assMatrix(
    matrix,
    (char: unknown) => char === "#" || char === "."
  );

  assmeq(
    gift2,
    `##
     ..`
  );

  // shit create function to validate present char
}

testStringToMatrix();

function trimGift(gift: string): string {
  let rows = gift.split("\n").map((row) => {
    const chars = row.split("");
    ass(chars.every((char) => char === "." || char == "#"));
    return chars;
  });

  const trimmedGifts = trimGift2(rows);

  return trimmedGifts.map((row) => row.join("")).join("\n");
}

asseq(trimGift(`#`), "#");
asseq(trimGift(`##`), "##");
asseq(
  trimGift(`#
#`),
  `#
#`
);
asseq(trimGift(`.#`), "#");
asseq(trimGift(`#.`), "#");
asseq(trimGift(`#.#`), "#.#");
asseq(
  trimGift(
    `
#.#
#..`.trim()
  ),
  `
#.#
#..`.trim()
);
asseq(trimGift("..#"), "#");
asseq(
  trimGift(`.
.
#`),
  "#"
);
asseq(
  trimGift(`#
.
.`),
  "#"
);

// shit why are there 2?
function trimGift2(input: Gift): Gift {
  let rows = [...input];
  while (rows.every((row) => row[0] === ".")) {
    rows = rows.map((row) => row.toSpliced(0, 1));
  }

  while (rows.every((row) => row[row.length - 1] === ".")) {
    rows = rows.map((row) => row.toSpliced(row.length - 1, 1));
  }

  while (nonNull(rows[0]).every((char) => char === ".")) {
    rows = rows.toSpliced(0, 1);
  }

  while (nonNull(rows[rows.length - 1]).every((char) => char === ".")) {
    rows = rows.toSpliced(rows.length - 1, 1);
  }
  return rows;
}

asseq(
  trimGift2([
    [".", ".", "."],
    [".", "#", "."],
    [".", ".", "."],
  ]),
  [["#"]]
);

function canFitString(input: string): boolean {
  const parsed2: Puzzle = parseInput(input);
  asseq(parsed2.trees.length, 1);

  const gifts = parsed2.gifts.map((gift) => {
    return trimGift2(gift);
  });

  const firstTree = nonNull(parsed2.trees[0]);

  const allGiftPlacements = createAllPlacements(
    gifts,
    firstTree.giftCounts,
    firstTree.width,
    firstTree.height
  );

  const validPlacements = allGiftPlacements.map((giftPlacement) =>
    isValidBoard(
      createBoard({
        gifts,
        width: firstTree.width,
        height: firstTree.height,
        placedGifts: giftPlacement,
      })
    )
  );

  const anyValidPlacements = validPlacements.some(Boolean);

  return anyValidPlacements;
}

// shit refactor to use vectors
// shit refactor to use rectangles
function isInBounds(x: Int, y: Int, width: Int, height: Int): boolean {
  asseq(Math.abs(x % 1), 0);
  asseq(Math.abs(y % 1), 0);
  asseq(Math.abs(width % 1), 0);
  asseq(Math.abs(height % 1), 0);

  return !(x < 0 || y < 0 || x > width - 1 || y > height - 1);
}

asseq(isInBounds(0, 0, 1, 1), true);
asseq(isInBounds(-1, 0, 1, 1), false);
asseq(isInBounds(0, -1, 1, 1), false);
asseq(isInBounds(1, 0, 1, 1), false);
asseq(isInBounds(0, 1, 1, 1), false);
asseq(isInBounds(2, 0, 3, 1), true);
asseq(isInBounds(3, 0, 3, 1), false);

// shit use vector & type here?
type PlacedGift = {
  type: Int;
  rotation: Int;
} & Vector;

function placeGift(board: Board, placement: PlacedGift): Board {
  return {
    ...board,
    placedGifts: [...board.placedGifts, placement],
  };
}

function testPlaceGift() {
  const board = createBoard({ gifts: [[["#"]]], width: 1, height: 1 });
  asseq(placeGift(board, { type: 0, rotation: 0, x: 0, y: 0 }).placedGifts, [
    { type: 0, rotation: 0, x: 0, y: 0 },
  ]);

  asseq(
    placeGift(placeGift(board, { type: 0, rotation: 0, x: 1, y: 0 }), {
      type: 0,
      rotation: 0,
      x: 0,
      y: 0,
    }).placedGifts,
    [
      { type: 0, rotation: 0, x: 1, y: 0 },
      { type: 0, rotation: 0, x: 0, y: 0 },
    ]
  );
}

testPlaceGift();

function isValidBoard(board: Board): boolean {
  const placedGifts = board.placedGifts;
  const width = board.width;
  const height = board.height;
  const giftsShapes = board.gifts;

  // WARNING: assumes wrapped gifts, and verified that every row is the same length
  for (const placedGift of placedGifts) {
    if (!isInBounds(placedGift.x, placedGift.y, width, height)) {
      return false;
    }

    const gift = nonNull(giftsShapes[placedGift.type]?.[placedGift.rotation]);
    const giftHeight = gift.length;
    const giftWidth = nonNull(gift[0]).length;

    // shit replace this with something like "rectangles completely overlap"
    const lowerRightGiftCorner = add(
      {
        x: giftWidth - 1,
        y: giftHeight - 1,
      },
      { x: placedGift.x, y: placedGift.y }
    );
    if (
      !isInBounds(lowerRightGiftCorner.x, lowerRightGiftCorner.y, width, height)
    ) {
      return false;
    }
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

      const gift1 = nonNull(
        giftsShapes[placedMultiGift1.type]?.[placedMultiGift1.rotation]
      );

      // shit todo performance optimization, if the gifts have no overlapping bounds then they cannot have gift tiles on each other
      // shit todo performance optimization, if we sort the gifts top to bottom, then we can find the first gift at the correct height, and then only run until the gifts are at different heights again. all of the ones before and after definitely don't overlap.
      // shit todo performance optimization, if we have a single board, then we can "cache" which tiles are occupied by storing the field and flipping the bits. maybe its faster to get the exact one instead.
      // shit todo performance optimization, we only need to loop through the tiles that are actually #'s, not the .'s

      for (const [gift1LocalY, gift1Row] of gift1.entries()) {
        for (const [gift1LocalX, gift1Cell] of gift1Row.entries())
          if (gift1Cell === "#") {
            const globalPos = add(
              { y: placedMultiGift1.y, x: placedMultiGift1.x },
              { x: gift1LocalX, y: gift1LocalY }
            );

            const gift2Local = diff(
              {
                x: placedMultiGift2.x,
                y: placedMultiGift2.y,
              },
              globalPos
            );

            const gift2Cell =
              giftsShapes[placedMultiGift2.type]?.[placedMultiGift2.rotation]?.[
                gift2Local.y
              ]?.[gift2Local.x];
            if (gift2Cell === "#") {
              return false;
            }
          }
      }
    }
  }

  return true;
}

type Board = {
  gifts: GiftsWithRotations;
  width: Int;
  height: Int;
  placedGifts: PlacedGift[];
};

function createBoard(options: {
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

function testIsValidPlacement() {
  const gifts = [[["#"]]] satisfies Gifts;
  const boardWidth = 1;
  const boardHeight = 1;

  const board = createBoard({ gifts, width: boardWidth, height: boardHeight });

  asseq(
    isValidBoard(placeGift(board, { type: 0, rotation: 0, x: 0, y: 0 })),
    true
  );
  asseq(
    isValidBoard(
      placeGift(
        createBoard({ gifts, width: boardWidth, height: boardHeight }),
        { type: 0, rotation: 0, x: 1, y: 0 }
      )
    ),
    false
  );
  asseq(
    isValidBoard(
      placeGift(
        createBoard({
          gifts: [[["#", "#"]]],
          width: boardWidth,
          height: boardHeight,
        }),

        { type: 0, rotation: 0, x: 0, y: 0 }
      )
    ),
    false
  );
  // shit create placeGifts helper?
  // shit create a type for a "validated board", and then we have to pass validated boards to each other?
  asseq(
    isValidBoard(
      placeGift(
        placeGift(
          createBoard({
            gifts: [[["#"]]],
            width: boardWidth,
            height: boardHeight,
          }),

          { type: 0, rotation: 0, x: 0, y: 0 }
        ),

        { type: 0, rotation: 0, x: 0, y: 0 }
      )
    ),
    false,
    "overlapping pieces "
  );
  asseq(
    isValidBoard(createBoard({ gifts: [[["#"]]], width: 0, height: 0 })),
    true
  );

  asseq(
    isValidBoard(
      createBoard({
        gifts: [[["#"]]],
        width: 2,
        height: 1,
        placedGifts: [
          { type: 0, rotation: 0, x: 0, y: 0 },
          { type: 0, rotation: 0, x: 1, y: 0 },
        ],
      })
    ),
    true
  );

  // shit create a helper which turns a string into a gift

  const visualizeBoard = (board: Board, expected: string) => {
    // shit create helper to turn 2d char matrix to string
    // shit create helper to turn string to 2d char matrix
    // shit rename gift to giftmatrix

    // create a 2d array of the board
    // for each placed gift, set the corresponding cells which are # to #
    const boardMatrix: ("#" | "." | "X")[][] = Array(board.height)
      .fill([] as string[])
      .map(() => {
        return Array(board.width).fill(".");
      });

    for (const placedGift of board.placedGifts) {
      const giftShape = nonNull(
        board.gifts[placedGift.type]?.[placedGift.rotation]
      );
      // shit use helper to loop through 2d array
      giftShape.map((row, y) => {
        row.map((char, x) => {
          if (char === "#") {
            const row = nonNull(boardMatrix[y]);
            // shit create helper to set a single value in a 2d char matrix
            const char = nonNull(row[x]);
            if (char === ".") {
              row[x] = "#";
            } else if (char === "#") {
              row[x] = "X";
            } else {
              ass(char === "X");
            }
          }
        });
      });
    }

    assmeq(boardMatrix, expected);
  };

  let boardState = createBoard({
    gifts: [[["#", "#"]]] satisfies Gifts,
    width: 2,
    height: 2,
  });

  expect(boardState).toStrictEqual({
    gifts: [
      // types
      [
        // rotations
        [["#", "#"]], // shape
        [["#"], ["#"]], // shape
      ],
    ],
    width: 2,
    height: 2,
    placedGifts: [],
  });

  visualizeBoard(
    boardState,
    `..
     ..`
  );

  boardState = placeGift(boardState, { type: 0, rotation: 1, x: 0, y: 0 });

  visualizeBoard(
    boardState,
    `#.
     #.`
  );

  boardState = placeGift(boardState, { type: 0, rotation: 0, x: 0, y: 0 });

  visualizeBoard(
    boardState,
    `X#
     #.`
  );

  // shit todo the board should be invalid

  asseq(isValidBoard(boardState), false);
}

testIsValidPlacement();

function toNumInt(input: Int | undefined | null): Int {
  ass(typeof input === "number");
  ass(Math.abs(input) % 1 === 0);
  return input;
}

function createAllPlacements(
  gifts: Gifts,
  giftCounts: GiftCounts,
  width: Int,
  height: Int
): PlacedGift[][] {
  asseq(gifts.length, giftCounts.length);

  const combinationsInput = giftCounts.flatMap((giftCount) =>
    Array(giftCount).fill([width, height]).flat()
  );

  const unmappedplacements = createCombinations(...combinationsInput);

  const allPlacements: PlacedGift[][] = unmappedplacements.map((placement) => {
    const singleGiftPlacements: PlacedGift[] = [];

    let currentGiftMultiIndex = 0;
    for (const [giftType, giftCount] of giftCounts.entries()) {
      for (let i = 0; i < giftCount; i++) {
        const x = toNumInt(placement[currentGiftMultiIndex * 2]);
        const y = toNumInt(placement[currentGiftMultiIndex * 2 + 1]);
        singleGiftPlacements.push({ type: giftType, rotation: 0, x, y });

        currentGiftMultiIndex++;
      }
    }

    asseq(currentGiftMultiIndex * 2, placement.length);
    return singleGiftPlacements;
  });

  const placementCount = countPlacements(giftCounts, width, height);
  asseq(allPlacements.length, placementCount);
  return allPlacements;
}

function createCombinations(...args: Int[]) {
  const allCombinations: Int[][] = [];

  function recurse(index: Int, accumulator: Int[]): void {
    if (index === args.length) {
      allCombinations.push([...accumulator]);

      return;
    }

    const first = args[0];
    ass(typeof first === "number");

    const currentCount = args[index];
    ass(typeof currentCount === "number");
    for (let i = 1; i <= currentCount; i++) {
      accumulator.push(i - 1);
      recurse(index + 1, accumulator);
      accumulator.pop();
    }
  }

  recurse(0, []);

  return allCombinations;
}

function countCombinations(...args: Int[]): number {
  return args.reduce((prev, cur, _i, _arr) => prev * cur, 1);
}

function testCreateCombinations() {
  asseq(createCombinations(1, 1), [[0, 0]]);
  asseq(createCombinations(2, 1), [
    [0, 0],
    [1, 0],
  ]);
  asseq(createCombinations(2), [[0], [1]]);
  asseq(createCombinations(2, 2, 2).length, 8);
  asseq(createCombinations(1).length, countCombinations(1));
  asseq(createCombinations(2).length, countCombinations(2));
  asseq(createCombinations(2, 3).length, countCombinations(2, 3));
}

testCreateCombinations();

function countPlacements(giftCounts: GiftCounts, width: Int, height: Int) {
  const combinationsInput = giftCounts.flatMap((giftCount) =>
    Array(giftCount).fill([width, height]).flat()
  );

  const combinationCount = countCombinations(...combinationsInput);

  return combinationCount;
}

function testAllPlacements() {
  asseq(countPlacements([1], 1, 1), 1);
  asseq(countPlacements([2, 2], 2, 2), 256);
  asseq(createAllPlacements([[["#"]]], [1], 1, 1), [
    [{ type: 0, rotation: 0, x: 0, y: 0 }],
  ]);

  expect(createAllPlacements([[["#"]]], [1], 2, 1)).toStrictEqual([
    [{ type: 0, rotation: 0, x: 0, y: 0 }],
    [{ type: 0, rotation: 0, x: 1, y: 0 }],
  ]);

  expect(createAllPlacements([[["#"]]], [2], 1, 1)).toStrictEqual([
    [
      { type: 0, rotation: 0, x: 0, y: 0 },
      { type: 0, rotation: 0, x: 0, y: 0 },
    ],
  ]);

  expect(
    createAllPlacements([[["#"]], [["#", "#"]]], [1, 1], 1, 1)
  ).toStrictEqual([
    [
      { type: 0, rotation: 0, x: 0, y: 0 },
      { type: 1, rotation: 0, x: 0, y: 0 },
    ],
  ]);

  expect(
    createAllPlacements([[["#"]], [["#", "#"]]], [1, 1], 2, 1)
  ).toStrictEqual([
    [
      { type: 0, rotation: 0, x: 0, y: 0 },
      { type: 1, rotation: 0, x: 0, y: 0 },
    ],
    [
      { type: 0, rotation: 0, x: 0, y: 0 },
      { type: 1, rotation: 0, x: 1, y: 0 },
    ],
    [
      { type: 0, rotation: 0, x: 1, y: 0 },
      { type: 1, rotation: 0, x: 0, y: 0 },
    ],
    [
      { type: 0, rotation: 0, x: 1, y: 0 },
      { type: 1, rotation: 0, x: 1, y: 0 },
    ],
  ]);

  expect(
    createAllPlacements([[["#"]], [["#", "#"]]], [1, 1], 2, 2)
  ).toStrictEqual([
    [
      {
        type: 0,
        rotation: 0,
        x: 0,
        y: 0,
      },
      {
        type: 1,
        rotation: 0,
        x: 0,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 0,
        y: 0,
      },
      {
        type: 1,
        rotation: 0,
        x: 0,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 0,
        y: 0,
      },
      {
        type: 1,
        rotation: 0,
        x: 1,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 0,
        y: 0,
      },
      {
        type: 1,
        rotation: 0,
        x: 1,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 0,
        y: 1,
      },
      {
        type: 1,
        rotation: 0,
        x: 0,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 0,
        y: 1,
      },
      {
        type: 1,
        rotation: 0,
        x: 0,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 0,
        y: 1,
      },
      {
        type: 1,
        rotation: 0,
        x: 1,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 0,
        y: 1,
      },
      {
        type: 1,
        rotation: 0,
        x: 1,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 1,
        y: 0,
      },
      {
        type: 1,
        rotation: 0,
        x: 0,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 1,
        y: 0,
      },
      {
        type: 1,
        rotation: 0,
        x: 0,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 1,
        y: 0,
      },
      {
        type: 1,
        rotation: 0,
        x: 1,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 1,
        y: 0,
      },
      {
        type: 1,
        rotation: 0,
        x: 1,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 1,
        y: 1,
      },
      {
        type: 1,
        rotation: 0,
        x: 0,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 1,
        y: 1,
      },
      {
        type: 1,
        rotation: 0,
        x: 0,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 1,
        y: 1,
      },
      {
        type: 1,
        rotation: 0,
        x: 1,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        rotation: 0,
        x: 1,
        y: 1,
      },
      {
        type: 1,
        rotation: 0,
        x: 1,
        y: 1,
      },
    ],
  ]);
}

testAllPlacements();

function flipGiftHorizontally<T>(gift: T[][]): T[][] {
  return gift.map((row) => row.toReversed());
}

function flipGiftVertically<T>(gift: T[][]): T[][] {
  return gift.toReversed();
}

function transposeGift<T>(gift: T[][]): T[][] {
  return nonNull(gift[0]).map((_, colIndex) =>
    // shit we have an as here. our ground trembles.
    gift.map((row) => nonNull(row[colIndex] as NonNullable<T> | undefined))
  );
}

function rotateGift90Right<T>(gift: T[][]): T[][] {
  return transposeGift(flipGiftVertically(gift));
}

function createAllTransmutations<T>(gift: T[][]): T[][][] {
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

function createDedupedTransmutations<T>(gift: T[][]): T[][][] {
  const uniqueTransmutations = new Set<string>();

  return createAllTransmutations(gift).filter((transmutation) => {
    const stringTransmutation = transmutation
      .map((row) => row.join(""))
      .join("\n");

    if (uniqueTransmutations.has(stringTransmutation)) {
      return false;
    } else {
      uniqueTransmutations.add(stringTransmutation);
      return true;
    }
  });
}

function testRotation() {
  asseq(
    transposeGift([
      ["#", ".", "."],
      ["#", "#", "#"],
    ]),
    [
      ["#", "#"],
      [".", "#"],
      [".", "#"],
    ]
  );

  asseq(
    flipGiftHorizontally([
      ["#", ".", "."],
      ["#", "#", "#"],
    ]),
    [
      [".", ".", "#"],
      ["#", "#", "#"],
    ]
  );

  asseq(
    flipGiftVertically([
      ["#", ".", "."],
      ["#", "#", "#"],
    ]),
    [
      ["#", "#", "#"],
      ["#", ".", "."],
    ]
  );

  asseq(rotateGift90Right([["#"]]), [["#"]]);
  asseq(rotateGift90Right([["#", "#"]]), [["#"], ["#"]]);
  asseq(
    rotateGift90Right([
      ["#", "."],
      [".", "."],
    ]),
    [
      [".", "#"],
      [".", "."],
    ]
  );

  const initialGift = `12
43`
    .split("\n")
    .map((row) => row.split(""));
  asseq(initialGift, [
    ["1", "2"],
    ["4", "3"],
  ]);
  expect(createAllTransmutations(initialGift)).toStrictEqual(
    // prettier-ignore
    [
        [["1","2"],["4","3"]],
        [["4","1"],["3","2"]],
        [["3","4"],["2","1"]],
        [["2","3"],["1","4"]],
        [["4","3"],["1","2"]],
        [["3","2"],["4","1"]],
        [["2","1"],["3","4"]],
        [["1","4"],["2","3"]],
        
      ]
  );

  expect(createAllTransmutations([["#"]])).toStrictEqual([
    [["#"]],
    [["#"]],
    [["#"]],
    [["#"]],
    [["#"]],
    [["#"]],
    [["#"]],
    [["#"]],
  ]);

  expect(createAllTransmutations([["#", "#"]])).toStrictEqual([
    [["#", "#"]],
    [["#"], ["#"]],
    [["#", "#"]],
    [["#"], ["#"]],
    [["#", "#"]],
    [["#"], ["#"]],
    [["#", "#"]],
    [["#"], ["#"]],
  ]);

  asseq(
    createDedupedTransmutations([
      ["#", ".", "."],
      ["#", "#", "#"],
    ]),
    [
      [
        ["#", ".", "."],
        ["#", "#", "#"],
      ],
      [
        ["#", "#"],
        ["#", "."],
        ["#", "."],
      ],
      [
        ["#", "#", "#"],
        [".", ".", "#"],
      ],
      [
        [".", "#"],
        [".", "#"],
        ["#", "#"],
      ],
      [
        ["#", "#", "#"],
        ["#", ".", "."],
      ],
      [
        ["#", "."],
        ["#", "."],
        ["#", "#"],
      ],
      [
        [".", ".", "#"],
        ["#", "#", "#"],
      ],
      [
        ["#", "#"],
        [".", "#"],
        [".", "#"],
      ],
    ]
  );

  expect(createDedupedTransmutations([["#"]])).toStrictEqual([[["#"]]]);
}

testRotation();

asseq(
  canFitString(`1:
#

1x1: 1`),
  true
);

asseq(
  canFitString(`1:
#

0x0: 1`),
  false
);

asseq(
  canFitString(`1:
#

1x1: 2`),
  false
);

asseq(
  canFitString(`1:
#

2x1: 2`),
  true
);

asseq(
  canFitString(`1:
##
##

2x1: 1`),
  false
);

asseq(
  canFitString(`1:
#.#

2x2: 1`),
  false
);

asseq(
  canFitString(`1:
.#

1x1: 1`),
  true
);

asseq(
  canFitString(`1:
##

2x2: 2`),
  true
);

asseq(
  canFitString(`1:
##

2x2: 3`),
  false
);

// SIGURD TODO TO JUMP BACK IN, create some smaller tests for rotations. and then flipping. and then to do multiple rotation and flipping moves. then a method to dedupe permutated gifts.
// asseq(
//   canFitString(`1:
// ##

// 1x2: 1`),
//   true,
//   "with rotations "
// );

// asseq(
//   canFitString(`1:
// #.
// ##
// #.

// 2:
// #.
// ..
// #.

// 2x3: 1 1
// `),
//   true,
//   "with flipping"
// );

// asseq(
//   canFitString(`0:
// ###
// ##.
// ##.

// 1:
// ###
// ##.
// .##

// 2:
// .##
// ###
// ##.

// 3:
// ##.
// ###
// ##.

// 4:
// ###
// #..
// ###

// 5:
// ###
// .#.
// ###

// 4x4: 0 0 0 0 2 0`),
//   true
// );

/**
# simple and correct algorithm, in small steps
[ ] implement only the first tree
[ ] implement all rotations of the pieces
[ ] try every single placement
[x] create a function which verifies that a complete board is correct
[ ] create a "progress bar" which gives the total count, and how far we have gotten, with this naive implementation
[ ] create edge cases: 
[ ] no wanted gifts
[ ] a single gift
[ ] board is too small for a single gift
[ ] a piece which fits completely inside another piece
[ ] 2 pieces that need to be rotated to fit
[ ] 2 pieces that need to be flipped to fit

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

# correctness verifications
[ ] we can count the amonut of tests it tried, then sort the amount by correct and incorrect tests.
[ ] at the beginning, when we rule out a test then we should always double check by actually checking if the thing is valid.
[ ] when we do a performance optimization then we can check that the amount of duplicate work has been reduced, and that all of the cases have been checked, or somehow are known that they do not fit.
[ ] we need to check that the trees are correctly marked as fillable or not able to be filled

*/

console.log("done");
