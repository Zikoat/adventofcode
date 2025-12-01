let input = `Begin in state A.
Perform a diagnostic checksum after 12173597 steps.

In state A:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state C.

In state B:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state D.

In state C:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state E.

In state D:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the right.
    - Continue with state B.

In state E:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state F.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state C.

In state F:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state D.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.`;
let testInput = `Begin in state A.
Perform a diagnostic checksum after 6 steps.

In state A:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state B.

In state B:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.`;

function parseInput(input) {
	input = input.split("\n\n");

	let output = {};

	output.startState = input[0][15];
	output.checkAfter = input[0].split(" ")[8];

	// for each state
	for (var i = 1; i < input.length; i++) {
		let state = input[i].split("\n");

		// determine the state letter (A-F)
		let stateLetter = state[0][9];

		output[stateLetter] = {};

		// for both cases of the current value (0 or 1)
		for (var j = 0; j <= 1; j++) {
			let o = 4;
			// we find what to write to the current value
			let write = state[2 + o * j][22];
			// we find which direction to move
			let direction = state[3 + o * j][27] == "r" ? 1 : -1;
			// and what the next state is
			let nextState = state[4 + o * j][26];

			// we put the case into the state
			output[stateLetter][j] = {
				write: write,
				direction: direction,
				nextState: nextState
			};
		}
	}

	console.log(output);
	return output;
}

let tape = [];
let pointer = 0;

function getTape(pointer) {
	if (tape[pointer]) return 1;
	else return 0;
}

function getChecksum(program) {
	let state = program.startState;
	let steps = 0;

	while (steps < parseInt(program.checkAfter) + 1) {
		// main turing logic
		// the program is the blueprint
		// program[a-f] is the current state which is getting evaluated
		// state[0 or 1] is an object with the instructions for this case (either
		// case for 0 or case for 1)
		// the case contains information about what value to write, where to
		// place the pointer and which state to evaluate next
		let currentCase = program[state][getTape(pointer)];
		// logTape(state, pointer, steps);

		tape[pointer] = currentCase.write;
		pointer += currentCase.direction;
		state = currentCase.nextState;

		steps++;
	}

	let sum = 0;
	let sum2 = 0;
	for (entry in tape) sum += parseInt(tape[entry]);
	for (entry in tape) sum2 += getTape(entry);

	console.log(sum, sum2)
	for (var i = 0; i < 30; i++) {
		console.log(getTape(i-5));
	}
}

function logTape(state, pointer, steps) {
	let string = "";
	let max = -Infinity;
	let min = Infinity;
	for (entry in tape) {
		max = Math.max(max, entry);
		min = Math.min(min, entry);
	}
	for (var i = min; i <= max; i++) {
		string += tape[i];
	}
	console.log(`step ${steps}:------
tape:
${string}
pointer: ${pointer}
next state: ${state}`);
}

getChecksum(parseInput(input));

