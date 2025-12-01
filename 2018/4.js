let input = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`

let rules = input.split("\n").map(string=>{
	let step = string.substring(36,37)
	let requirement = string.substring(5,6)
})
console.log(rules);