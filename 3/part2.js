function numbersInSpiral (spiral) {
	if(spiral==0)return 1;
	return spiral * 8;
}

function totalNumbers (spiral) {
	let n = 0;
	for (var i = 0; i < spiral; i++) {
		n += numbersInSpiral(i);
	}
	return n;
}
function getWhichSpiral (number) {
	let spiral = 0;
	while (number > totalNumbers(spiral)/*totalnumbers can be cached*/) {
		// if the total numbers in the next loop is larger than this loop, return this loop
		spiral+=1;
	}
	return spiral-1;
}

function howFarAlongEdge (number) {
	let whichSpiral = getWhichSpiral(number);
	let rest = number - totalNumbers(whichSpiral);
	return rest;
}

function getPosition(number) {
	//let alongEdge = rest % (numbersInSpiral(whichSpiral) / 4);
	let alongOuterSpiral = howFarAlongEdge(number);
	let spiralRadius = getWhichSpiral(number);
	let edgeLength = spiralRadius*2;
	
	// we start at the first element in this spiral(2, 10)
	let x = spiralRadius;
	let y = -spiralRadius;

	// and literally walk around the outer spiral
										y+=Math.min(edgeLength, alongOuterSpiral-edgeLength*0);
	if(alongOuterSpiral > edgeLength*1) x-=Math.min(edgeLength, alongOuterSpiral-edgeLength*1);
	if(alongOuterSpiral > edgeLength*2) y-=Math.min(edgeLength, alongOuterSpiral-edgeLength*2);
	if(alongOuterSpiral > edgeLength*3) x+=Math.min(edgeLength, alongOuterSpiral-edgeLength*3);

	return {x:x, y:y};
}

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

const relativeNeighbors =  [
	[-1,-1],
	[0,-1],
	[1,-1],
	[-1,0],
	[1,0],
	[-1,1],
	[0,1],
	[1,1]
];

function distanceToCenter(number) {
	let pos = getPosition(number);
	return Math.abs(pos.x) + Math.abs(pos.y);
}

function sumOfNeighbors(location) {
	let sum = 0;
	for (var i = 0; i <= relativeNeighbors.length - 1; i++) {
		let neighborX = location.x + relativeNeighbors[i][0];
		let neighborY = location.y + relativeNeighbors[i][1];
		sum += space.get(neighborX, neighborY);
	}
	return sum;
}

let space = new Grid();
space.set(0,0, 1);
space.default = function(x,y){return 0;}

console.log(sumOfNeighbors({x:1, y:0}))

let value = 1;
let i = 2;
while(value<347991){

	let position = getPosition(i);
	value = sumOfNeighbors(position);
	space.set(position.x, position.y, value);
	console.log("setting ",position.x, position.y ,value);
	i++;
}
console.log(value);