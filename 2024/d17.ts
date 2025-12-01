import { ass, asseq, assInt, nonNull } from "./common";

function run(program: Program): void {
  let pointer = 0;
  let output = 0;
  // let A = a;
  let B_count = 0;
  let C_count = 0;
  let A_count = 0;
  console.log("B_0 == 0, C_0 == 0");
  for (let i = 0; i <= 1000; i++) {
    ass(i < 999);
    const opnum = program[pointer];

    if (opnum === undefined) {
      break;
    }

    const literal = program[pointer + 1];

    ass(literal !== undefined);

    let combo;
    if (literal === 1 || literal === 0 || literal === 2 || literal === 3)
      combo = literal.toString() + "";
    else if (literal === 4) combo = "A_" + A_count;
    else if (literal === 5) combo = "B_" + B_count;
    else if (literal === 6) combo = "C_" + C_count;
    else {
      ass(literal === 7);
    }

    // console.log(opcode, literal, combo, comp.B);
    const common = "";
    `p ` +
      pointer.toString().padEnd(2) +
      " op " +
      opnum +
      " lit " +
      literal +
      " comb " +
      combo?.toString().padEnd(4);
    if (opnum === 0) {
      // adv
      console.log(
        common,
        "adv, A_" + (A_count + 1),
        "== floor(A_" + A_count + " / (2 ** " + combo + "))"
      );
      A_count++;
      // A = Math.floor(A / 2 ** combo);
    } else if (opnum === 1) {
      // bxl
      console.log(
        common,
        "bxl, B_" + (B_count + 1),
        "== B_" + B_count + " XOR " + literal
      );
      // B = B ^ literal;
      B_count++;
    } else if (opnum === 2) {
      // bst
      // ass(typeof combo === "number");
      console.log(
        common,
        "bst, B_" + (B_count + 1),
        "== B_" + B_count + " % 8"
      );
      B_count++;
    } else if (opnum === 3) {
      // jnz
      asseq(literal % 2, 0);
      asseq(program[pointer + 2], undefined);
      if (output + 1 === program.length) {
        console.log(common, "jnz, A_" + A_count, "== 0");
      } else {
        console.log(common, "jnz, A_" + A_count, "!= 0");
        pointer = literal - 2;
      }
    } else if (opnum === 4) {
      // bxc
      console.log(
        common,
        "bxc, B_" + (B_count + 1),
        "== B_" + B_count + " XOR C_" + C_count
      );
      B_count++;
      // B = B ^ C;
    } else if (opnum === 5) {
      // out
      // ass(typeof combo === "number");

      const expectedOutput = program[output];
      console.log(common, "out, A_" + A_count, "% 8 == " + expectedOutput);
      // output.push(combo % 8);
      output++;
    } else if (opnum === 6) {
      ass(false);
    } else if (opnum === 7) {
      // cdv
      console.log(
        common,
        "cdv, C_" + (A_count + 1),
        "== floor(A_" + A_count + " / (2 ** " + combo + "))"
      );
      C_count++;

      // C = Math.floor(A / 2 ** combo);
    } else {
      ass(false);
    }
    pointer += 2;
  }

  return;
}

const real = `Register A: 38610541
Register B: 0
Register C: 0

Program: 2,4,1,1,7,5,1,5,4,3,5,5,0,3,3,0`;

function parse(input: string): Program {
  const parsed = input
    .matchAll(
      /^Register A: (\d+)\nRegister B: (\d+)\nRegister C: (\d+)\n\nProgram: ((?:\d,?)+)$/g
    )
    .toArray()[0];

  ass(parsed);

  const program = nonNull(parsed[4])
    .split(",")
    .map((a) => {
      assInt(a);
      const num = Number(a);
      ass(num <= 7);
      ass(num >= 0);
      return num as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    });

  return program;
}

type Program = (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];

function findSmallest(program: Program): void {
  console.log(...program);
  run(program);
}

asseq(
  findSmallest(
    parse(`Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`)
  )
);
console.log("--- OK ---");
asseq(findSmallest(parse(real)));
