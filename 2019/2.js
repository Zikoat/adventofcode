let input = "1,12,2,3,1,1,2,3,1,3,4,3,1,5,0,3,2,6,1,19,1,5,19,23,2,9,23,27,1,6,27,31,1,31,9,35,2,35,10,39,1,5,39,43,2,43,9,47,1,5,47,51,1,51,5,55,1,55,9,59,2,59,13,63,1,63,9,67,1,9,67,71,2,71,10,75,1,75,6,79,2,10,79,83,1,5,83,87,2,87,10,91,1,91,5,95,1,6,95,99,2,99,13,103,1,103,6,107,1,107,5,111,2,6,111,115,1,115,13,119,1,119,2,123,1,5,123,0,99,2,0,14,0"
/*
runProgram("1,9,10,3,2,3,11,0,99,30,40,50");
console.log("3500,9,10,70,2,3,11,0,99,30,40,50")
runProgram("1,0,0,0,99");
console.log("2,0,0,0,99")
runProgram("2,3,0,3,99");
console.log("2,3,0,6,99")
runProgram("2,4,4,5,99,0");
console.log("2,4,4,5,99,9801")
runProgram("1,1,1,4,99,5,6,0,99");
console.log("30,1,1,4,2,5,6,0,99")
*/
for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        replaceAndRun(input, i, j)
    }
}
function replaceAndRun(memory, noun, verb) {
    memory = memory.split(",").map(el=>parseInt(el));
    memory[1] = noun;
    memory[2] = verb;
    let output = runProgram(memory);
    if(output == 19690720) console.log(100*noun + verb);
}

function runProgram(memory) {
    for (let i = 0; i < memory.length; i += 4) {
        const opcode = memory[i]
        const par1 = memory[i+1]
        const par2 = memory[i+2]
        const par3 = memory[i+3]
        
        switch (opcode) {
            case 1:
                memory[par3] = memory[par1] + memory[par2];
                break;
            case 2:
                memory[par3] = memory[par1] * memory[par2];
                break;
            case 99:
                // console.log('\nops:', i/4);
                // console.log("\nstop\n");
                return memory[0];
            default:
                console.log('ops:', i/4);
                console.log("\nerror", opcode);
                print(memory);
                return -1;
        }
    }
}

function print(array) {
    let string = "";
    for (let i = 0; i < array.length; i++) {
        string += array[i] + " ";
        if(i%4==3) {
            console.log(string);
            string = "";
        }
    }
}
function printCompact(array) {
    console.log(array.join());
}