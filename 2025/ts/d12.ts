import { deepEquals } from "bun";
import { expect } from "bun:test";
import {
  add,
  ass,
  asseq,
  assInt,
  diff,
  nonNull,
  sum,
  type Vector,
} from "./common";
import { isValid } from "zod/v3";

console.log("start");
type TupleOf<
  T,
  N extends number,
  R extends readonly T[] = []
> = R["length"] extends N ? R : TupleOf<T, N, readonly [...R, T]>;

export function assertTupleOf<T, N extends number>(
  value: readonly T[],
  length: N
): asserts value is TupleOf<T, N> {
  asseq(value.length, length);
}

export function isTupleOf<T, N extends number>(
  value: readonly T[],
  length: N
): TupleOf<T, N> {
  asseq(value.length, length);
  return value as TupleOf<T, N>;
}

const x: number[] = [1, 2, 3];
assertTupleOf(x, 3);
const x_1: number = x[0];
const x_2: number = x[2];
// @ts-expect-error
const x_3: number = x[3];

void x_1, x_2, x_3;

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
type Gifts = readonly Gift[];
type Int = number;
type GiftCounts = readonly Int[];
type Tree = { width: Int; height: Int; giftCounts: GiftCounts };
type Puzzle = { gifts: Gifts; trees: Tree[] };

function shape(twoDArray: unknown[][]): [number, number] {
  const firstRow = nonNull(twoDArray[0]);
  ass(twoDArray.every((row) => row.length === firstRow.length));
  return [twoDArray.length, firstRow.length];
}

function parseInput(input: string): Puzzle {
  const matchedInput = input.split("\n\n");

  const giftsTuple = matchedInput.toSpliced(matchedInput.length - 1);
  asseq(giftsTuple.length, matchedInput.length - 1);
  // console.log(matchedInput)
  const giftsShit: Gifts = giftsTuple.map((giftString) => {
    const shit = nonNull(giftString.split(":")[1]).trim().split("\n");
    // console.log("shit", shit, giftString)
    return shit.map((line) => {
      const splittedLines = line.split("");
      // console.log(splittedLines)
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

  asseq(first_gift, [
    ["#", "#", "#"],
    ["#", "#", "."],
    ["#", "#", "."],
  ]);

  gifts.forEach((gift) => asseq(shape(gift), [3, 3]));
}

validateTest();

function trimGift(gift: string): string {
  let rows = gift.split("\n").map((row) => {
    const chars = row.split("");
    ass(chars.every((char) => char === "." || char == "#"));
    return chars;
  });

  const trimmedGifts = trimGift2(rows);
  // console.log("rows", rows, "trimmedGifts", trimmedGifts)
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

const performanceOptimizations = { countGiftSpaces: false } as const;

function canFitString(input: string): boolean {
  // console.log(input)
  const parsed2: Puzzle = parseInput(input);
  asseq(parsed2.trees.length, 1);

  const gifts = parsed2.gifts.map((gift) => {
    // console.log(gift)

    return trimGift2(gift);
  });

  const firstTree = nonNull(parsed2.trees[0]);
  const freeSpaces = firstTree.width * firstTree.height;
  const giftsWithCounts: { gift: Gift; count: Int }[] =
    firstTree.giftCounts.map((value, index, array) => {
      return { gift: nonNull(gifts[index]), count: value } satisfies {
        gift: Gift;
        count: Int;
      };
    });

  // shit this can be refactored to use a helper to turn a 2d array to a flat thing, with positions.
  const eachGiftTypeSpacesCount: number[] = giftsWithCounts.map(
    (giftWithCount): number => {
      const giftSpacesCount = giftWithCount.gift
        .flatMap((row) => row.flatMap((row) => row))
        .filter((char) => char === "#").length;
      return giftSpacesCount * giftWithCount.count;
    }
  );
  const totalGiftSpaces: number = sum(eachGiftTypeSpacesCount);
  // console.log(eachGiftTypeSpacesCount, totalGiftSpaces)

  if (
    totalGiftSpaces > freeSpaces &&
    performanceOptimizations.countGiftSpaces
  ) {
    // shit note that the code should still work without this. this is only a performance optimization!
    return false;
  }

  // console.log(
  //   "createAllPlacements input",
  //   gifts,
  //   firstTree.giftCounts,
  //   firstTree.width,
  //   firstTree.height
  // );

  const allGiftPlacements = createAllPlacements(
    gifts,
    firstTree.giftCounts,
    firstTree.width,
    firstTree.height
  );
  console.log(
    "all gift placement count in can fit string",
    allGiftPlacements.length
  );

  // console.log("allGiftPlacements", allGiftPlacements);
  // const giftPlacements: PlacedGift[] = [];
  // // for each gift
  // for (const [giftType, gift] of gifts.entries()) {
  //   const giftCount = nonNull(firstTree.giftCounts[giftType]);
  //   // console.log("giftCount", giftCount)
  //   for (let i = 0; i < giftCount; i++) {
  //     for (let x = 0; x < firstTree.width; x++) {
  //       for (let y = 0; y < firstTree.height; y++) {
  //         // console.log(x, y)
  //         giftPlacements.push({ type: giftType, x, y });
  //       }
  //     }
  //   }
  // }
  // console.log(giftPlacements)
  const validPlacements = allGiftPlacements.map((giftPlacement) =>
    isValidPlacement(gifts, firstTree.width, firstTree.height, giftPlacement)
  );
  // console.log("validPlacements", validPlacements);

  const anyValidPlacements = validPlacements.some(Boolean);

  return anyValidPlacements;
  // for each x of the board
  // for each y of the board
  // create the placement
  // validate the placement
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
  type: number;
  x: number;
  y: number;
};

function placeGift(
  pieceIndex: Int,
  location: Vector,
  previousPlacedGifts: PlacedGift[]
): PlacedGift[] {
  return [
    ...previousPlacedGifts,
    { type: pieceIndex, x: location.x, y: location.y },
  ];
}

asseq(placeGift(0, { x: 0, y: 0 }, []), [{ type: 0, x: 0, y: 0 }]);

asseq(placeGift(0, { x: 0, y: 0 }, placeGift(0, { x: 1, y: 0 }, [])), [
  { type: 0, x: 1, y: 0 },
  { type: 0, x: 0, y: 0 },
]);

function isValidPlacement(
  giftsShapes: Gifts,
  width: Int,
  height: Int,
  placedGifts: PlacedGift[]
): boolean {
  // console.log(
  //   "isValidPlacement input",
  //   JSON.stringify({ gifts: giftsShapes, width, height, placedGifts })
  // );
  // if any gift has a location out of bounds
  // WARNING: assumes wrapped gifts, and verified that every row is the same length
  for (const placedGift of placedGifts) {
    if (!isInBounds(placedGift.x, placedGift.y, width, height)) {
      return false;
    }

    const gift = nonNull(giftsShapes[placedGift.type]);
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

      const gift1 = nonNull(giftsShapes[placedMultiGift1.type]);

      // shit todo performance optimization, if the gifts have no overlapping bounds then they cannot have gift tiles on each other
      // shit todo performance optimization, if we sort the gifts top to bottom, then we can find the first gift at the correct height, and then only run until the gifts are at different heights again. all of the ones before and after definitely don't overlap.
      // shit todo performance optimization, if we have a single board, then we can "cache" which tiles are occupied by storing the field and flipping the bits. maybe its faster to get the exact one instead.
      // shit todo performance optimization, we only need to loop through the tiles that are actually #'s, not the .'s

      for (const [gift1LocalY, gift1Row] of gift1.entries()) {
        for (const [gift1LocalX, gift1Cell] of gift1Row.entries())
          if (gift1Cell === "#") {
            // console.log(
            //   "shit",
            //   gift1LocalX,
            //   gift1LocalY,
            //   placedMultiGift1,
            //   placedMultiGift2
            // );
            const globalPos = add(
              { y: placedMultiGift1.y, x: placedMultiGift1.x },
              { x: gift1LocalX, y: gift1LocalY }
            );
            // console.log("globalPos", globalPos);

            // note, need to verify this is checking the correct direction.
            const gift2Local = diff(
              {
                x: placedMultiGift2.x,
                y: placedMultiGift2.y,
              },
              globalPos
            );
            // console.log("pre-error", {
            //   a: placedMultiGift2.type,
            //   b: gift2Local.y,
            //   c: gift2Local.x,
            //   d: giftsShapes,
            //   e: giftsShapes[placedMultiGift2.type],
            //   f: giftsShapes[placedMultiGift2.type]?.[gift2Local.y],
            //   g: giftsShapes[placedMultiGift2.type]?.[gift2Local.y]?.[
            //     gift2Local.x
            //   ],
            // });
            const gift2Cell =
              giftsShapes[placedMultiGift2.type]?.[gift2Local.y]?.[
                gift2Local.x
              ];
            if (gift2Cell === "#") {
              // console.log("there is overlap");
              return false;
            }
          }
      }
    }
  }

  return true;
}

function testIsValidPlacement() {
  const gifts = [[["#"]]] satisfies Gifts;
  const boardWidth = 1;
  const boardHeight = 1;

  asseq(
    isValidPlacement(
      gifts,
      boardWidth,
      boardHeight,
      placeGift(0, { x: 0, y: 0 }, [])
    ),
    true
  );
  asseq(
    isValidPlacement(
      gifts,
      boardWidth,
      boardHeight,
      placeGift(0, { x: 1, y: 0 }, [])
    ),
    false
  );
  asseq(
    isValidPlacement(
      [[["#", "#"]]],
      boardWidth,
      boardHeight,
      placeGift(0, { x: 0, y: 0 }, [])
    ),
    false
  );
  // shit create placeGifts helper?
  // shit create a type for a "validated board", and then we have to pass validated boards to each other?
  asseq(
    isValidPlacement(
      [[["#"]]],
      boardWidth,
      boardHeight,
      placeGift(0, { x: 0, y: 0 }, placeGift(0, { x: 0, y: 0 }, []))
    ),
    false,
    "overlapping pieces "
  );
  asseq(isValidPlacement([[["#"]]], 0, 0, []), true);

  // {"gifts":[[["#"]]],"width":2,"height":1,"placedGifts":[{"type":0,"x":0,"y":0},{"type":0,"x":1,"y":0}]}
  asseq(
    isValidPlacement([[["#"]]], 2, 1, [
      { type: 0, x: 0, y: 0 },
      { type: 0, x: 1, y: 0 },
    ]),
    true
  );
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
  // const allPlacements: PlacedGift[][] = [];

  asseq(gifts.length, giftCounts.length);

  // const placement = [];

  const combinationsInput = giftCounts.flatMap((giftCount) =>
    Array(giftCount).fill([width, height]).flat()
  );

  // console.log(combinationsInput);

  const unmappedplacements = createCombinations(...combinationsInput);

  const allPlacements: PlacedGift[][] = unmappedplacements.map((placement) => {
    const singleGiftPlacements: PlacedGift[] = [];
    // placement is a x / y tuple for each multi gift.
    // the gift index is the same as the gift type
    // if we repeat each gift type count times, then the gift multi index is the index of the
    // console.log("placement", placement);
    let currentGiftMultiIndex = 0;
    for (const [giftType, giftCount] of giftCounts.entries()) {
      for (let i = 0; i < giftCount; i++) {
        // console.log(
        //   currentGiftMultiIndex,
        //   currentGiftMultiIndex * 2,
        //   placement[currentGiftMultiIndex * 2]
        // );
        const x = toNumInt(placement[currentGiftMultiIndex * 2]);
        const y = toNumInt(placement[currentGiftMultiIndex * 2 + 1]);
        singleGiftPlacements.push({ type: giftType, x, y });

        currentGiftMultiIndex++;
      }
    }

    // console.log(currentGiftMultiIndex, placement.length);
    asseq(currentGiftMultiIndex * 2, placement.length);
    return singleGiftPlacements;
  });

  const placementCount = countPlacements(giftCounts, width, height);
  // console.log({
  //   giftCounts,
  //   width,
  //   height,
  //   placementCount,
  // });
  // console.log(JSON.stringify(allPlacements, null, 2));
  asseq(allPlacements.length, placementCount);
  return allPlacements;
}

function createCombinations(...args: Int[]) {
  const allCombinations: Int[][] = [];

  function recurse(index: Int, accumulator: Int[]): void {
    // console.log(index, accumulator);
    if (index === args.length) {
      // console.log("adding to all combinations: ", accumulator);
      allCombinations.push([...accumulator]);
      // console.log("new all combinations", allCombinations);
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

  // console.log("all combinations before", allCombinations);

  recurse(0, []);
  // console.log("alcl combinations", allCombinations);

  return allCombinations;
}

function countCombinations(...args: Int[]): number {
  // ass(args.every((arg) => typeof arg === "number"));
  return args.reduce((prev, cur, i, arr) => prev * cur, 1);
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
  // console.log("done combinations");
}

testCreateCombinations();

function countPlacements(giftCounts: GiftCounts, width: Int, height: Int) {
  const combinationsInput = giftCounts.flatMap((giftCount) =>
    Array(giftCount).fill([width, height]).flat()
  );

  const combinationCount = countCombinations(...combinationsInput);

  // console.log("combination count", combinationsInput, combinationCount);

  return combinationCount;
}

function testAllPlacements() {
  asseq(countPlacements([1], 1, 1), 1);
  // 4 shapes need to be placed on one of four spots, they can be on the same spot.
  asseq(countPlacements([2, 2], 2, 2), 256);
  asseq(createAllPlacements([[["#"]]], [1], 1, 1), [[{ type: 0, x: 0, y: 0 }]]);
  // throw Error("stop");

  expect(createAllPlacements([[["#"]]], [1], 2, 1)).toStrictEqual([
    [{ type: 0, x: 0, y: 0 }],
    [{ type: 0, x: 1, y: 0 }],
  ]);

  expect(createAllPlacements([[["#"]]], [2], 1, 1)).toStrictEqual([
    [
      { type: 0, x: 0, y: 0 },
      { type: 0, x: 0, y: 0 },
    ],
  ]);

  expect(
    createAllPlacements([[["#"]], [["#", "#"]]], [1, 1], 1, 1)
  ).toStrictEqual([
    [
      { type: 0, x: 0, y: 0 },
      { type: 1, x: 0, y: 0 },
    ],
  ]);

  expect(
    createAllPlacements([[["#"]], [["#", "#"]]], [1, 1], 2, 1)
  ).toStrictEqual([
    [
      { type: 0, x: 0, y: 0 },
      { type: 1, x: 0, y: 0 },
    ],
    [
      { type: 0, x: 0, y: 0 },
      { type: 1, x: 1, y: 0 },
    ],
    [
      { type: 0, x: 1, y: 0 },
      { type: 1, x: 0, y: 0 },
    ],
    [
      { type: 0, x: 1, y: 0 },
      { type: 1, x: 1, y: 0 },
    ],
  ]);

  expect(
    createAllPlacements([[["#"]], [["#", "#"]]], [1, 1], 2, 2)
  ).toStrictEqual([
    [
      {
        type: 0,
        x: 0,
        y: 0,
      },
      {
        type: 1,
        x: 0,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        x: 0,
        y: 0,
      },
      {
        type: 1,
        x: 0,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        x: 0,
        y: 0,
      },
      {
        type: 1,
        x: 1,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        x: 0,
        y: 0,
      },
      {
        type: 1,
        x: 1,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        x: 0,
        y: 1,
      },
      {
        type: 1,
        x: 0,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        x: 0,
        y: 1,
      },
      {
        type: 1,
        x: 0,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        x: 0,
        y: 1,
      },
      {
        type: 1,
        x: 1,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        x: 0,
        y: 1,
      },
      {
        type: 1,
        x: 1,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        x: 1,
        y: 0,
      },
      {
        type: 1,
        x: 0,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        x: 1,
        y: 0,
      },
      {
        type: 1,
        x: 0,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        x: 1,
        y: 0,
      },
      {
        type: 1,
        x: 1,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        x: 1,
        y: 0,
      },
      {
        type: 1,
        x: 1,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        x: 1,
        y: 1,
      },
      {
        type: 1,
        x: 0,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        x: 1,
        y: 1,
      },
      {
        type: 1,
        x: 0,
        y: 1,
      },
    ],
    [
      {
        type: 0,
        x: 1,
        y: 1,
      },
      {
        type: 1,
        x: 1,
        y: 0,
      },
    ],
    [
      {
        type: 0,
        x: 1,
        y: 1,
      },
      {
        type: 1,
        x: 1,
        y: 1,
      },
    ],
  ]);
}

testAllPlacements();

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

console.log("done");
