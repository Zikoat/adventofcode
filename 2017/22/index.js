class Grid {
	constructor(){
		this.default = function(x,y){return null};
		this.data = {};
	}

	set(x, y, entry){

		if(!(x in this.data)) this.data[x] = {};
		
		this.data[x][y] = entry;
	}
	
	get(x, y){
		if(!(x in this.data)) return this.default(x, y);
		if(!(y in this.data[x])) return this.default(x, y);
		
		return this.data[x][y];
	}
}

class Virus {
	constructor(input){
		this.infections = this.createGrid(input);
		this.infections.default = function(x,y){return "clean";};

		this.pos = {x:0,y:0};
		// the whole board might be rotated, this is fixed by starting in a different direction
		this.dir = {x:-1,y:0};
		
	}

	createGrid(input){
		let grid = new Grid();

		let inputData = input.split("\n");

		let centerOffset = Math.floor(inputData.length / 2);

		for (var i = 0; i < inputData.length; i++) {
			inputData[i] = inputData[i].split("");
			
			for (var j = 0; j < inputData[i].length; j++) {
				
				let value = inputData[i][j]=="." ? "clean" : "infected";
			
				grid.set(i-centerOffset,j-centerOffset,value);
			}
		}
		return grid;
	}

	burst(){
		let state = this.infections.get(this.pos.x, this.pos.y);

		this.turn(state);

		this.infections.set(this.pos.x, this.pos.y, this.newState(state));

		this.move();
		
		// we return the infection status so we can count them
		return this.newState(state) == "infected";
	}

	turn(state){
		switch (state) {
			case "clean":
				this.turnOnce();
				break;
			case "weakened":
				break;
			case "infected":
				this.turnOnce();this.turnOnce();this.turnOnce();
				break;
			case "flagged":
				this.turnOnce();this.turnOnce();
				break;
			default:
				throw state;
				break;
		}
	}

	turnOnce(){
		let x = this.dir.x;
		let y = this.dir.y;
		this.dir.x = x ? 0 : -y;
		this.dir.y = y ? 0 : x;
		//console.log(`turning ${boolRight ? "right":"left"}, from [${x},${y}] to [${this.dir.x},${this.dir.y}]`)
	}

	move(){
		this.pos.x += this.dir.x;
		this.pos.y += this.dir.y;
	}

	newState(state){
		switch (state) {
			case "clean":
				return "weakened";
				break;
			case "weakened":
				return "infected";
				break;
			case "infected":
				return "flagged";
				break;
			case "flagged":
				return "clean";
				break;
		}
	}

	render(size){
		let string = "";
		for (var i = 0; i < size*2+1; i++) {
			for (var j = 0; j < size*2+1; j++) {
				if(i==size && j==size) {
					string+="[";
				} else if(!(i==size && j==size+1)){string+=" "}
				
				switch(this.infections.get(i-size+this.pos.x, j-size+this.pos.y)){
					case "clean":
						string += ".";
						break;
					case "weakened":
						string += "W";
						break;
					case "infected":
						string += "#";
						break;
					case "flagged":
						string += "F";
						break;
				}
				if(i==size && j==size) {
					string+="]";
				}
			}
			string+="\n";
		}
		console.log(string);
	}
}

let testInput = `..#
#..
...`

let input = `.#.....##..##..###.###..#
..##..######.#.###.##.#.#
###..#..#####.##.##.#...#
###......##..###.#...#.#.
.#.###.##..#.####.#..#...
..#.#.#####...##.####.###
..#..#.#..###.#..###.###.
#########...#....##..#.#.
.###..#######..####...###
#####...#..##...###..##..
..#......##.#....#...####
.##.#..#####.#####.##.##.
####.##.###.#..#.#.#.....
#....##.####.#.#..#.#.##.
###...##...#.###.#.#.####
.#.#...#.#.##.##....##.#.
#..##.#.#..#....###..####
#####...#..#.###...##.###
##.#..####.###...#....###
###.#####.....#....#.##..
####.##.....######.#..#.#
.#.....####.##...###..##.
....########.#..###.#..##
##.##..#...#...##.#....##
.#.######.##....####.#.##`

function doBursts(amount, input) {
	let infections = 0;
	bursts = 0;
	let sporifica = new Virus(input);
	for (var i = 0; i < amount; i++) {
		if(sporifica.burst()) infections++;
	}
	console.log(`${amount} bursts infects ${infections}`)
	sporifica.render(5);
}

function doBurstsAnimate(input) {
	let infections = 0;
	bursts = 0;
	let sporifica = new Virus(input);
	setInterval(()=>{
		if(sporifica.burst()) infections++;
		bursts++;
		sporifica.render(7);
		console.log("bursts: ", bursts);
		console.log("infections: ", infections);

	},34);
}

doBursts(1e7, input);
//doBursts(1e7, testInput);
//doBurstsAnimate(testInput);
// doBurstsAnimate(input)
