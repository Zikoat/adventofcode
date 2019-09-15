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
	console.log("number", number);
	let whichSpiral = getWhichSpiral(number);
	console.log("numbers in spiral", whichSpiral, ":", numbersInSpiral(whichSpiral));
	console.log("whichSpiral:", whichSpiral);
	number -= totalNumbers(whichSpiral);
	console.log("rest:", number);
	number = number % (numbersInSpiral(whichSpiral) / 4); // all the edges have the same distance to the center, so we only need to calculate it along one of the edges
	console.log("howFarAlongEdge:", number);
	return number;
}

function getOffset (number) {
	return howFarAlongEdge(number) - getWhichSpiral(number);
}

function distance (number) {
	let dist1 = getWhichSpiral(number);
	let dist2 = getOffset(number);
	return dist1 + dist2;
}

function debug(debugFunction){
	console.log("debug of 1 is", debugFunction(1));
	console.log("debug of 12 is", debugFunction(12));
	console.log("debug of 23 is", debugFunction(23));
	console.log("debug of 1024 is", debugFunction(1024));
}

//debug(distance);
console.log(distance(347991));