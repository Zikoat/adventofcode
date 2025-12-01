let input = `24/14
30/24
29/44
47/37
6/14
20/37
14/45
5/5
26/44
2/31
19/40
47/11
0/45
36/31
3/32
30/35
32/41
39/30
46/50
33/33
0/39
44/30
49/4
41/50
50/36
5/31
49/41
20/24
38/23
4/30
40/44
44/5
0/43
38/20
20/16
34/38
5/37
40/24
22/17
17/3
9/11
41/35
42/7
22/48
47/45
6/28
23/40
15/15
29/12
45/11
21/31
27/8
18/44
2/17
46/17
29/29
45/50`
let testInput = `0/2
2/2
2/3
3/4
3/5
0/1
10/1
9/10`
function parseInput(input) {
	input = input.split("\n");
	for (var i = 0; i < input.length; i++) {
		input[i] = input[i].split("/");
		input[i] = [parseInt(input[i][0]),parseInt(input[i][1])];
	}
	return input;
}

function getValidBridges(number, bridges) {
	let validBridges = [];
	for (var i = 0; i < bridges.length; i++) {
		if(bridges[i].includes(number)) validBridges.push(bridges[i]);
	}
	return validBridges;
}

function getLargestPointBridgeWithPort(port, bridges) {
	let largestPoints = 0;
	let validBridges = getValidBridges(port, bridges);

	for (var i = 0; i < validBridges.length; i++) {
		let currentBridge = validBridges[i];
		// console.log("can connect ", port, " to ", currentBridge)
		let points = currentBridge[0]+currentBridge[1];

		let smallerBridgesArray = removeBridge(bridges, currentBridge);

		let nextBridgePort = otherPort(currentBridge, port);
		// console.log("the next port is ", nextBridgePort);

		// we increment the global length counter, which counts how deep we are into the recursive call
		length++;

		console.log(length)		

		if(length>=largestLength){
			largestLength = length;
			largestPointsOfLongestBridge = largestPoints;
			console.log("the current bridge is ", currentBridge);
			console.log("with points", largestPoints)
		}
		points += getLargestPointBridgeWithPort(nextBridgePort, smallerBridgesArray);
		largestPoints = Math.max(points, largestPoints);
		length--;
	}
	return largestPoints;
}

function otherPort(bridge, port) {
	if(bridge.indexOf(port)==-1) console.err(bridge, "does not have ", port);
	return bridge.indexOf(port) ? bridge[0] : bridge[1];
}

function removeBridge(bridges, bridge) {
	return bridges.filter(item => item[0] !== bridge[0] || item[1] !== bridge[1])
}


let bridges = parseInput(testInput);
console.log(bridges);
let length = 0;
let largestLength = 0;
let largestPointsOfLongestBridge = 0;
console.log(getLargestPointBridgeWithPort(0, bridges));
console.log("largest length:", largestLength);
console.log("largestPointsOfLongestBridge", largestPointsOfLongestBridge)