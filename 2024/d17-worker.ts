self.onmessage = (event: MessageEvent) => {
  try {
    // console.log("from worker.  event data is ");
    // console.log(event.data);
    // console.log("doing calc");

    event.data.program.forEach(assInt);
    assInt(event.data.core);
    const shit = findSmallestForCore(event.data.program, event.data.core);
    // console.log("finished calc, returning");
    postMessage(shit);
    // console.log("returned");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

import { ass, assInt, nonNull } from "./common";

function getcombo(
  program: Computer["program"],
  A: Computer["A"],
  B: Computer["B"],
  C: Computer["C"],
  pointer: number
): number {
  const literal = program[pointer + 1];

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

type Program = (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];

type Computer = {
  A: number;
  B: number;
  C: number;
  program: Program;
};

function findSmallestForCore(program: Program, core: number) {
  for (let i = core; i < 10000000000; i += 8) {
    // if (i % (10000 - core) === 0) console.log(i, "core", core);
    if (run(i, program)) return i;
  }
  return;
}
