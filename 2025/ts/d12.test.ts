import { afterAll, describe, expect, it, mock, test } from "bun:test";
import { ass, asseq, nonNull } from "./common.ts";
import {
  assIsGiftMatrix,
  assmeq,
  type Board,
  type CombinationChecker,
  c,
  canFitString,
  combinationsWithCheck,
  combinationsWithNext,
  createAllTransmutations,
  createDedupedTransmutations,
  flipGiftVertically,
  type GetNext,
  type Gift,
  getProgress,
  getVariableName,
  giftsOverlap,
  giftsOverlapCount,
  hasBeenValidated,
  type IsComplete,
  isAdjacent,
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
  radicesToCurrentCombination,
  rotateGift90Right,
  someValidPlacements,
  stringToGift,
  stringToMatrix,
  transposeGift,
  wrapGift,
} from "./d12.ts";

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
    assmeq(wrapGiftString("#"), "#");
  });

  it("should handle various wrapping cases", () => {
    assmeq(wrapGiftString("##"), "##");
    assmeq(
      wrapGiftString(
        `#
         #`,
      ),
      `#
       #`,
    );
    assmeq(wrapGiftString(".#"), "#");
    assmeq(wrapGiftString("#."), "#");
    assmeq(wrapGiftString("#.#"), "#.#");
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

    // @ts-expect-error matrix is string, but gift is #|.
    const gift: Gift = matrix;

    // biome-ignore lint/complexity/noVoid: need usage of gift
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
    asseq(isInBounds({ x: 0, y: 0 }, { height: 1, width: 1 }), true);
    asseq(isInBounds({ x: -1, y: 0 }, { height: 1, width: 1 }), false);
    asseq(isInBounds({ x: 0, y: -1 }, { height: 1, width: 1 }), false);
    asseq(isInBounds({ x: 1, y: 0 }, { height: 1, width: 1 }), false);
    asseq(isInBounds({ x: 0, y: 1 }, { height: 1, width: 1 }), false);
    asseq(isInBounds({ x: 2, y: 0 }, { height: 1, width: 3 }), true);
    asseq(isInBounds({ x: 3, y: 0 }, { height: 1, width: 3 }), false);
  });
});

describe(isValidBoard, () => {
  test("single space board with 1 placed gift of 1 tile", () => {
    asseq(
      isValidBoard({
        gifts: toGiftsWithRotations("#"),
        height: 1,
        placedGifts: [{ rotation: 0, type: 0, x: 0, y: 0 }],
        width: 1,
      }),
      true,
    );
  });

  test("placed x position outside of board should be invalid", () => {
    const prevValidateLastGiftCellInside = opts.validateLastGiftCellInside;
    opts.validateLastGiftCellInside = true;
    expect(() =>
      isValidBoard({
        gifts: toGiftsWithRotations("#"),
        height: 1,
        placedGifts: [
          {
            rotation: 0,
            type: 0,
            x: 1,
            y: 0,
          },
        ],
        width: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "gift was placed outside of the board. placed gift {"rotation":0,"type":0,"x":1,"y":0,"height":1,"width":1} should be inside of {"height":1,"width":1}. gift shape:
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
        gifts: toGiftsWithRotations("##"),
        height: 1,
        placedGifts: [{ rotation: 0, type: 0, x: 0, y: 0 }],
        width: 1,
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
        gifts: toGiftsWithRotations("#"),
        height: 1,
        placedGifts: [
          { rotation: 0, type: 0, x: 0, y: 0 },
          { rotation: 0, type: 0, x: 0, y: 0 },
        ],
        width: 1,
      }),
      false,
      "overlapping pieces ",
    );
  });

  test("place 2 gifts side by side should be valid", () => {
    asseq(
      isValidBoard({
        gifts: toGiftsWithRotations("#"),
        height: 1,
        placedGifts: [
          { rotation: 0, type: 0, x: 0, y: 0 },
          { rotation: 0, type: 0, x: 1, y: 0 },
        ],
        width: 2,
      }),
      true,
    );
  });

  test("visualizing board after multiple placements should show X at positions which are wrong", () => {
    const boardState = {
      gifts: toGiftsWithRotations("##"),
      height: 2,
      placedGifts: [] as PlacedGift[],
      width: 2,
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
      height: 2,
      placedGifts: [],
      width: 2,
    });

    visualizeBoard(
      boardState,
      `..
       ..`,
    );

    boardState.placedGifts.push({ rotation: 1, type: 0, x: 0, y: 0 });

    visualizeBoard(
      boardState,
      `A.
       A.`,
    );

    boardState.placedGifts.push({ rotation: 0, type: 0, x: 0, y: 0 });

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
        gifts: toGiftsWithRotations("#"),
        height: 2,
        placedGifts: [{ rotation: 0, type: 0, x: 1, y: 1 }],
        width: 2,
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
      height: 4,
      placedGifts: [
        {
          rotation: 3,
          type: 4,
          x: 1,
          y: 1,
        },
        {
          rotation: 3,
          type: 4,
          x: 0,
          y: 1,
        },
      ],
      width: 4,
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
    const spy = mock<CombinationChecker>(
      (combination) =>
        combination.length > 0 && combination.every((shit) => shit !== 0),
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

describe(radicesToCurrentCombination, () => {
  test("shit", () => {
    const combinations = [
      ["a", "b"],
      ["c", "d"],
    ];
    asseq(radicesToCurrentCombination(combinations, [0, 0]), ["a", "c"]);
    asseq(radicesToCurrentCombination(combinations, [0, 1]), ["a", "d"]);
  });

  test("should return empty array when no indices", () => {
    asseq(radicesToCurrentCombination([], []), []);
  });

  test("should throw an error when an index is out of bounds", () => {
    expect(() =>
      radicesToCurrentCombination([["a"]], [2]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"a radix was out of bounds. radices[2] combinationLengths[1]"`,
    );
  });

  test("should throw an error when there are more indices than arrays", () => {
    expect(() =>
      radicesToCurrentCombination([["a"]], [0, 0]),
    ).toThrowErrorMatchingInlineSnapshot(`"2 radices but 1 combinations"`);
  });

  test("should throw an error when there are less indices than arrays", () => {
    expect(() =>
      radicesToCurrentCombination([["a"]], []),
    ).toThrowErrorMatchingInlineSnapshot(`"0 radices but 1 combinations"`);
  });
});

describe(combinationsWithNext, () => {
  // shit todo we should also have a counter which checks the current index such that
  // we can have a progress bar

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
    expect(isComplete).lastCalledWith([]);
  });

  test("if we always return 'a', then it should traverse that until it reaches the end and the lowest one returns []", () => {
    const getNext = mock<GetNext<"a">>((combinations): "a"[] =>
      combinations.length < 6 ? ["a"] : [],
    );

    asseq(combinationsWithNext(getNext), false);

    expect(getNext).nthCalledWith(1, []);
    expect(getNext).nthCalledWith(2, ["a"]);
    expect(getNext).nthCalledWith(3, ["a", "a"]);
    expect(getNext).lastCalledWith(["a", "a", "a", "a", "a", "a"]);
    expect(getNext).toBeCalledTimes(7);
  });

  test(`if the first returns ["a","b","c"], then it will traverse to index 0
which is "a", then it will run the next combination function and return
["10", "20"]. we then traverse to "10" with index 0, and this returns []
we continue until we hit "b 20" which is valid and complete, and so we
stop and return true.`, () => {
    const getNext = mock<GetNext>((combinations) => {
      switch (combinations.length) {
        case 0:
          return ["a", "b", "c"];
        case 1:
          return ["10", "20"];
        default:
          return [];
      }
    });

    const isComplete = mock<IsComplete>(
      (combinations): boolean =>
        combinations.length === 2 &&
        combinations[0] === "b" &&
        combinations[1] === "20",
    );

    asseq(combinationsWithNext(getNext, isComplete), true);

    expect(getNext).nthCalledWith(1, []);
    expect(getNext).toHaveNthReturnedWith(1, ["a", "b", "c"]);
    expect(getNext).nthCalledWith(2, ["a"]);
    expect(getNext).toHaveNthReturnedWith(2, ["10", "20"]);
    expect(getNext).nthCalledWith(3, ["a", "10"]);
    expect(getNext).toHaveNthReturnedWith(3, []);
    expect(getNext).nthCalledWith(4, ["a", "20"]);
    expect(getNext).toHaveNthReturnedWith(4, []);
    expect(getNext).nthCalledWith(5, ["b"]);
    expect(getNext).toHaveNthReturnedWith(5, ["10", "20"]);
    expect(getNext).nthCalledWith(6, ["b", "10"]);
    expect(getNext).toHaveNthReturnedWith(6, []);
    expect(getNext).nthCalledWith(7, ["b", "20"]);
    expect(getNext).toHaveNthReturnedWith(7, []);
    expect(getNext).toBeCalledTimes(7);

    expect(isComplete).toBeCalledTimes(4);
    expect(isComplete).nthCalledWith(1, ["a", "10"]);
    expect(isComplete).nthCalledWith(2, ["a", "20"]);
    expect(isComplete).nthCalledWith(3, ["b", "10"]);
    expect(isComplete).nthCalledWith(4, ["b", "20"]);
  });
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
    opts.validateTooLargeGifts = true;
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
        "gift was placed outside of the board. placed gift {"rotation":0,"type":0,"x":1,"y":0,"height":1,"width":2} should be inside of {"height":2,"width":2}. gift shape:
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
        giftCounts: [1],
        height: 1,
        width: 1,
      }),
      true,
    );
  });

  test("2 ## should fit 2x2", () => {
    asseq(
      someValidPlacements([[[["#"]]], [[["#"]]]], {
        giftCounts: [2, 2],
        height: 2,
        width: 2,
      }),
      true,
    );
  });

  test("deduped # should fit 1x1", () => {
    asseq(
      someValidPlacements(
        [assIsGiftMatrix([["#"]])].map(createDedupedTransmutations),
        { giftCounts: [1], height: 1, width: 1 },
      ),
      true,
    );
  });

  test("# should fit 1x2", () => {
    asseq(
      someValidPlacements(
        [assIsGiftMatrix([["#"]])].map(createDedupedTransmutations),
        { giftCounts: [1], height: 1, width: 2 },
      ),
      true,
    );
  });

  test("2 # should not fit 1x1", () => {
    asseq(
      someValidPlacements(
        [assIsGiftMatrix([["#"]])].map(createDedupedTransmutations),
        { giftCounts: [2], height: 1, width: 1 },
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
        { giftCounts: [1, 1], height: 1, width: 1 },
      ),
    ).toThrowErrorMatchingInlineSnapshot(`
      "gift is larger than the board. board: 1x1. gift: 

      ##
      "
    `);
  });

  test("# and ## should not fit 2x1", () => {
    opts.validateEveryGiftCellInside = true;

    expect(() =>
      someValidPlacements(
        [assIsGiftMatrix([["#"]]), assIsGiftMatrix([["#", "#"]])].map(
          createDedupedTransmutations,
        ),
        { giftCounts: [1, 1], height: 1, width: 2 },
      ),
    ).toThrowErrorMatchingInlineSnapshot(`
      "gift was placed outside of the board. placed gift {"rotation":0,"type":1,"x":1,"y":0,"height":1,"width":2} should be inside of {"height":1,"width":2}. gift shape:
      ---
      ##
      ---"
    `);
  });

  test("# and ## should fit 2x2", () => {
    asseq(
      someValidPlacements(
        [assIsGiftMatrix([["#"]]), assIsGiftMatrix([["#", "#"]])].map(
          createDedupedTransmutations,
        ),
        { giftCounts: [1, 1], height: 2, width: 2 },
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

  const boardMatrix: string[][] = new Array(board.height)
    .fill([] as string[])
    .map(function fillBoardMatrix() {
      return new Array(board.width).fill(".");
    });

  for (const [placedGiftIndex, placedGift] of board.placedGifts.entries()) {
    const letter = nonNull("ABCDEFGHIJKLMNOPQRSTUVWYZ"[placedGiftIndex]);
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

  return boardMatrix;
}

type VisualizedBoard = string[][];

function wrapGiftString(giftString: string): Gift {
  return wrapGift(stringToGift(giftString));
}

afterAll(() => {
  console.log("\ndone. checks done during tests");

  c({ giftsOverlapCount, isValidBoardRuns });

  opts.logHasAlreadyBeenValidated = optsDuplicate.logHasAlreadyBeenValidated;
  opts.validateEveryGiftCellInside = optsDuplicate.validateEveryGiftCellInside;
  opts.validateGifts = optsDuplicate.validateGifts;
  opts.validateLastGiftCellInside = optsDuplicate.validateLastGiftCellInside;
  opts.validateTooLargeGifts = optsDuplicate.validateTooLargeGifts;
});

describe(c, () => {
  test("should log the variable name and the content", () => {
    let a = 1;
    a++;

    const foo = a === 2 ? "bar" : "shit";
    expect(`${() => foo}`).toBe("() => foo");
    expect(getVariableName(() => foo)).toBe("foo");
  });
});

describe(giftsOverlap, () => {
  test("should return true when the gifts overlap", () => {
    asseq(
      giftsOverlap(
        [assIsGiftMatrix([["#"]])].map(createDedupedTransmutations),

        { rotation: 0, type: 0, x: 0, y: 0 },
        { rotation: 0, type: 0, x: 0, y: 0 },
      ),
      true,
    );
  });

  test("should return false when the gifts do not overlap with a single #", () => {
    asseq(
      giftsOverlap(
        toGiftsWithRotations("#"),
        { rotation: 0, type: 0, x: 1, y: 0 },
        { rotation: 0, type: 0, x: 0, y: 0 },
      ),
      false,
    );

    asseq(
      giftsOverlap(
        toGiftsWithRotations(
          "#",

          `##
		   .#`,
        ),
        { rotation: 0, type: 0, x: 0, y: 1 },
        { rotation: 0, type: 1, x: 0, y: 0 },
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
      gifts: toGiftsWithRotations("#"),
      height: 1,
      placedGifts: [{ rotation: 0, type: 0, x: 0, y: 0 }],
      width: 1,
    };

    const validatedBoards = new Set<string>();
    const { gifts } = board;

    asseq(hasBeenValidated(board, validatedBoards, gifts), false);
    asseq(hasBeenValidated(board, validatedBoards, gifts), true);
    nonNull(board.placedGifts[0]).x = 1;
    asseq(hasBeenValidated(board, validatedBoards, gifts), false);
    asseq(hasBeenValidated(board, validatedBoards, gifts), true);
  });

  test("should detect permutations of the order of placed gifts", () => {
    const board = {
      gifts: toGiftsWithRotations("##"),
      height: 2,
      placedGifts: [
        { rotation: 0, type: 0, x: 0, y: 0 },
        { rotation: 1, type: 0, x: 0, y: 0 },
      ],
      width: 2,
    };

    const validatedBoards = new Set<string>();
    const { gifts } = board;

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

describe(isAdjacent, () => {
  test("should return true if 2 gifts have 4-way connectivity between 2 cells", () => {
    ass(
      isAdjacent(
        toGiftsWithRotations("#"),
        { rotation: 0, type: 0, x: 0, y: 0 },
        { rotation: 0, type: 0, x: 1, y: 0 },
      ),
    );
  });

  test("should return false if 2 gifts are not touching", () => {
    ass(
      !isAdjacent(
        toGiftsWithRotations("#"),
        { rotation: 0, type: 0, x: 0, y: 0 },
        { rotation: 0, type: 0, x: 2, y: 0 },
      ),
    );
  });
});
