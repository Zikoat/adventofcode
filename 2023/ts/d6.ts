import { assert, assertEqual } from "./common"

const realinput = {
    time: [48938595],
    distance: [296192812361391],
}

const example :InputType = {
    time:[71530],
    distance:[  940200]
}

const input = example
type InputType = {
    time: number[];
    distance: number[];
};


const marginForError:number[]= []

for (let i = 0; i < input.time.length; i++) {
    const time = input.time[i];
    const distance = input.distance[i];
    let waysToWin =0

    for (let holdButtonTime = 0; holdButtonTime <= time; holdButtonTime++) {
        const speed = holdButtonTime
        const timeLeftAfterHoldButton = time - holdButtonTime
        const distanceForThisHoldButton = speed * timeLeftAfterHoldButton
        console.log("holdButtonTime",holdButtonTime,distanceForThisHoldButton)
        if(distanceForThisHoldButton > distance){
            waysToWin++
        }
    }
console.log("waus to win:",waysToWin)
marginForError.push(waysToWin)
    
}

const marginProduct = marginForError.reduce((a, b) => a * b);
console.log( marginProduct)
