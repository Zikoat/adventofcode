import { ass, asseq, assInt, nonNull } from "./common";

function run(comp: Computer): {
  A: number;
  B: number;
  C: number;
  output: string;
} {
  let pointer = 0;
  let output = [];
  for (let i = 0; i <= 1000; i++) {
    ass(i < 800);
    const opcode = comp.program[pointer];

    if (opcode === undefined) {
      break;
    }

    const literal = comp.program[pointer + 1];
    ass(literal !== undefined);

    let combo;
    if (literal === 1 || literal === 0 || literal === 2 || literal === 3)
      combo = literal;
    else if (literal === 4) combo = comp.A;
    else if (literal === 5) combo = comp.B;
    else if (literal === 6) combo = comp.C;
    else {
      ass(literal === 7);
    }

    // console.log(opcode, literal, combo, comp.B);

    if (opcode === 0) {
      ass(typeof combo === "number");
      // adv
      const numerator = comp.A;
      const denominotar = 2 ** combo;
      const divided = numerator / denominotar;
      const truncated = Math.floor(divided);
      comp.A = truncated;
    } else if (opcode === 1) {
      // bxl
      comp.B = comp.B ^ literal;
    } else if (opcode === 2) {
      ass(typeof combo === "number");
      // bst
      comp.B = combo % 8;
    } else if (opcode === 3) {
      // jnz
      if (comp.A !== 0) {
        pointer = literal;
        // hehe lazy
        pointer -= 2;
      }
    } else if (opcode === 4) {
      // bxc
      comp.B = comp.B ^ comp.C;
    } else if (opcode === 5) {
      ass(typeof combo === "number");
      // out
      output.push(combo % 8);
    } else if (opcode === 6) {
      ass(false);
    } else if (opcode === 7) {
      ass(typeof combo === "number");
      // adv
      const numerator = comp.A;
      const denominotar = 2 ** combo;
      const divided = numerator / denominotar;
      const truncated = Math.floor(divided);
      comp.C = truncated;
    } else {
      ass(false);
    }
    pointer += 2;
  }
  return { ...comp, output: output.join(",") };
}
// asseq(run(computer).output, "4,6,3,5,6,3,5,2,1,0");

asseq(run({ A: 0, B: 0, C: 9, program: [2, 6] }).B, 1);
asseq(run({ A: 10, B: 0, C: 0, program: [5, 0, 5, 1, 5, 4] }).output, "0,1,2");
const shit2 = run({ A: 2024, B: 0, C: 0, program: [0, 1, 5, 4, 3, 0] });
asseq(shit2.A, 0);
asseq(shit2.output, "4,2,5,6,7,7,7,7,3,1,0");
asseq(run({ A: 0, B: 29, C: 0, program: [1, 7] }).B, 26);
asseq(run({ A: 0, B: 2024, C: 43690, program: [4, 0] }).B, 44354);

const test = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;

asseq(run(parse(test)).output, "4,6,3,5,6,3,5,2,1,0");

const real = `Register A: 38610541
Register B: 0
Register C: 0

Program: 2,4,1,1,7,5,1,5,4,3,5,5,0,3,3,0`;
asseq(run(parse(real)).output, "7,5,4,3,4,5,3,4,6");

function parse(input: string): Computer {
  const parsed = input
    .matchAll(
      /^Register A: (\d+)\nRegister B: (\d+)\nRegister C: (\d+)\n\nProgram: ((?:\d,?)+)$/g
    )
    .toArray()[0];

  ass(parsed);

  // shit assert integer
  let A = Number(parsed[1]);
  // shit assert integer
  let B = Number(parsed[2]);
  // shit assert integer
  let C = Number(parsed[3]);

  const program = nonNull(parsed[4])
    .split(",")
    .map(
      (a) => {
        assInt(a);
        const num = Number(a);
        ass(num <= 7);
        ass(num >= 0);
        return num as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
      }
      // shit assert 3 bit
    );
  const computer: Computer = { A, B, C, program };
  return computer;
}

type Computer = {
  A: number;
  B: number;
  C: number;
  program: (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];
};

function findSmallest(computer: Computer): number {
  for (let i = 0; i < 100000000; i++) {
    const result = run({ ...computer, A: i });
    if (i % 100000 === 0) console.log(i);
    if (result.output === computer.program.join(",")) return i;
  }
  ass(false);
}
asseq(
  findSmallest(
    parse(`Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`)
  ),
  117440
);

asseq(findSmallest(parse(real)));
