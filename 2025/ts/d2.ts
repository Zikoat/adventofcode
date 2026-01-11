import { ass, asseq, type Rang } from "./common.ts";

const testInputRaw = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

const inputRaw =
  "132454-182049,42382932-42449104,685933-804865,5330496-5488118,21-41,289741-376488,220191-245907,49-70,6438484-6636872,2-20,6666660113-6666682086,173-267,59559721-59667224,307-390,2672163-2807721,658272-674230,485679-647207,429-552,72678302-72815786,881990-991937,73-111,416063-479542,596-934,32825-52204,97951700-98000873,18335-27985,70203-100692,8470-11844,3687495840-3687599608,4861-8174,67476003-67593626,2492-4717,1442-2129,102962-121710,628612213-628649371,1064602-1138912";

function parseInput(input: string): Rang[] {
  return input
    .replaceAll("\n", "")
    .split(",")
    .map((range) => range.split("-").map(Number))
    .map((range) => {
      ass(range[0]);
      ass(range[1]);
      return { from: range[0], to: range[1] };
    });
}

// const testInput = parseInput(testInputRaw);

// console.log(testInput);
// const isTwice = (num: number) => {
//   const numString = num.toString();
//   const halfLength = numString.length / 2;
//   if (halfLength % 1 != 0) {
//     return false;
//   }

//   const firstHalf = numString.substring(0, halfLength);
//   const secondHalf = numString.substring(halfLength);
//   // console.log(firstHalf, secondHalf);
//   if (firstHalf === secondHalf) {
//     return true;
//   }
//   return false;
// };

const atLeastRepeated = (num: number): boolean => {
  const numString = num.toString();

  for (let i = 1; i <= numString.length / 2; i++) {
    // console.log(numString, i);
    const start = numString.substring(0, i);

    // console.log(start);
    const reg = new RegExp(`^(${start})*$`, "g");

    const isRepeated = reg.test(numString);
    // console.log("isRepeated:", isRepeated);
    if (isRepeated) {
      return true;
    }
  }
  // for each start
  // check if start repeats
  return false;
};

asseq(atLeastRepeated(12341234), true);
asseq(atLeastRepeated(12), false);
asseq(atLeastRepeated(123123123), true);
asseq(atLeastRepeated(1212121212), true);
asseq(atLeastRepeated(1111111), true);
// console.log("twiceCounst:", twiceCounts);
// console.log("itemsInRange:", itemsInRange);
// console.log("twices", twices);

function sum(nums: number[]) {
  return nums.reduce((prev, cur, _i, _arr) => prev + cur, 0);
}

// const rangeLength = ({ from, to }: Rang) => {
//   return to - from + 1;
// };

// function allRangesLength(ranges: Rang[]): number {
//   return sum(
//     ranges.map((range) => {
//       const thisRangeLength = rangeLength(range);
//       // console.log(thisRangeLength, ":", range.from, "-", range.to);
//       return thisRangeLength;
//     })
//   );
// }

// console.log("allRangesLength:", allRangesLength(testInput));

function logTwicesSum(input: string): void {
  const ranges = parseInput(input);
  // let itemsInRange = 0;

  const twices: number[] = [];

  for (const range of ranges) {
    for (let i = range.from; i <= range.to; i++) {
      // itemsInRange++;
      const iIsTwice = atLeastRepeated(i);
      if (iIsTwice) {
        // console.log(i, iIsTwice);
        twices.push(i);
      }
    }
  }

  // console.log("itemsInRange", itemsInRange);
  // console.log("twiceCounst:", twices.length);

  console.log("twices sum", sum(twices));
}

logTwicesSum(testInputRaw);
logTwicesSum(inputRaw);
