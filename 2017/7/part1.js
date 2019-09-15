const input = `pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`

function parseRow(row) {
	let arrowIndex = row.indexOf("->");
	let children = [];
	if(arrowIndex !== -1) {
		children = row.substring(arrowIndex+3).split(", ");
	}
	//console.log(children);
	const weight = parseInt(row.substring(row.indexOf("(")+1, row.indexOf(")")));
	//console.log(weight);
	const name = row.substring(0, row.indexOf("(")-1);
	return {
		name: name,
		weight: weight,
		children: children
	};
}
function parseInput(input) {
	let rows = input.split(`\n`);
	let parsed = rows.map(row=>parseRow(row));
	return parsed;
}

let nodes = parseInput(input)
console.log("the root is", findRoot());


function findRoot() {
	let index = Math.floor(Math.random()*nodes.length);
	console.log("starting at",nodes[index].name);
	let parent = findParent(nodes[index].name);
	
	while(parent !== null) {
		index = nodes.indexOf(getNode(parent));
		parent = findParent(nodes[index].name);
	}
	return nodes[index].name;
}

function getNode(name) {
	for (var i = 0; i < nodes.length; i++) {
		if(nodes[i].name===name) return nodes[i];
	}
}

function findParent(node) {
	for (var i = 0; i < nodes.length; i++) {
		if(nodes[i].children.includes(node)) return nodes[i].name;
	}
	return null;
}

//-----------

function getSubTreeWeight(node) {
	if(node.children.length === 0) return node.weight;
	let children = node.children;
	let childrenWeight = 0;
	children.forEach(child => childrenWeight += getSubTreeWeight(getNode(child)));
	return node.weight + childrenWeight;
}

console.log("weight of ",nodes[5].name,  getSubTreeWeight(nodes[5]))
nodes.forEach(node=>isBalanced(node));
//nodes.forEach(node=>console.log(node.name, "has", node.children.length, "children"));
function isBalanced(node) {
	if(node.children.length===0) return true;
	let children = node.children;
	let baseWeight = getSubTreeWeight(getNode(children[0]));
	if(children.every(child=>getSubTreeWeight(getNode(child)) == baseWeight)) {
		// console.log("children of", node.name, "are the same");
		return true;
	} else {
		console.log("children of", node.name, "are unbalanced");
		return false;
	}
}