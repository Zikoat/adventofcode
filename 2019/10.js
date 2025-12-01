let test1 = `.#..#
.....
#####
....#
...##`
let test2 = `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`
let test3 = `#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`
let test4 = `.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`
let test5 = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`
let test6 = `#.........
...#......
...#..#...
.####....#
..#.#.#...
.....#....
..###.#.##
.......#..
....#...#.
...#..#..#`
let input = `##.##..#.####...#.#.####
##.###..##.#######..##..
..######.###.#.##.######
.#######.####.##.#.###.#
..#...##.#.....#####..##
#..###.#...#..###.#..#..
###..#.##.####.#..##..##
.##.##....###.#..#....#.
########..#####..#######
##..#..##.#..##.#.#.#..#
##.#.##.######.#####....
###.##...#.##...#.######
###...##.####..##..#####
##.#...#.#.....######.##
.#...####..####.##...##.
#.#########..###..#.####
#.##..###.#.######.#####
##..##.##...####.#...##.
###...###.##.####.#.##..
####.#.....###..#.####.#
##.####..##.#.##..##.#.#
#####..#...####..##..#.#
.##.##.##...###.##...###
..###.########.#.###..#.`

// console.log(maxVisibleAsteroidsCount(test1))
console.log(maxVisibleAsteroidsCount(test2))
/* 
console.log(maxVisibleAsteroidsCount(test3))
console.log(maxVisibleAsteroidsCount(test4))
console.log(maxVisibleAsteroidsCount(test5))
console.log(maxVisibleAsteroidsCount(input))
console.log(maxVisibleAsteroidsCount(test6))
*/

function maxVisibleAsteroidsCount(map) {
    let input = map.split("\n");

    const width = input[0].length
    const height = input.length
    const maxIndex = width*height
    // console.log("maxindex", maxIndex)

    let cleanedInput = [];
    input.forEach(el=>cleanedInput.push(...el.split("").map(el=>el=="#"?true:false)))

    // input.forEach(el=>console.log(el))
    // console.log(cleanedInput)

    let asteroidCounts = []

    let mostVisible = 0;
    let bestAsteroid = [];

    for (let i1 = 0; i1 < maxIndex; i1++) {
        const hasAsteroid1 = cleanedInput[i1];
        const x1 = i1 % width
        const y1 = (i1 - x1) / width
        
        let visibleFromP1Arr = []
        let p1VisibleCount = 0

        if(hasAsteroid1) {
            for (let i2 = 0; i2 < maxIndex; i2++) {
                const hasAsteroid2 = cleanedInput[i2];
                const x2 = i2 % width
                const y2 = (i2 - x2) / width
                let p2IsVisibleFromP1 = true
                if(hasAsteroid2 && i2!=i1) {
                    for (let i3 = 0; i3 < maxIndex; i3++) {
                        
                        const hasAsteroid3 = cleanedInput[i3];
                        const x3 = i3 % width
                        const y3 = (i3 - x3) / width
                        
                        const p1 = [x1,y1]
                        const p2 = [x2,y2]
                        const p3 = [x3,y3]
                        if(i2 == 1 + 8*width && i1 == 85 && y3 == 8) {
                            console.log("wow")
                            /* const p1 = [x1,y1]
                            const p2 = [x2,y2]
                            const p3 = [2,8] */
                            console.log("standing at", x1, ",", x2, "is", p3IsBetween(p1,p2,p3), "visible, because", x3, "is in the way")
                            console.log(distanceToRay(p1,p2,p3), p3IsBetween(p1,p2,p3))
                        }
                        
                        if(hasAsteroid3
                            && i3 != i2 
                            && i3 != i1
                            && distanceToRay(p1,p2,p3) < 0.001
                            && p3IsBetween(p1,p2,p3)) 
                            {
                                p2IsVisibleFromP1 = false;
                                //console.log("looking from",p1,",",p3,"is shadowing",p2)
                            }
                        }
                        if(p2IsVisibleFromP1) {
                            p1VisibleCount++
                        }
                    } 
                    if(i2 == i1) visibleFromP1Arr.push("x")
                    else if(!hasAsteroid2) visibleFromP1Arr.push(".")
                    else if(p2IsVisibleFromP1) visibleFromP1Arr.push("#")
                    else visibleFromP1Arr.push("o")
                    
                }
                
            if(i1==85) {
                printMap(visibleFromP1Arr, height, width)
                console.log("---", hasAsteroid1)
                console.log("---")
            }
            if(p1VisibleCount > mostVisible) {
                mostVisible = p1VisibleCount
                bestAsteroid = [x1,y1]
            }
        }
        asteroidCounts.push(p1VisibleCount)
    }

    printMap(asteroidCounts, width, height)
    return [mostVisible, bestAsteroid]
}

console.log(p3IsBetween([5,8],[1,8],[9,8]), distanceToRay(p1,p2,p3) < 0.001 && p3IsBetween(p1,p2,p3), "should be false")

function printMap(map, width, height) {
    const maxIndex = width*height
    for (index = 0; index < maxIndex; index += width) {
        myChunk = map.slice(index, index+width).join(" ");
        console.log(myChunk)
    }
}

function p3IsBetween(p1,p2,p3) {
    if(distanceBetweenPoints(p1,p2) > distanceBetweenPoints(p1, p3)) return true
    else return false
}
function distanceToRay(p1, p2, p3) {
    const xDelta = p2[0] - p1[0];
    const yDelta = p2[1] - p1[1];

    if ((xDelta == 0) && (yDelta == 0)) {
        console.log("p1 and p2 cannot be the same point");
    }

    const u = ((p3[0] - p1[0]) * xDelta + (p3[1] - p1[1]) * yDelta) / (xDelta * xDelta + yDelta * yDelta);
    
    //const closestPoint = [p1[0] + u * xDelta, p1[1] + u * yDelta];
     let closestPoint = [];
    if (u < 0) {
	    closestPoint = p1;
	} else if (u > 1) {
	    closestPoint = p2;
	} else {
	    closestPoint = [p1[0] + u * xDelta, p1[1] + u * yDelta];
	}
    return distanceBetweenPoints(closestPoint, p3);
}

function distanceBetweenPoints(p1, p2) {
    return (p2[0]-p1[0])**2+(p2[1]-p1[1])**2
}
