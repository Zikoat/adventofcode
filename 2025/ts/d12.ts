import { expect, mock } from "bun:test";
import { add, ass, asseq, assInt, diff, nonNull, type Vector } from "./common";

const bigBoy = process.env.BIGBOY === "true";

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

function stringToMatrix(input: string): string[][] {
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

function assmeq(stringMatrix: string[][], expected: string): void {
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

function stringToGift(giftString: string): Gift {
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

function assIsGiftMatrix(stringMatrix: string[][]): Gift {
  const newLocal: Gift = assMatrix<"#" | ".">(stringMatrix, isGiftChar);
  return newLocal;
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

  const gift2: Gift = assIsGiftMatrix(matrix);

  assmeq(
    gift2,
    `##
     ..`
  );
}

testStringToMatrix();

function wrapGiftString(giftString: string): Gift {
  return wrapGift(stringToGift(giftString));
}

function wrapGift(input: Gift): Gift {
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

assmeq(wrapGiftString(`#`), "#");
assmeq(wrapGiftString(`##`), "##");
assmeq(
  wrapGiftString(
    `#
     #`
  ),
  `#
   #`
);
assmeq(wrapGiftString(`.#`), "#");
assmeq(wrapGiftString(`#.`), "#");
assmeq(wrapGiftString(`#.#`), "#.#");
assmeq(
  wrapGiftString(
    `#.#
     #..`
  ),
  `#.#
   #..`
);
assmeq(wrapGiftString("..#"), "#");
assmeq(
  wrapGiftString(
    `.
     .
     #`
  ),
  "#"
);
assmeq(
  wrapGiftString(
    `#
     .
     .`
  ),
  "#"
);

assmeq(
  wrapGift([
    [".", ".", "."],
    [".", "#", "."],
    [".", ".", "."],
  ]),
  "#"
);

function canFitString(input: string): boolean {
  const parsed2: Puzzle = parseInput(input);
  asseq(parsed2.trees.length, 1);

  const gifts = parsed2.gifts.map(function mapGifts(gift) {
    return wrapGift(gift);
  });

  const tree: Tree = nonNull(parsed2.trees[0]);

  console.log("creating all gift placements");

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

function isInBounds(vector: Vector, rectangle: RootRectangle): boolean {
  assVector(vector);
  assRootRectangle(rectangle);

  return !(
    vector.x < 0 ||
    vector.y < 0 ||
    vector.x > rectangle.width - 1 ||
    vector.y > rectangle.height - 1
  );
}

asseq(isInBounds({ x: 0, y: 0 }, { width: 1, height: 1 }), true);
asseq(isInBounds({ x: -1, y: 0 }, { width: 1, height: 1 }), false);
asseq(isInBounds({ x: 0, y: -1 }, { width: 1, height: 1 }), false);
asseq(isInBounds({ x: 1, y: 0 }, { width: 1, height: 1 }), false);
asseq(isInBounds({ x: 0, y: 1 }, { width: 1, height: 1 }), false);
asseq(isInBounds({ x: 2, y: 0 }, { width: 3, height: 1 }), true);
asseq(isInBounds({ x: 3, y: 0 }, { width: 3, height: 1 }), false);

type PlacedGift = {
  type: Int;
  rotation: Int;
} & Vector;

/** hint: place multiple gifts on a board by using createBoard with an array of placedGifts */
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

function isValidBoard(board: Board): boolean {
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

  console.log("\nboard is valid");
  console.log(matrixToString(boardToVizualizedBoard(board)));
  // console.log(board);

  return true;
}

type Board = {
  gifts: GiftsWithRotations;
  placedGifts: PlacedGift[];
} & RootRectangle;

// shit this method is probably not necessary?
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

type VisualizedBoard = string[][];

function boardToVizualizedBoard(board: Board): VisualizedBoard {
  let warning = "";

  // create a 2d array of the board
  // for each placed gift, set the corresponding cells which are # to #

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

function visualizeBoard(board: Board, expected: string) {
  assmeq(boardToVizualizedBoard(board), expected);
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

  // shit create a type for a "validated board", and then we have to pass validated boards to each other?

  asseq(
    isValidBoard(
      createBoard({
        gifts: [[["#"]]],
        width: boardWidth,
        height: boardHeight,
        placedGifts: [
          { type: 0, rotation: 0, x: 0, y: 0 },
          { type: 0, rotation: 0, x: 0, y: 0 },
        ],
      })
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

  let boardState = createBoard({
    gifts: [[["#", "#"]]],
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
    `A.
     A.`
  );

  boardState = placeGift(boardState, { type: 0, rotation: 0, x: 0, y: 0 });

  visualizeBoard(
    boardState,
    `XB
     A.`
  );

  visualizeBoard(
    createBoard({
      gifts: [[["#"]]] satisfies Gifts,
      height: 2,
      width: 2,
      placedGifts: [{ type: 0, rotation: 0, x: 1, y: 1 }],
    }),
    `..
     .A`
  );

  asseq(isValidBoard(boardState), false);

  const test1Board: Board = {
    gifts: [
      [
        [
          ["#", "#", "#"],
          ["#", "#", "."],
          ["#", "#", "."],
        ],
        [
          ["#", "#", "#"],
          ["#", "#", "#"],
          [".", ".", "#"],
        ],
        [
          [".", "#", "#"],
          [".", "#", "#"],
          ["#", "#", "#"],
        ],
        [
          ["#", ".", "."],
          ["#", "#", "#"],
          ["#", "#", "#"],
        ],
        [
          ["#", "#", "."],
          ["#", "#", "."],
          ["#", "#", "#"],
        ],
        [
          [".", ".", "#"],
          ["#", "#", "#"],
          ["#", "#", "#"],
        ],
        [
          ["#", "#", "#"],
          [".", "#", "#"],
          [".", "#", "#"],
        ],
        [
          ["#", "#", "#"],
          ["#", "#", "#"],
          ["#", ".", "."],
        ],
      ],
      [
        [
          ["#", "#", "#"],
          ["#", "#", "."],
          [".", "#", "#"],
        ],
        [
          [".", "#", "#"],
          ["#", "#", "#"],
          ["#", ".", "#"],
        ],
        [
          ["#", "#", "."],
          [".", "#", "#"],
          ["#", "#", "#"],
        ],
        [
          ["#", ".", "#"],
          ["#", "#", "#"],
          ["#", "#", "."],
        ],
        [
          [".", "#", "#"],
          ["#", "#", "."],
          ["#", "#", "#"],
        ],
        [
          ["#", ".", "#"],
          ["#", "#", "#"],
          [".", "#", "#"],
        ],
        [
          ["#", "#", "#"],
          [".", "#", "#"],
          ["#", "#", "."],
        ],
        [
          ["#", "#", "."],
          ["#", "#", "#"],
          ["#", ".", "#"],
        ],
      ],
      [
        [
          [".", "#", "#"],
          ["#", "#", "#"],
          ["#", "#", "."],
        ],
        [
          ["#", "#", "."],
          ["#", "#", "#"],
          [".", "#", "#"],
        ],
      ],
      [
        [
          ["#", "#", "."],
          ["#", "#", "#"],
          ["#", "#", "."],
        ],
        [
          ["#", "#", "#"],
          ["#", "#", "#"],
          [".", "#", "."],
        ],
        [
          [".", "#", "#"],
          ["#", "#", "#"],
          [".", "#", "#"],
        ],
        [
          [".", "#", "."],
          ["#", "#", "#"],
          ["#", "#", "#"],
        ],
      ],
      [
        [
          ["#", "#", "#"],
          ["#", ".", "."],
          ["#", "#", "#"],
        ],
        [
          ["#", "#", "#"],
          ["#", ".", "#"],
          ["#", ".", "#"],
        ],
        [
          ["#", "#", "#"],
          [".", ".", "#"],
          ["#", "#", "#"],
        ],
        [
          ["#", ".", "#"],
          ["#", ".", "#"],
          ["#", "#", "#"],
        ],
      ],
      [
        [
          ["#", "#", "#"],
          [".", "#", "."],
          ["#", "#", "#"],
        ],
        [
          ["#", ".", "#"],
          ["#", "#", "#"],
          ["#", ".", "#"],
        ],
      ],
    ],
    width: 4,
    height: 4,
    placedGifts: [
      {
        type: 4,
        rotation: 3,
        x: 1,
        y: 1,
      },
      {
        type: 4,
        rotation: 3,
        x: 0,
        y: 1,
      },
    ],
  };

  visualizeBoard(
    test1Board,
    `....
     BABA
     BABA
     BXXA`
  );
  asseq(isValidBoard(test1Board), false);
}

testIsValidPlacement();

function toNumInt(input: Int | undefined | null): Int {
  ass(typeof input === "number");
  ass(Math.abs(input) % 1 === 0);
  return input;
}

function createAllPositionsAndRotationsForAGift() { }

function someValidPlacements(
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

  const generator = () => {
    if (done) {
      return undefined;
    } else {
      const prevAcc = [...acc];

      advance();
      console.log(acc)
      ass(acc.every(num => num == 0 || toNumInt(num)))
      return prevAcc;
    }
  };

  let nextItem = generator();

  while (nextItem !== undefined) {
    allCombinations.push(nextItem);
    nextItem = generator();
  }

  // shit todo ok, so we have the complete list of all permutations of all gifts. 
  // their order is n of the first gift, then n of the second gift...
  // each gift has 3 numbers, rotation, x and y.
  // so it is gift_1 (rotation, x, y), gift 2 (rot, x, y), flattened to [rot, x, y, rot, x, y]
  // a PlacedGift is {type, rotation, x, y}
  // the type's giftcount says how many instances of this we should have before moving onto the next shape

  // when we have generated the 3 numbers for the current rotation and position, we should 
  // append it to the board and check the validity of the board. if the board is valid, then we 
  // continue the accumulator one down, and place the next rotation, x and y. 
  // if the board is invalid, then we do not continue one down, but instead increase the current value (x).

  // an abstraction we can test simply is this: we have an array of ints where we want to generate the combinations.
  // every time we generate a new thing, we have a validation function which is run, which does the above algorithm.



  const anyValidPlacements: boolean = allCombinations.some(
    (combination): boolean => {
      const giftPlacement: PlacedGift[] = [];

      let currentGiftMultiIndex = 0;
      for (const [type, giftCount] of giftCounts.entries()) {
        for (let i = 0; i < giftCount; i++) {
          giftPlacement.push({
            type,
            rotation: toNumInt(combination[currentGiftMultiIndex * 3]),
            x: toNumInt(combination[currentGiftMultiIndex * 3 + 1]),
            y: toNumInt(combination[currentGiftMultiIndex * 3 + 2]),
          });

          currentGiftMultiIndex++;
        }
      }

      asseq(currentGiftMultiIndex * 3, combination.length);

      const isPlacementValid = isValidBoard(
        { ...board, placedGifts: giftPlacement, gifts }
      );

      return isPlacementValid;
    }
  )


  return anyValidPlacements;
}

function combinationsWithCheck(combinationsInput: Int[], check: (combination: Int[]) => boolean): boolean {
  return check(combinationsInput);

}

testCombinationsWithCheck()

function testCombinationsWithCheck() {


  // [1] generates [[0]], and runs a validation which gets [0]. this function passes and returns true.
  // everything exhausted so return true
  const spy1 = mock((_combination) => true)
  asseq(combinationsWithCheck([1], spy1), true)
  asseq(spy1.mock.calls, [[[0]]])
  // the spied check function should be called with [0]

  // const combinationsInput = [1]
  // [1] generates [[0]], and runs a validation which gets [0]. this function fails and returns false.
  // everything exhausted so return true
  // asseq(combinationsWithCheck())


  // const combinationsInput = [3]
  // [3] generates [[0],[1],[2]], and runs a validation which gets [0], [1], then [2]
  // asseq(combinationsWithCheck())

  // const combinationsInput = [3,3]
  //
  /* 
  [3,3] with validation function "nonZero" generates first [0], runs validation function, this validation 
  function fails, so it continues to [1]. this passes validation, so it continues with [1, 1], which is 
  also valid. all numbers in this generator are valid, so the function returns and says that [1,1] is a 
  an example of a valid value
  */
  const combinationsInput = [2, 1, 2]

  /*
  validation function index 3 is invalid
  [0] valid
  [0,0] valid
  [0,0,0] invalid
  [0,0,1] invalid
  [1] valid
  [1,0] valid
  [1,0,0] invalid
  [1,0,1] invalid

  all options are exhausted, function returns false
  */
}

function testAllPlacements() {
  asseq(
    someValidPlacements([[[["#"]]]], {
      width: 1,
      height: 1,
      giftCounts: [1]
    }),
    true
  );
  asseq(
    someValidPlacements(
      [[[["#"]]], [[["#"]]]],
      { width: 2, height: 2, giftCounts: [2, 2], }
    ),
    true
  );
  asseq(
    someValidPlacements(
      ([[["#"]]] satisfies Gifts).map(createDedupedTransmutations),
      { width: 1, height: 1, giftCounts: [1], }
    ),
    true,
  );

  expect(
    someValidPlacements(
      ([[["#"]]] satisfies Gifts).map(createDedupedTransmutations),

      { width: 2, height: 1, giftCounts: [1], }
    )
  ).toStrictEqual(true);

  expect(
    someValidPlacements(
      ([[["#"]]] satisfies Gifts).map(createDedupedTransmutations),
      { width: 1, height: 1, giftCounts: [2], }
    )
  ).toStrictEqual(false);

  expect(
    someValidPlacements(
      ([[["#"]], [["#", "#"]]] satisfies Gifts).map(
        createDedupedTransmutations
      ),
      { width: 1, height: 1, giftCounts: [1, 1], }
    )
  ).toStrictEqual(false);

  expect(
    someValidPlacements(
      ([[["#"]], [["#", "#"]]] satisfies Gifts).map(
        createDedupedTransmutations
      ),
      { width: 2, height: 1, giftCounts: [1, 1], }
    )
  ).toStrictEqual(false);

  expect(
    someValidPlacements(
      ([[["#"]], [["#", "#"]]] satisfies Gifts).map(
        createDedupedTransmutations
      ),
      { width: 2, height: 2, giftCounts: [1, 1], }
    )
  ).toBe(true);
}

testAllPlacements();

function flipGiftHorizontally<T>(gift: T[][]): T[][] {
  return gift.map(function flipGiftHorizontallyMapRow(row) {
    return row.toReversed();
  });
}

function flipGiftVertically<T>(gift: T[][]): T[][] {
  return gift.toReversed();
}

function transposeGift<T>(gift: T[][]): T[][] {
  return nonNull(gift[0]).map((_, colIndex) => gift.map((row) => nonNull(row[colIndex])));
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

function testRotation() {
  assmeq(
    transposeGift(
      stringToMatrix(
        `#..
         ###`
      )
    ),
    `##
     .#
     .#`
  );

  assmeq(
    flipGiftHorizontally(
      stringToMatrix(
        `#..
      ###`
      )
    ),
    `..#
     ###`
  );

  assmeq(
    flipGiftVertically(
      stringToMatrix(
        `#..
      ###`
      )
    ),
    `###
     #..`
  );

  asseq(rotateGift90Right([["#"]]), [["#"]]);
  asseq(rotateGift90Right([["#", "#"]]), [["#"], ["#"]]);
  assmeq(
    rotateGift90Right(
      stringToGift(
        `#.
         ..`
      )
    ),
    `.#
    ..`
  );

  const initialGift = `12
43`
    .split("\n")
    .map(function splitInitialGiftMapRow(row) {
      return row.split("");
    });
  asseq(initialGift, [
    ["1", "2"],
    ["4", "3"],
  ]);
  expect(createAllTransmutations(initialGift)).toStrictEqual(
    // prettier-ignore
    [
      [["1", "2"], ["4", "3"]],
      [["4", "1"], ["3", "2"]],
      [["3", "4"], ["2", "1"]],
      [["2", "3"], ["1", "4"]],
      [["4", "3"], ["1", "2"]],
      [["3", "2"], ["4", "1"]],
      [["2", "1"], ["3", "4"]],
      [["1", "4"], ["2", "3"]],

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

// asseq(
//   canFitString(`1:
// #

// 0x0: 1`),
//   false
// );

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

console.log("\n--- rotation test");
asseq(
  canFitString(`1:
##

1x2: 1`),
  true,
  "with rotations "
);

asseq(
  canFitString(`1:
#.
##
#.

2:
#.
..
#.

2x3: 1 1
`),
  true,
  "with flipping"
);

asseq(
  canFitString(`0:
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

4x4: 0 0 0 0 2 0`),
  true
);

if (bigBoy) {
  asseq(
    canFitString(`
0:
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

12x5: 1 0 1 0 2 2`),
    true
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

# correctness verifications
[ ] we can count the amonut of tests it tried, then sort the amount by correct and incorrect tests.
[ ] at the beginning, when we rule out a test then we should always double check by actually checking if the thing is valid.
[ ] when we do a performance optimization then we can check that the amount of duplicate work has been reduced, and that all of the cases have been checked, or somehow are known that they do not fit.
[ ] we need to check that the trees are correctly marked as fillable or not able to be filled

*/

console.log("done");
