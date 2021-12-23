class IntCode {

    constructor(input, memory) {
        this.input = input;
        this.safeMemory = memory;
        this.memory = this.safeMemory.split(",").map(el=>parseInt(el));

        this.parameterSizes = {
            1:3,
            2:3,
            3:1,
            4:1,
            5:2,
            6:2,
            7:3,
            8:3,
            99:1
        }
    }

    reset() {
        this.memory = this.safeMemory.split(",").map(el=>parseInt(el));
        return this;
    }

    run() {
        let pointer = 0;
        let parameterAmount = 1;
        while (true) {

            const instruction = this.getInstruction(pointer);
            parameterAmount = instruction.parameterAmount
            let jump;
    
            if(debug) {
                console.log()
                //console.log("state:", this.memory)
                console.log("doing opcode:",instruction.opcode)
                console.log("with parameters:",instruction.parameters)
            }
            
            switch (instruction.opcode) {
                case 1:
                    this.add(instruction.modeApplied[0], instruction.modeApplied[1], instruction.parameters[5]);
                    break;
    
                case 2:
                    this.multiply(instruction.modeApplied[0], instruction.modeApplied[1], instruction.parameters[5]);
                    break;
    
                case 3:
                    this.save(this.input, instruction.parameters[1])
                    break;
    
                case 4: 
                    this.output(instruction.modeApplied[0]);
                    break;
    
                case 5: 
                    jump = this.jumpIfTrue(instruction.modeApplied[0], instruction.modeApplied[1]);
                    break;
    
                case 6: 
                    jump = this.jumpIfFalse(instruction.modeApplied[0], instruction.modeApplied[1]);
                    break;
    
                case 7: 
                    this.lessThan(instruction.modeApplied[0], instruction.modeApplied[1], instruction.parameters[5]);
                    break;
    
                case 8: 
                    this.equals(instruction.modeApplied[0], instruction.modeApplied[1], instruction.parameters[5]);
                    break;
    
                case 99:
                    return this;
    
                default:
                    console.log("error: cant read opcode", instruction.opcode);
                    this.printMemory(memory);
                    return this;
            }
            if(jump == undefined) {
                pointer += parameterAmount + 1
            } else {
                pointer = jump;
                if(debug) console.log("jumping to", jump);
            }
        }
    }

    getInstruction(index) {
        let instruction = {};
        instruction.opcode = this.memory[index]%100
        instruction.parameterAmount = this.parameterSizes[instruction.opcode]
        // a parameter has 2 entries: the parameter and the mode
        let modes = this.memory[index]
            .toString()
            .slice(0, -2)
            .split("")
            .reverse()
            .map(el=>parseInt(el));

        instruction.parameters = [];
        instruction.modeApplied = [];
        for (let parameterNumber = 0; parameterNumber < instruction.parameterAmount; parameterNumber++) {
            
            let mode = modes[parameterNumber];
            if (mode == undefined) mode = 0;

            const parameterAddress = index+1+parameterNumber;
            const parameterValue = this.memory[parameterAddress];

            instruction.parameters.push(mode)
            instruction.parameters.push(parameterValue);

            if (mode == 0) {
                instruction.modeApplied.push(this.memory[parameterValue]);
            } else if (mode == 1) {
                instruction.modeApplied.push(parameterValue);
            } else {
                console.log("couldn't read mode:", mode)
            }
        }

        return instruction;
    }

    add(par1, par2, storageAddress) {
        this.memory[storageAddress] = par1 + par2;
        if (debug) console.log("saving", par1 + par2, "at", storageAddress)
    }

    multiply(par1, par2, storageAddress) {
        this.memory[storageAddress] = par1 * par2;
        if (debug) console.log("saving", par1 + par2, "at", storageAddress)
    }

    save(input, storageAddress) {
        this.memory[storageAddress] = input;
        if (debug) console.log("saving", input, "at", storageAddress)
    }

    output(par1) {
        console.log(par1);
        if (debug) console.log("printing", par1)
    }

    jumpIfTrue(par1, jumpTo) {
        if (par1) return jumpTo;
    }

    jumpIfFalse(par1, jumpTo) {
        if (!par1) return jumpTo;
    }

    lessThan(par1, par2, storageAddress) {
        this.memory[storageAddress] = par1 < par2 ? 1 : 0;
        if(debug) console.log("storing", par1 < par2 ? 1 : 0, "into", storageAddress );
    }

    equals(par1, par2, storageAddress) {
        this.memory[storageAddress] = par1 === par2 ? 1 : 0;
    }    

    replace(noun, verb) {
        this.memory[1] = noun;
        this.memory[2] = verb;
        return this;
    }

    printMemory() {
        console.log(this.memory)
    }
}

let debug = false;
let test = true;

if(test) {
    console.log("\n--- cat test:")
    let catTest = "3,0,4,0,99"
    let catTestInput = "5"
    console.log("assert:", catTestInput)
    new IntCode(catTestInput, catTest).run();
    
    
    console.log("\n--- immediate mode test:")
    let immediateModeTest = "1002,4,3,4,33";
    new IntCode(0, immediateModeTest).run();
 
    console.log("\n--- part 2 simple test 1:")
    let p2ts1 = "3,9,8,9,10,9,4,9,99,-1,8";
    new IntCode(8, p2ts1).run();
    new IntCode(9, p2ts1).run();

    console.log("\n--- part 2 simple test 2:")
    let p2ts2 = "3,9,7,9,10,9,4,9,99,-1,8";
    new IntCode(5, p2ts2).run();
    new IntCode(9, p2ts2).run();

    console.log("\n--- part 2 simple test 3:")
    let p2ts3 = "3,3,1108,-1,8,3,4,3,99";
    new IntCode(8, p2ts3).run();
    new IntCode(7, p2ts3).run();

    console.log("\n--- part 2 simple test 4:")
    let p2ts4 = "3,3,1107,-1,8,3,4,3,99";
    new IntCode(4, p2ts4).run();
    new IntCode(10, p2ts4).run();

    console.log("\n--- part 2 position mode test: ")
    let p2t1 = "3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9";
    new IntCode(3, p2t1).run();
    new IntCode(0, p2t1).run();
    
    console.log("\n--- part 2 immediate mode test:")
    let p2t2 = "3,3,1105,-1,9,1101,0,0,12,4,12,99,1";
    new IntCode(2, p2t2).run();
    new IntCode(0, p2t2).run();

    console.log("\n--- part 2 larger test:")
    let p2l = "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99";
    new IntCode(7, p2l).run();
    new IntCode(8, p2l).run();
    new IntCode(9, p2l).run();
}

console.log("\n--- AC test:")
let testProgram = "3,225,1,225,6,6,1100,1,238,225,104,0,1101,69,55,225,1001,144,76,224,101,-139,224,224,4,224,1002,223,8,223,1001,224,3,224,1,223,224,223,1102,60,49,225,1102,51,78,225,1101,82,33,224,1001,224,-115,224,4,224,1002,223,8,223,1001,224,3,224,1,224,223,223,1102,69,5,225,2,39,13,224,1001,224,-4140,224,4,224,102,8,223,223,101,2,224,224,1,224,223,223,101,42,44,224,101,-120,224,224,4,224,102,8,223,223,101,3,224,224,1,223,224,223,1102,68,49,224,101,-3332,224,224,4,224,1002,223,8,223,1001,224,4,224,1,224,223,223,1101,50,27,225,1102,5,63,225,1002,139,75,224,1001,224,-3750,224,4,224,1002,223,8,223,1001,224,3,224,1,223,224,223,102,79,213,224,1001,224,-2844,224,4,224,102,8,223,223,1001,224,4,224,1,223,224,223,1,217,69,224,1001,224,-95,224,4,224,102,8,223,223,1001,224,5,224,1,223,224,223,1102,36,37,225,1101,26,16,225,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,1107,677,677,224,102,2,223,223,1006,224,329,1001,223,1,223,1108,677,677,224,1002,223,2,223,1006,224,344,1001,223,1,223,107,226,226,224,1002,223,2,223,1006,224,359,101,1,223,223,1008,226,226,224,102,2,223,223,1005,224,374,1001,223,1,223,1107,226,677,224,1002,223,2,223,1006,224,389,1001,223,1,223,1008,677,226,224,1002,223,2,223,1005,224,404,1001,223,1,223,7,677,226,224,102,2,223,223,1005,224,419,1001,223,1,223,1008,677,677,224,1002,223,2,223,1006,224,434,1001,223,1,223,108,226,226,224,102,2,223,223,1006,224,449,1001,223,1,223,108,677,677,224,102,2,223,223,1006,224,464,1001,223,1,223,107,226,677,224,1002,223,2,223,1005,224,479,101,1,223,223,1108,226,677,224,1002,223,2,223,1006,224,494,1001,223,1,223,107,677,677,224,1002,223,2,223,1006,224,509,101,1,223,223,7,677,677,224,102,2,223,223,1006,224,524,1001,223,1,223,1007,226,677,224,1002,223,2,223,1005,224,539,1001,223,1,223,8,226,677,224,1002,223,2,223,1005,224,554,101,1,223,223,8,677,677,224,102,2,223,223,1005,224,569,101,1,223,223,7,226,677,224,102,2,223,223,1006,224,584,1001,223,1,223,1007,226,226,224,102,2,223,223,1006,224,599,1001,223,1,223,1107,677,226,224,1002,223,2,223,1006,224,614,1001,223,1,223,1108,677,226,224,1002,223,2,223,1005,224,629,1001,223,1,223,1007,677,677,224,102,2,223,223,1006,224,644,1001,223,1,223,108,226,677,224,102,2,223,223,1005,224,659,101,1,223,223,8,677,226,224,1002,223,2,223,1006,224,674,1001,223,1,223,4,223,99,226";
let acTestID = 1;
let radiatorTestID = 5;
new IntCode(acTestID, testProgram).run();

console.log("\n--- radiator test:")
new IntCode(radiatorTestID, testProgram).run();