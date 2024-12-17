import { ass, asseq, assInt, nonNull } from "./common";

function getcombo(
  program: Computer["program"],
  A: Computer["A"],
  B: Computer["B"],
  C: Computer["C"],
  pointer: number
): number {
  const literal = program[pointer + 1];
  // ass(literal !== undefined);

  let combo;
  if (literal === 1 || literal === 0 || literal === 2 || literal === 3)
    combo = literal;
  else if (literal === 4) combo = A;
  else if (literal === 5) combo = B;
  else if (literal === 6) combo = C;

  return combo!;
}
function run(Ain: number, program: Computer["program"]): boolean {
  let pointer = 0;
  let output = 0;
  let A = Ain;
  let B = 0;
  let C = 0;
  while (true) {
    if (pointer >= program.length) return false;

    const opcode = program[pointer];

    if (opcode === 0) {
      A = (A / 2 ** getcombo(program, A, B, C, pointer)) | 0;
    } else if (opcode === 1) {
      B = B ^ program[pointer + 1]!;
    } else if (opcode === 2) {
      B = getcombo(program, A, B, C, pointer) % 8;
    } else if (opcode === 3) {
      if (A !== 0) {
        const literal = program[pointer + 1];
        pointer = literal!;
        ass(literal! % 2 === 0);
        // hehe lazy
        pointer -= 2;
      }
    } else if (opcode === 4) {
      B = B ^ C;
    } else if (opcode === 5) {
      const out = getcombo(program, A, B, C, pointer) % 8;
      if (program[output] !== out) {
        return false;
      }
      output++;
      if (program.length === output) {
        return true;
      }
    } else if (opcode === 6) {
      throw Error("shit");
    } else if (opcode === 7) {
      // ass(typeof combo === "number");
      // adv
      C = (A / 2 ** getcombo(program, A, B, C, pointer)) | 0;
    } else {
      throw Error("shit");
    }
    pointer += 2;
  }
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

type Computer = {
  A: number;
  B: number;
  C: number;
  program: Program;
};

function findSmallestForCore(program: Program, core: number) {
  for (let i = core; i < 10000000; i++) {
    if (i % (1000000 - core) === 0) console.log(i);
    if (run(i, program)) return i;
  }
  return;
}

function findSmallest(program: Program): void {
  for (let core = 0; core <= 8; core++) {
    console.log(core);
    const worker = new Worker("./d17-worker.ts");

    worker.postMessage({ program: program, core: core });

    worker.onmessage = (event) => {
      console.log("finished", event.data);
    };
    // const out = findSmallestForCore(program, core);
    // if (out) return out;
  }
  // ass(false);
}

asseq(
  findSmallest(
    parse(`Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`)
  )
  // 117440
);

asseq(findSmallest(parse(real)));
