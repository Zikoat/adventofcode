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
	type Gifts,
	giftsOverlapCount,
	type Int,
	isInBounds,
	isValidBoard,
	isValidBoardRuns,
	matrixToString,
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

describe(placeGift, () => {
	test("should not mutate the original board instance and return a new board", () => {
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
			],
		);
	});
});

describe(isValidBoard, () => {
	test("single space board with 1 placed gift of 1 tile", () => {
		const gifts = [[["#"]]].map(assIsGiftMatrix);
		const boardWidth = 1;
		const boardHeight = 1;

		const board = createBoard({
			gifts,
			width: boardWidth,
			height: boardHeight,
		});

		asseq(
			isValidBoard(placeGift(board, { type: 0, rotation: 0, x: 0, y: 0 })),
			true,
		);
	});

	test("placed x position outside of board should be invalid", () => {
		asseq(
			isValidBoard(
				placeGift(createBoard({ gifts: [[["#"]]], width: 1, height: 1 }), {
					type: 0,
					rotation: 0,
					x: 1,
					y: 0,
				}),
			),
			false,
		);
	});

	test("placed gift which has piece outside of board should be invalid", () => {
		asseq(
			isValidBoard(
				placeGift(
					createBoard({
						gifts: [[["#", "#"]]],
						width: 1,
						height: 1,
					}),

					{ type: 0, rotation: 0, x: 0, y: 0 },
				),
			),
			false,
		);
	});

	test("pieces that have a tile at the same position should be invalid", () => {
		asseq(
			isValidBoard(
				createBoard({
					gifts: [[["#"]]],
					width: 1,
					height: 1,
					placedGifts: [
						{ type: 0, rotation: 0, x: 0, y: 0 },
						{ type: 0, rotation: 0, x: 0, y: 0 },
					],
				}),
			),
			false,
			"overlapping pieces ",
		);
	});

	test("place 2 gifts side by side should be valid", () => {
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
				}),
			),
			true,
		);
	});

	test("visualizing board after multiple placements should show X at positions which are wrong", () => {
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
       ..`,
		);

		boardState = placeGift(boardState, { type: 0, rotation: 1, x: 0, y: 0 });

		visualizeBoard(
			boardState,
			`A.
       A.`,
		);

		boardState = placeGift(boardState, { type: 0, rotation: 0, x: 0, y: 0 });

		visualizeBoard(
			boardState,
			`XB
       A.`,
		);

		asseq(isValidBoard(boardState), false);
	});

	test("visualizing board with a placed gift in the bottom right corner", () => {
		visualizeBoard(
			createBoard({
				gifts: [[["#"]]] satisfies Gifts,
				height: 2,
				width: 2,
				placedGifts: [{ type: 0, rotation: 0, x: 1, y: 1 }],
			}),
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
		asseq(
			canFitString(`1:
#.#

2x2: 1`),
			false,
		);
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
		asseq(
			canFitString(`1:
##

2x2: 3`),
			false,
		);
	});

	test("rotated ## should fit on 1x2 board", () => {
		asseq(
			canFitString(`1:
##

1x2: 1`),
			true,
		);
	});

	test("pieces that fit inside each other should be rotated to fit into each other", () => {
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
		asseq(
			someValidPlacements(
				[assIsGiftMatrix([["#"]]), assIsGiftMatrix([["#", "#"]])].map(
					createDedupedTransmutations,
				),
				{ width: 1, height: 1, giftCounts: [1, 1] },
			),
			false,
		);
	});

	test("# and ## should not fit 2x1", () => {
		asseq(
			someValidPlacements(
				[assIsGiftMatrix([["#"]]), assIsGiftMatrix([["#", "#"]])].map(
					createDedupedTransmutations,
				),
				{ width: 2, height: 1, giftCounts: [1, 1] },
			),
			false,
		);
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

/** hint: place multiple gifts on a board by using createBoard with an array of placedGifts */
function placeGift(board: Board, placement: PlacedGift): Board {
	return {
		...board,
		placedGifts: [...board.placedGifts, placement],
	};
}

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
	console.log("\ndone. The amount of validation checks done during all tests");
	c(() => isValidBoardRuns);
	c(() => giftsOverlapCount);
});

describe(c, () => {
	test("should log the variable name and the content", () => {
		var foo = "bar";
		c(() => foo);
	});
});
