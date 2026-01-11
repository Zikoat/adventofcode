import { deepEquals } from "bun";
import { ass, asseq, assInt } from "./common.ts";

const testInput = (
  `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}` as const
)
  .split("\n")
  .map((line) => {
    const firstSplit = line.split("] ");

    ass(firstSplit[0]);
    ass(firstSplit[1]);
    const lights = [...firstSplit[0].replaceAll("[", "")].map(
      (lightChar) => lightChar === "#",
    );
    const secondSplit = firstSplit[1].split(" {");
    ass(secondSplit[0]);
    ass(secondSplit[1]);
    const buttons = secondSplit[0].split(" ").map((buttonsString) =>
      buttonsString
        .replaceAll(/\(|\)/g, "")
        .split(",")
        .map((buttonString) => {
          assInt(buttonString);
          return Number(buttonString);
        }),
    );
    const joltages = secondSplit[1]
      .replaceAll("}", "")
      .split(",")
      .map((joltage) => {
        assInt(joltage);
        return Number(joltage);
      });
    return { buttons, joltages, lights };
  });

const [firstMachine2] = testInput;
ass(firstMachine2);
console.log(firstMachine2);

const state = firstMachine2.lights.map((_) => false);
console.log(state);

function pressButton(lights: boolean[], button: number[]): boolean[] {
  const newLights = [...lights];

  for (const wire of button) {
    ass(typeof newLights[wire] === "boolean");
    newLights[wire] = !newLights[wire];
  }

  return newLights;
}

asseq(pressButton([false, false, false, false], [3]), [
  false,
  false,
  false,
  true,
]);

function assStateEqual(a: boolean[], b: boolean[]): boolean {
  return deepEquals(a, b);
}

function printState(_lights: boolean[]) {
  console.log(state.map((light) => (light ? "#" : ".")).join(""));
}

function findSmallestButtonPresses(machine: {
  lights: boolean[];
  buttons: number[][];
}): number {
  const states: boolean[][] = [[false, false, false, false]];

  for (let i = 0; i < 10; i++) {
    // const newStates = states.flatMap
    // const currentState: number[] = [];
    // while (currentState) {
    //   // currentState = states.unshift();
    // }

    for (const state2 of states) {
      for (const button of machine.buttons) {
        const nextState = pressButton(state2, button);
        // console.log(nextState);
        printState(nextState);
        if (assStateEqual(state2, machine.lights)) {
          return i;
        }
        // newStates.push(nextState);
        // console.log(newStates);
      }
    }
  }

  throw new Error("shit, more than 10");
}

asseq(
  findSmallestButtonPresses({
    buttons: [[3], [1, 3], [2], [2, 3], [0, 2], [0, 1]],
    lights: [false, true, true, false],
  }),
  2,
);
