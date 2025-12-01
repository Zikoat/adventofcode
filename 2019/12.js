class Vector {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    getSign() {
        return new Vector(Math.sign(this.x), Math.sign(this.y), Math.sign(this.z))
    }

    getAbsolute() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    
    getVectorBetween(vector2) {
        return new Vector(vector2.x - this.x,  vector2.y - this.y, vector2.z - this.z);
    }
    
}

let input = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`.split("\n").map(el=>{
    el = el.slice(1, -1).split(", ").map(el=>parseInt(el.split("=")[1]));
    return {
        position: new Vector(el[0], el[1], el[2]),
        velocity: new Vector(0,0,0),
    }
})

function getMechanicalEnergy() {
    return input.reduce((total,el) => {
        return total += el.position.getAbsolute() * el.velocity.getAbsolute();
    },0)
}

function applyGravity() {
    for (let moon of input) {
        gravityVectors = []
        for (const secondMoon of input) {
            let differenceVector = moon.position.getVectorBetween(secondMoon.position);
            let signedVector = differenceVector.getSign(differenceVector)
            moon.velocity.add(signedVector)
            gravityVectors.push(signedVector);
        }
    }
}

gravityVectors = []

function applyVelocity() {
    for (const moon of input) {
        moon.position.add(moon.velocity)
    }
}

function addVectors(v1, v2) {
    return {x:v1.x+v2.x, y:v1.y+v2.y, z:v1.z+v2.z}
}

function signVector(vector) {
    return {x:Math.sign(vector.x),
        y:Math.sign(vector.y),
        z:Math.sign(vector.z)}
}

// let positionChecksums = {}
let loopCounts =        Array(input.length).fill().map(()=>[])
let positionChecksums = Array(input.length).fill().map(()=>[])
let moonPeriodics =     Array(input.length).fill().map(()=>new Set())

let moonInfo = []
for (let i = 0; i < input.length; i++) {
    moonInfo[i] = {
        goesThrough: new Set(),
        periods: new Set(),
        periodOffset: 0,
        checksumsSeenTwice: new Set(),
        currentLoop: [],
        infoKnown: false,
        linkedChecksums: []
    }
}
/* period
periodOffset
goesThrough set
firstSeenTwice */

for (let i = 0; i < 1; i++) {
    for (let j = 0; j < input.length; j++) {
    //for (let j = 1; j == 1; j++) {
        let moon = moonInfo[j]
        const checksum = getChecksum(input[j])
        
        if(moon.currentLoop.includes(checksum)) {
            //info.checksumsSeenTwice.add(checksum)
            
            moon.periods.add(moon.currentLoop.length)
            loopCounts[j].push(moon.currentLoop.length)
            
            moon.currentLoop = []
            if (moon.periods.has(moon.currentLoop.length)) {

            }
        }
        
        moon.currentLoop.push(checksum);
        if(moon.goesThrough[checksum]==undefined) {
            moon.goesThrough[checksum] = 0
        }
        moon.goesThrough[checksum]++
    }

    applyGravity()
    applyVelocity()
}

//console.log(loopCounts)
//console.log("moonPeriodics",moonPeriodics)
console.log(getMechanicalEnergy())
//console.log(input)

moonInfo.forEach((el)=>{
//    el.goesThrough=""
    el.currentLoop = ""
})

console.log(input)

function getChecksum(moon) {
    return ""
        +moon.position.x + ","
        +moon.position.y + ","
        +moon.position.z + ","
        +moon.velocity.x + ","
        +moon.velocity.y + ","
        +moon.velocity.z + ","
}

function printPeriodicityDegree(next) {
    this.firstDegree.push(next)
}
