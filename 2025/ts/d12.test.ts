import { afterAll, describe, expect, it, mock, test } from "bun:test";
import { ass, asseq, nonNull } from "./common";
import {
  assIsGiftMatrix,
  assmeq,
  type Board,
  type CombinationChecker,
  c,
  canFitString,
  combinationsWithCheck,
  createAllTransmutations,
  createDedupedTransmutations,
  flipGiftVertically,
  type Gift,
  getProgress,
  getVariableName,
  giftsOverlap,
  giftsOverlapCount,
  hasBeenValidated,
  isInBounds,
  isValidBoard,
  isValidBoardRuns,
  lerp,
  lerpMultiple,
  lerpRange,
  matrixToString,
  opts,
  optsDuplicate,
  type PlacedGift,
  placedGiftToGift,
  rotateGift90Right,
  someValidPlacements,
  stringToGift,
  stringToMatrix,
  transposeGift,
  wrapGift,
} from "./d12";

describe(wrapGift, () => {
  it("should wrap all 4 cardinal directions", () => {
    assmeq(
      wrapGift([
        [".", ".", "."],
        [".", "#", "."],
        [".", ".", "."],
      ]),
      "#",
    );
  });
});

describe(wrapGiftString, () => {
  it("should return the string turned to a matrix", () => {
    assmeq(wrapGiftString(`#`), "#");
  });

  it("should handle various wrapping cases", () => {
    assmeq(wrapGiftString(`##`), "##");
    assmeq(
      wrapGiftString(
        `#
         #`,
      ),
      `#
       #`,
    );
    assmeq(wrapGiftString(`.#`), "#");
    assmeq(wrapGiftString(`#.`), "#");
    assmeq(wrapGiftString(`#.#`), "#.#");
    assmeq(
      wrapGiftString(
        `#.#
         #..`,
      ),
      `#.#
       #..`,
    );
    assmeq(wrapGiftString("..#"), "#");
    assmeq(
      wrapGiftString(
        `.
         .
         #`,
      ),
      "#",
    );
    assmeq(
      wrapGiftString(
        `#
         .
         .`,
      ),
      "#",
    );

    assmeq(
      wrapGift([
        [".", ".", "."],
        [".", "#", "."],
        [".", ".", "."],
      ]),
      "#",
    );
  });
});

describe(stringToMatrix, () => {
  it("should turn a string into a matrix", () => {
    const giftString = `##
                        ..`;

    const matrix = stringToMatrix(giftString);

    asseq(matrix, [
      ["#", "#"],
      [".", "."],
    ]);

    assmeq(
      matrix,
      `##
       ..`,
    );
  });

  it("should return a generic string type", () => {
    const giftString = `##
                        ..`;

    const matrix = stringToMatrix(giftString);

    // @ts-expect-error
    const gift: Gift = matrix;

    void gift;
  });

  it("should validate gift with assIsGiftMatrix", () => {
    const giftString = `##
                        ..`;

    const gift: Gift = assIsGiftMatrix(stringToMatrix(giftString));

    assmeq(
      gift,
      `##
       ..`,
    );
  });
});

describe(isInBounds, () => {
  test("various cases", () => {
    asseq(isInBounds({ x: 0, y: 0 }, { width: 1, height: 1 }), true);
    asseq(isInBounds({ x: -1, y: 0 }, { width: 1, height: 1 }), false);
    asseq(isInBounds({ x: 0, y: -1 }, { width: 1, height: 1 }), false);
    asseq(isInBounds({ x: 1, y: 0 }, { width: 1, height: 1 }), false);
    asseq(isInBounds({ x: 0, y: 1 }, { width: 1, height: 1 }), false);
    asseq(isInBounds({ x: 2, y: 0 }, { width: 3, height: 1 }), true);
    asseq(isInBounds({ x: 3, y: 0 }, { width: 3, height: 1 }), false);
  });
});

describe(isValidBoard, () => {
  test("single space board with 1 placed gift of 1 tile", () => {
    asseq(
      isValidBoard({
        gifts: toGiftsWithRotations(`#`),
        width: 1,
        height: 1,
        placedGifts: [{ type: 0, rotation: 0, x: 0, y: 0 }],
      }),
      true,
    );
  });

  test("placed x position outside of board should be invalid", () => {
    const prevValidateLastGiftCellInside = opts.validateLastGiftCellInside;
    opts.validateLastGiftCellInside = true;
    expect(() =>
      isValidBoard({
        gifts: toGiftsWithRotations(`#`),
        width: 1,
        height: 1,
        placedGifts: [
          {
            type: 0,
            rotation: 0,
            x: 1,
            y: 0,
          },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "gift was placed outside of the board. placed gift {"type":0,"rotation":0,"x":1,"y":0,"width":1,"height":1} should be inside of {"width":1,"height":1}. gift shape:
      ---
      #
      ---"
      `);
    opts.validateLastGiftCellInside = prevValidateLastGiftCellInside;
  });

  test("placed gift which has piece outside of board should be invalid", () => {
    const prevValidateTooLargegifts = opts.validateTooLargeGifts;
    opts.validateTooLargeGifts = true;
    expect(() =>
      isValidBoard({
        gifts: toGiftsWithRotations(`##`),
        width: 1,
        height: 1,
        placedGifts: [{ type: 0, rotation: 0, x: 0, y: 0 }],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "gift is larger than the board. board: 1x1. gift: 

      ##
      "
    `);
    opts.validateTooLargeGifts = prevValidateTooLargegifts;
  });

  test("pieces that have a tile at the same position should be invalid", () => {
    asseq(
      isValidBoard({
        gifts: toGiftsWithRotations(`#`),
        width: 1,
        height: 1,
        placedGifts: [
          { type: 0, rotation: 0, x: 0, y: 0 },
          { type: 0, rotation: 0, x: 0, y: 0 },
        ],
      }),
      false,
      "overlapping pieces ",
    );
  });

  test("place 2 gifts side by side should be valid", () => {
    asseq(
      isValidBoard({
        gifts: toGiftsWithRotations(`#`),
        width: 2,
        height: 1,
        placedGifts: [
          { type: 0, rotation: 0, x: 0, y: 0 },
          { type: 0, rotation: 0, x: 1, y: 0 },
        ],
      }),
      true,
    );
  });

  test("visualizing board after multiple placements should show X at positions which are wrong", () => {
    const boardState = {
      gifts: toGiftsWithRotations(`##`),
      width: 2,
      height: 2,
      placedGifts: [] as PlacedGift[],
    };

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
       ..`,
    );

    boardState.placedGifts.push({ type: 0, rotation: 1, x: 0, y: 0 });

    visualizeBoard(
      boardState,
      `A.
       A.`,
    );

    boardState.placedGifts.push({ type: 0, rotation: 0, x: 0, y: 0 });

    visualizeBoard(
      boardState,
      `XB
       A.`,
    );

    asseq(isValidBoard(boardState), false);
  });

  test("visualizing board with a placed gift in the bottom right corner", () => {
    visualizeBoard(
      {
        gifts: toGiftsWithRotations(`#`),
        height: 2,
        width: 2,
        placedGifts: [{ type: 0, rotation: 0, x: 1, y: 1 }],
      },
      `..
       .A`,
    );
  });

  test("2 translated and rotated gifts should overlap partially, and overlapment should be visualized", () => {
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
       BXXA`,
    );

    asseq(isValidBoard(test1Board), false);
  });
});

describe(combinationsWithCheck, () => {
  test("should return true when the checker returns true for all", () => {
    const spy = mock<CombinationChecker>((_combination) => true);
    asseq(combinationsWithCheck([1], spy), true);
    asseq(spy.mock.calls, [[[0]]]);
  });

  test("should return false when the checker returns false for all", () => {
    const spy = mock<CombinationChecker>((_combination) => false);
    asseq(combinationsWithCheck([1], spy), false);
    asseq(spy.mock.calls, [[[0]]]);
  });

  test("should stop when a solution was found", () => {
    const spy = mock<CombinationChecker>((combination) => combination[0] === 1);
    asseq(combinationsWithCheck([3], spy), true);
    asseq(spy.mock.calls, [[[0]], [[1]]]);
  });

  test("should not visit children when a parent check is false", () => {
    const spy = mock<CombinationChecker>((combination) =>
      combination.every((shit) => shit !== 0),
    );
    asseq(combinationsWithCheck([3, 3], spy), true);
    asseq(spy.mock.calls, [[[0]], [[1]], [[1, 0]], [[1, 1]]]);
  });

  test("should return false and still visit all leaf nodes when all leaf nodes return false", () => {
    const spy = mock<CombinationChecker>(
      (combination) => combination[2] === undefined,
    );
    asseq(combinationsWithCheck([2, 1, 2], spy), false);
    asseq(spy.mock.calls, [
      [[0]], // true
      [[0, 0]], // true
      [[0, 0, 0]], // false
      [[0, 0, 1]], // false
      [[1]], // true
      [[1, 0]], // true
      [[1, 0, 0]], // false
      [[1, 0, 1]], // false
    ]);
  });
});

type GetNext<T = unknown> = (combination: unknown[]) => T[];
type IsComplete = () => boolean;

function combinationsWithNext<T>(
  getNext: GetNext<T>,
  isComplete: IsComplete = () => false,
) {
  for (let i = 0; i < 100; i++) {
    const nextValues = getNext("a".repeat(i).split(""));
    if (nextValues.length === 0) {
      return isComplete();
    }
  }
  return isComplete();
}

describe(combinationsWithNext, () => {
  // so it should return the values for the next downstream combination
  // we should also have a counter which checks the current index such that
  // we can have a progress bar

  // for test we have a function which returns the next valid values.
  test("it should terminate current step when [] is returned", () => {
    const next = mock<GetNext>(() => []);

    asseq(combinationsWithNext(next), false);

    expect(next).toBeCalledTimes(1);
    expect(next).toHaveLastReturnedWith([]);
    expect(next).lastCalledWith([]);
    asseq(next.mock.calls, [[[]]]);
  });

  test("if the empty combination is complete, then return true.", () => {
    const getNext = mock<GetNext>(() => []);
    const isComplete = mock<IsComplete>(() => true);

    asseq(combinationsWithNext(getNext, isComplete), true);

    expect(getNext).toBeCalledTimes(1);
    expect(getNext).toHaveLastReturnedWith([]);
    expect(getNext).lastCalledWith([]);

    expect(isComplete).toBeCalledTimes(1);
    expect(isComplete).toHaveLastReturnedWith(true);
    expect(isComplete).lastCalledWith();
  });

  test("if we always return 'a', then it should traverse that until it reaches the end and the lowest one returns []", () => {
    const getNext = mock<GetNext<"a">>((combinations) =>
      combinations.length < 10 ? ["a"] : [],
    );

    asseq(combinationsWithNext(getNext), false);

    expect(getNext).toBeCalledTimes(11);
    expect(getNext).lastCalledWith([
      "a",
      "a",
      "a",
      "a",
      "a",
      "a",
      "a",
      "a",
      "a",
      "a",
    ]);
  });

  test.todo(`
    // 

    // if the first returns ["a","b","c"], then it will traverse to index 0
    // which is "a", then it will run the next combination function and return
    // ["10", "20"]. we then traverse to "10" with index 0, and this returns []
    // we continue until we hit "b 20" which is valid and complete, and so we
    // stop and return true.
    // `, () => {});
});

describe("Rotations", () => {
  describe(transposeGift, () => {
    test("transpose should work", () => {
      assmeq(
        transposeGift(
          stringToMatrix(
            `#..
                         ###`,
          ),
        ),
        `##
                 .#
                 .#`,
      );
    });
  });

  describe(flipGiftVertically, () => {
    test("flip vertically should work", () => {
      assmeq(
        flipGiftVertically(
          stringToMatrix(
            `#..
                         ###`,
          ),
        ),
        `###
                 #..`,
      );
    });
  });

  describe(rotateGift90Right, () => {
    test("rotate 90 degrees right should work", () => {
      asseq(rotateGift90Right([["#"]]), [["#"]]);
      asseq(rotateGift90Right([["#", "#"]]), [["#"], ["#"]]);
      assmeq(
        rotateGift90Right(
          stringToGift(
            `#.
                         ..`,
          ),
        ),
        `.#
                 ..`,
      );
    });
  });

  describe(createAllTransmutations, () => {
    test("transmutations 2x2 with numbers", () => {
      const initialGift = stringToMatrix(`12
                                          43`);

      asseq(initialGift, [
        ["1", "2"],
        ["4", "3"],
      ]);

      expect(createAllTransmutations(initialGift)).toStrictEqual(
        // prettier-ignore
        [
          [
            ["1", "2"],
            ["4", "3"],
          ],
          [
            ["4", "1"],
            ["3", "2"],
          ],
          [
            ["3", "4"],
            ["2", "1"],
          ],
          [
            ["2", "3"],
            ["1", "4"],
          ],
          [
            ["4", "3"],
            ["1", "2"],
          ],
          [
            ["3", "2"],
            ["4", "1"],
          ],
          [
            ["2", "1"],
            ["3", "4"],
          ],
          [
            ["1", "4"],
            ["2", "3"],
          ],
        ],
      );
    });

    test("single tile gift should have 8 transmutations", () => {
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
    });

    test("## shape should be transmuted", () => {
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
    });
  });

  describe(createDedupedTransmutations, () => {
    test("dedupe should not remove distinct shapes", () => {
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
        ],
      );
    });

    test("should dedupe shapes which are the same", () => {
      expect(createDedupedTransmutations([["#"]])).toStrictEqual([[["#"]]]);
    });
  });
});

describe(canFitString, () => {
  test("basic case of 1 shape on 1x1 tree", () => {
    asseq(
      canFitString(`1:
#

1x1: 1`),
      true,
    );
  });

  test.failing("0x0 board should fail", () => {
    asseq(
      canFitString(`1:
    #

    0x0: 1`),
      false,
    );
  });

  test("2 pieces don't fit on a 1x1 board", () => {
    asseq(
      canFitString(`1:
#

1x1: 2`),
      false,
    );
  });

  test("2 pieces on a 2x1 board should fit", () => {
    asseq(
      canFitString(`1:
#

2x1: 2`),
      true,
    );
  });

  test.failing("2x2 piece doesnt fit on 2x1 board", () => {
    asseq(
      canFitString(`1:
##
##

2x1: 1`),
      false,
    );
  });

  test("#.# shape doesnt fit on 2x2 board", () => {
    expect(() =>
      canFitString(`1:
#.#

2x2: 1`),
    ).toThrowErrorMatchingInlineSnapshot(`
      "gift is larger than the board. board: 2x2. gift: 

      #.#
      "
    `);
  });

  test(".# piece should fit on 1x1 board", () => {
    asseq(
      canFitString(`1:
.#

1x1: 1`),
      true,
    );
  });

  test("2 ## pieces should fit on 2x2 board", () => {
    asseq(
      canFitString(`1:
##

2x2: 2`),
      true,
    );
  });

  test("3 ## pieces should not fit on a 2x2 board", () => {
    const prevValidateLastGiftCellInside = opts.validateLastGiftCellInside;
    opts.validateLastGiftCellInside = true;
    expect(() =>
      canFitString(`1:
        ##
        
        2x2: 3`),
    ).toThrowErrorMatchingInlineSnapshot(`
        "gift was placed outside of the board. placed gift {"type":0,"rotation":0,"x":1,"y":0,"width":2,"height":1} should be inside of {"width":2,"height":2}. gift shape:
        ---
        ##
        ---"
        `);
    opts.validateLastGiftCellInside = prevValidateLastGiftCellInside;
  });

  // todo this is broken because we do not support pieces that have different
  // widths and heights. we need to implement support for every layer giving
  // the valid values for the next layer.
  test("rotated ## should fit on 1x2 board", () => {
    const previousValidateTooLargeGifts = opts.validateTooLargeGifts;
    opts.validateTooLargeGifts = true;

    asseq(
      canFitString(`1:
##

1x2: 1`),
      true,
    );
    opts.validateTooLargeGifts = previousValidateTooLargeGifts;
  });

  test.skip("pieces that fit inside each other should be rotated to fit into each other", () => {
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
      "with flipping",
    );
  });

  test("the provided first example should fit", () => {
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
      true,
    );
  });

  test("the provided second example should fit", () => {
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
      true,
    );
  });
});

describe(someValidPlacements, () => {
  test("# should fit 1x1", () => {
    asseq(
      someValidPlacements([[[["#"]]]], {
        width: 1,
        height: 1,
        giftCounts: [1],
      }),
      true,
    );
  });

  test("2 ## should fit 2x2", () => {
    asseq(
      someValidPlacements([[[["#"]]], [[["#"]]]], {
        width: 2,
        height: 2,
        giftCounts: [2, 2],
      }),
      true,
    );
  });

  test("deduped # should fit 1x1", () => {
    asseq(
      someValidPlacements(
        [assIsGiftMatrix([["#"]])].map(createDedupedTransmutations),
        { width: 1, height: 1, giftCounts: [1] },
      ),
      true,
    );
  });

  test("# should fit 1x2", () => {
    asseq(
      someValidPlacements(
        [assIsGiftMatrix([["#"]])].map(createDedupedTransmutations),
        { width: 2, height: 1, giftCounts: [1] },
      ),
      true,
    );
  });

  test("2 # should not fit 1x1", () => {
    asseq(
      someValidPlacements(
        [assIsGiftMatrix([["#"]])].map(createDedupedTransmutations),
        { width: 1, height: 1, giftCounts: [2] },
      ),
      false,
    );
  });

  test("# and ## should not fit 1x1", () => {
    expect(() =>
      someValidPlacements(
        [assIsGiftMatrix([["#"]]), assIsGiftMatrix([["#", "#"]])].map(
          createDedupedTransmutations,
        ),
        { width: 1, height: 1, giftCounts: [1, 1] },
      ),
    ).toThrowErrorMatchingInlineSnapshot(`
      "gift is larger than the board. board: 1x1. gift: 

      ##
      "
    `);
  });

  test("# and ## should not fit 2x1", () => {
    const prevValidateTooLargeGifts = opts.validateTooLargeGifts;
    opts.validateTooLargeGifts = true;
    expect(() =>
      someValidPlacements(
        [assIsGiftMatrix([["#"]]), assIsGiftMatrix([["#", "#"]])].map(
          createDedupedTransmutations,
        ),
        { width: 2, height: 1, giftCounts: [1, 1] },
      ),
    ).toThrowErrorMatchingInlineSnapshot(`
      "gift was placed outside of the board. placed gift {"type":1,"rotation":0,"x":1,"y":0,"width":2,"height":1} should be inside of {"width":2,"height":1}. gift shape:
      ---
      ##
      ---"
    `);
    opts.validateTooLargeGifts = prevValidateTooLargeGifts;
  });

  test("# and ## should fit 2x2", () => {
    asseq(
      someValidPlacements(
        [assIsGiftMatrix([["#"]]), assIsGiftMatrix([["#", "#"]])].map(
          createDedupedTransmutations,
        ),
        { width: 2, height: 2, giftCounts: [1, 1] },
      ),
      true,
    );
  });
});

function visualizeBoard(board: Board, expected: string) {
  assmeq(boardToVizualizedBoard(board), expected);
}

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

    giftShape.forEach((row, localY2): void => {
      row.forEach((char, localX2): void => {
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

type VisualizedBoard = string[][];

function wrapGiftString(giftString: string): Gift {
  return wrapGift(stringToGift(giftString));
}

afterAll(() => {
  console.log(
    "\ndone. checks done during tests",
    ...c(() => isValidBoardRuns),
    ...c(() => giftsOverlapCount),
  );

  expect(opts).toStrictEqual(optsDuplicate);
});

describe(c, () => {
  test("should log the variable name and the content", () => {
    var foo = "bar";
    expect(getVariableName(() => foo)).toBe("foo");
  });
});

describe(giftsOverlap, () => {
  test("should return true when the gifts overlap", () => {
    asseq(
      giftsOverlap(
        [assIsGiftMatrix([["#"]])].map(createDedupedTransmutations),

        { type: 0, rotation: 0, x: 0, y: 0 },
        { type: 0, rotation: 0, x: 0, y: 0 },
      ),
      true,
    );
  });

  test("should return false when the gifts do not overlap with a single #", () => {
    asseq(
      giftsOverlap(
        toGiftsWithRotations(`#`),
        { type: 0, rotation: 0, x: 1, y: 0 },
        { type: 0, rotation: 0, x: 0, y: 0 },
      ),
      false,
    );

    asseq(
      giftsOverlap(
        toGiftsWithRotations(
          `#`,

          `##
		   .#`,
        ),
        { type: 0, rotation: 0, x: 0, y: 1 },
        { type: 1, rotation: 0, x: 0, y: 0 },
      ),
      false,
    );
  });
});

// shit todo use this in the main flow
const toGiftsWithRotations = (...gifts: string[]) =>
  gifts
    .map((stringGift) => assIsGiftMatrix(stringToGift(stringGift)))
    .map(createDedupedTransmutations);

describe(getProgress, () => {
  test("should return the progress", () => {
    asseq(getProgress([1], [0]), 1);
    asseq(getProgress([2], [0]), 0.5);
    asseq(getProgress([2], [1]), 1);

    asseq(getProgress([3, 3], [0]), 2 / 6);
    asseq(getProgress([3, 3], [0, 0]), 1 / 9);
    asseq(getProgress([3, 3], [0, 1]), 2 / 9);
    asseq(getProgress([3, 3], [1]), 6 / 9);
    asseq(getProgress([3, 3], [1, 0]), 4 / 9);
    asseq(getProgress([3, 3], [1, 1]), 5 / 9);

    asseq(
      // biome-ignore format: they should be aligned
      getProgress(
        [8, 10, 3, 2, 10, 3, 4, 10, 3, 4, 10, 3, 4, 10, 3, 2, 10, 3, 2, 10, 3],
        [0, 0, 0, 0, 2, 1, 2, 6, 1, 1, 9, 0, 0, 5, 2, 1, 8, 0]
      ),
      0.0005321043079936129,
    );

    asseq(
      // biome-ignore format: they should be aligned
      getProgress(
        [8, 10, 3, 2, 10, 3, 4, 10, 3, 4, 10, 3, 4, 10, 3, 2, 10, 3, 2, 10, 3],
        [0, 0, 0, 0, 6, 0, 3, 2, 2, 1, 3, 1, 1, 9, 1, 1, 3, 1]
      ),
      0.0013069082225490827,
    );
    asseq(
      // biome-ignore format: they should be aligned
      getProgress(
        [8, 10, 3, 2, 10, 3, 4, 10, 3, 4, 10, 3, 4, 10, 3, 2, 10, 3, 2, 10, 3],
        [0, 0, 0, 0, 9, 2, 3, 2, 1, 1, 6, 0, 2, 0, 1]
      ),
      0.0020702571212705763,
    );
  });

  test("2", () => {
    asseq(lerp(1, 0), { from: 0, to: 0.5 });
    asseq(lerp(1, 1), { from: 0.5, to: 1 });

    asseq(lerp(2, 0), { from: 0, to: 1 / 3 });
    asseq(lerp(2, 1), { from: 1 / 3, to: 2 / 3 });
    asseq(lerp(2, 2), { from: 2 / 3, to: 1 });

    asseq(lerpRange({ from: 0, to: 1 / 2 }, { from: 0, to: 1 / 2 }), {
      from: 0,
      to: 1 / 4,
    });

    asseq(lerpRange({ from: 1 / 2, to: 1 }, { from: 0, to: 1 / 2 }), {
      from: 2 / 4,
      to: 3 / 4,
    });

    asseq(lerpMultiple([1, 1], [0, 0]), [
      { from: 0, to: 1 },
      { from: 0, to: 1 },
    ]);

    asseq(lerpMultiple([2, 2], [1, 1]), [
      { from: 1 / 2, to: 1 },
      { from: 0.75, to: 1 },
    ]);

    asseq(lerpMultiple([8], [7]), [{ from: 7 / 8, to: 8 / 8 }]);
    asseq(getProgress([8], [7]), 1);

    asseq(
      // biome-ignore format: they should be aligned
      getProgress(
        [8, 10, 3, 2, 10, 3, 4, 10, 3, 4, 10, 3, 4, 10, 3, 2, 10, 3, 2, 10, 3],
        [0, 0, 0, 0, 2, 1, 2, 6, 1, 1, 9, 0, 0, 5, 2, 1, 8, 0]
      ),
      0.0005321043079936129,
    );

    asseq(
      // biome-ignore format: they should be aligned
      getProgress([8, 10], [7, 9]),
      1,
    );
  });
});

describe(hasBeenValidated, () => {
  test("should return true when the board has been validated", () => {
    const board = {
      gifts: toGiftsWithRotations(`#`),
      placedGifts: [{ type: 0, rotation: 0, x: 0, y: 0 }],
      width: 1,
      height: 1,
    };

    const validatedBoards = new Set<string>();
    const gifts = board.gifts;

    asseq(hasBeenValidated(board, validatedBoards, gifts), false);
    asseq(hasBeenValidated(board, validatedBoards, gifts), true);
    nonNull(board.placedGifts[0]).x = 1;
    asseq(hasBeenValidated(board, validatedBoards, gifts), false);
    asseq(hasBeenValidated(board, validatedBoards, gifts), true);
  });

  test("should detect permutations of the order of placed gifts", () => {
    const board = {
      gifts: toGiftsWithRotations(`##`),
      placedGifts: [
        { type: 0, rotation: 0, x: 0, y: 0 },
        { type: 0, rotation: 1, x: 0, y: 0 },
      ],
      width: 2,
      height: 2,
    };

    const validatedBoards = new Set<string>();
    const gifts = board.gifts;

    visualizeBoard(
      board,
      `
      XA
      B.`,
    );

    asseq(hasBeenValidated(board, validatedBoards, gifts), false);
    asseq(hasBeenValidated(board, validatedBoards, gifts), true);

    nonNull(board.placedGifts[0]).rotation = 1;
    nonNull(board.placedGifts[1]).rotation = 0;

    asseq(hasBeenValidated(board, validatedBoards, gifts), true);

    asseq([...validatedBoards], ["0,0,0,0|0,1,0,0"]);
  });
});
