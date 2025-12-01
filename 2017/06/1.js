let memory = [4,1,15,12,0,9,9,5,5,8,7,3,14,5,12,3];
let bankAmount = memory.length;
let configurations = [];


howManyStepsTillLoop();

function howManyStepsTillLoop() {
	let steps = 0;
	while(!configurations.includes(JSON.stringify(memory))){
		configurations.push(JSON.stringify(memory));
		cycle();
	}
	//tail size and loop size written down before i saw part 2 😎
	console.log("tail size:", configurations.indexOf(JSON.stringify(memory)))
	console.log("loop size:", configurations.length-configurations.indexOf(JSON.stringify(memory)));
	console.log("cycle count:", configurations.length);
}


function cycle() {
	let index = findIndexOfLargest();
	let blocks = memory[index];
	memory[index] = 0;
	for (var i = 1; i <= blocks; i++) {
		memory[(index + i) % bankAmount]++;
	}
}

function findIndexOfLargest() {
	let largest = 0;
	let index;
	for (var i = 0; i < memory.length; i++) {
		if(memory[i] > largest) {
			largest = memory[i];
			index = i;
		}
	}
	return index;
}
