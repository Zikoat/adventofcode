const min = 246515;
const max = 739105;

validNumbersInRange(min, max)

function validNumbersInRange(min, max) {
    let totalAmount = 0;
    for (let i = min; i <= max; i++) {
        if(has2Adjacent(i) && isIncreasing(i)) totalAmount++;
    }
    console.log(totalAmount);
}

function has2Adjacent(number) {
    let digits = number.toString().split("").map(el=>parseInt(el));
    for (let i = 1; i < digits.length; i++) {
        if (digits[i] == digits[i-1] && 
            digits[i] != digits[i-2] &&
            digits[i] != digits[i+1])
            return true
    }
}

function isIncreasing(number) {
    let prevDigit = "0";
    for (const digit of number.toString().split("")) {
        if(parseInt(digit) < parseInt(prevDigit)) return false;
        prevDigit = digit;
    }
    return true;
} 