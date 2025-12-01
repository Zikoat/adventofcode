let input = `Step J must be finished before step H can begin.
Step N must be finished before step C can begin.
Step G must be finished before step P can begin.
Step M must be finished before step I can begin.
Step H must be finished before step X can begin.
Step B must be finished before step Y can begin.
Step C must be finished before step L can begin.
Step F must be finished before step I can begin.
Step V must be finished before step O can begin.
Step W must be finished before step Q can begin.
Step E must be finished before step L can begin.
Step U must be finished before step S can begin.
Step D must be finished before step K can begin.
Step Y must be finished before step X can begin.
Step T must be finished before step R can begin.
Step I must be finished before step K can begin.
Step A must be finished before step K can begin.
Step L must be finished before step X can begin.
Step Q must be finished before step S can begin.
Step S must be finished before step O can begin.
Step P must be finished before step Z can begin.
Step X must be finished before step R can begin.
Step Z must be finished before step O can begin.
Step O must be finished before step K can begin.
Step R must be finished before step K can begin.
Step J must be finished before step W can begin.
Step F must be finished before step V can begin.
Step A must be finished before step X can begin.
Step Z must be finished before step K can begin.
Step M must be finished before step O can begin.
Step X must be finished before step K can begin.
Step E must be finished before step K can begin.
Step J must be finished before step K can begin.
Step E must be finished before step Y can begin.
Step B must be finished before step Q can begin.
Step X must be finished before step Z can begin.
Step D must be finished before step L can begin.
Step N must be finished before step I can begin.
Step N must be finished before step B can begin.
Step V must be finished before step A can begin.
Step H must be finished before step R can begin.
Step N must be finished before step L can begin.
Step U must be finished before step O can begin.
Step A must be finished before step O can begin.
Step V must be finished before step Z can begin.
Step O must be finished before step R can begin.
Step Q must be finished before step P can begin.
Step F must be finished before step Q can begin.
Step P must be finished before step R can begin.
Step S must be finished before step X can begin.
Step J must be finished before step E can begin.
Step V must be finished before step P can begin.
Step M must be finished before step D can begin.
Step I must be finished before step S can begin.
Step Q must be finished before step O can begin.
Step M must be finished before step H can begin.
Step W must be finished before step X can begin.
Step D must be finished before step O can begin.
Step X must be finished before step O can begin.
Step Y must be finished before step Z can begin.
Step F must be finished before step L can begin.
Step V must be finished before step T can begin.
Step V must be finished before step E can begin.
Step Y must be finished before step A can begin.
Step I must be finished before step R can begin.
Step L must be finished before step O can begin.
Step U must be finished before step X can begin.
Step Q must be finished before step X can begin.
Step P must be finished before step X can begin.
Step G must be finished before step C can begin.
Step A must be finished before step L can begin.
Step M must be finished before step U can begin.
Step L must be finished before step S can begin.
Step S must be finished before step P can begin.
Step S must be finished before step K can begin.
Step F must be finished before step T can begin.
Step Q must be finished before step K can begin.
Step G must be finished before step M can begin.
Step G must be finished before step F can begin.
Step T must be finished before step Q can begin.
Step F must be finished before step Z can begin.
Step I must be finished before step Z can begin.
Step N must be finished before step X can begin.
Step J must be finished before step F can begin.
Step W must be finished before step E can begin.
Step M must be finished before step Z can begin.
Step G must be finished before step X can begin.
Step V must be finished before step U can begin.
Step P must be finished before step O can begin.
Step U must be finished before step R can begin.
Step G must be finished before step Z can begin.
Step F must be finished before step R can begin.
Step L must be finished before step R can begin.
Step F must be finished before step A can begin.
Step I must be finished before step O can begin.
Step D must be finished before step T can begin.
Step U must be finished before step L can begin.
Step B must be finished before step S can begin.
Step S must be finished before step Z can begin.
Step J must be finished before step N can begin.
Step H must be finished before step T can begin.`

let rules = input.split("\n").map(string=>{
	let step = string.substring(36,37)
	let requirement = string.substring(5,6)
	return {step: step, requirement: requirement}
})
console.log("<<<", rules, ">>>");

let steps = {}
rules.forEach(rule=>{
	let stepName = rule.step
	let req = rule.requirement
	
	if(steps[stepName]==undefined) steps[stepName] = []
	if(steps[req]==undefined) steps[req] = []
	steps[stepName].push(req)
	
})
console.log("<<<", steps, ">>>");

let order = ""
let stepNames = Object.keys(steps).sort()
console.log("<<<", stepNames, ">>>");

let taskLength = {}
stepNames.forEach(stepName=>{
	taskLength[stepName] = stepNames.indexOf(stepName)+1 +60
})

let seconds = 0
let done = ""
let workers = [0, 0, 0, 0, 0]
let workingOnSteps = ["", "", "", "", ""]

function idleWorkerIndex() {
	return workers.indexOf(0);
}

function availableTasks() {
	
	return stepNames
		.filter(stepName=>{
			let requirements = steps[stepName]
			return requirements.every(requirement=>done.includes(requirement))
		})
		.filter(stepName=>!workingOnSteps.includes(stepName))
		.filter(stepName=>!done.includes(stepName))
}

function isDone(requirement) {
	return done.includes(requirement)
}

function isBeingWorkedOn(requirement) {
	return workingOnSteps.includes(requirement)
}

while (done.length <	 stepNames.length /*&& seconds < 100*/) {
	for (var i = 0; i < workers.length; i++) {
		if ((workers[i] == 0) && workingOnSteps[i] != "") {
			let workDone = workingOnSteps[i]
			workingOnSteps[i] = ""
			done += workDone
		}
	}
	console.log("available tasks: ", availableTasks())
	while((idleWorkerIndex() > -1) && (availableTasks().length > 0)) {
		let assignedTask = availableTasks()[0]
		let assignedTaskLength = taskLength[assignedTask]
		let assignWorker = idleWorkerIndex()

		console.log("assigning %s to %i", assignedTask, assignWorker)
		workers[assignWorker] = assignedTaskLength
		workingOnSteps[assignWorker] = assignedTask
	}



	console.log(seconds, workers, workingOnSteps, done)
	seconds++
	workers = workers.map(worker => Math.max(--worker, 0))
}


/*while(stepNames.length > 0){
	for (var i = 0; i < stepNames.length; i++) {
		let stepName = stepNames[i]
		let requirement = steps[stepName].sort()
		//console.log(stepName, requirement)
		if(requirement.length == 0) {
			stepNames.forEach(step=>{
				let index = steps[step].indexOf(stepName)
				if(index > -1)
					  steps[step].splice(index, 1);
			})
			delete steps[stepName]
			order += stepName
			break
		}
	}
	stepNames = Object.keys(steps).sort()
}*/

console.log(order)