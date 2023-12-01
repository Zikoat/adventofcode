package aoc2023

import (
	"log"
	"os"
	"strconv"
	"strings"
	"testing"
)

func day1(input string) int {
	total := 0
	// split string by newline
	splitLines := strings.Split(input, "\n")
	// loop over each line
	for _, line := range splitLines {
		// split line every character
		splitChars := strings.Split(line, "")
		// find index of first and last number
		var first string
		var last string
		for _, char := range splitChars {
			myNumber, err := strconv.Atoi(char)

			if err == nil {

				// if first is not set, and number is not 0, set first
				last = char
				if first == "" && myNumber != 0 {

					first = char

				}
			}

		}

		combined := first + last
		combinedInt, err := strconv.Atoi(combined)
		// log.Printf("first: %s, last: %s, combined: %s", first, last, combined)
		check(err)
		total += combinedInt
	}

	return total
}

func TestDay1Part1Example(t *testing.T) {
	input := `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`
	total := day1(input)
	if total != 142 {
		t.Fatalf(`Day1Example = %d, want 77`, total)
	}
}

func TestDay1Part1Input(t *testing.T) {
	// read input from ./d1in.txt as string
	input, err := os.ReadFile("./d1in.txt")
	check(err)
	total := day1(string(input))
	if total != 56506 {
		t.Fatalf(`Day1Input = %d, want 56506`, total)
	}

}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func TestDay1Part2Example(t *testing.T) {
	input := `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

	total := day1p2(input)

	if total != 281 {
		t.Fatalf(`Day1Example = %d, want 280`, total)
	}

}

func day1p2(input string) int {
	newInput := ""

	splitLines := strings.Split(input, "\n")
	for _, line := range splitLines {

		newLine := line
		i := 0
		// while i < len(newLine)
		for i < len(newLine) {
			// if position i in newLine is "one", replace it with 1
			number := "zero"
			numberNumber := 0
			if i+len(number) <= len(newLine) && newLine[i:i+len(number)] == number {
				newLine = newLine[:i] + strconv.Itoa(numberNumber) + newLine[i+len(number):]
			}

			number = "one"
			numberNumber++
			if i+len(number) <= len(newLine) && newLine[i:i+len(number)] == number {
				newLine = newLine[:i] + strconv.Itoa(numberNumber) + newLine[i+len(number):]
			}
			number = "two"
			numberNumber++

			if i+len(number) <= len(newLine) && newLine[i:i+len(number)] == number {
				newLine = newLine[:i] + strconv.Itoa(numberNumber) + newLine[i+len(number):]
			}
			number = "three"
			numberNumber++

			if i+len(number) <= len(newLine) && newLine[i:i+len(number)] == number {
				newLine = newLine[:i] + strconv.Itoa(numberNumber) + newLine[i+len(number):]
			}
			number = "four"
			numberNumber++

			if i+len(number) <= len(newLine) && newLine[i:i+len(number)] == number {
				newLine = newLine[:i] + strconv.Itoa(numberNumber) + newLine[i+len(number):]
			}
			number = "five"
			numberNumber++

			if i+len(number) <= len(newLine) && newLine[i:i+len(number)] == number {
				newLine = newLine[:i] + strconv.Itoa(numberNumber) + newLine[i+len(number):]
			}
			number = "six"
			numberNumber++

			if i+len(number) <= len(newLine) && newLine[i:i+len(number)] == number {
				newLine = newLine[:i] + strconv.Itoa(numberNumber) + newLine[i+len(number):]
			}
			number = "seven"
			numberNumber++

			if i+len(number) <= len(newLine) && newLine[i:i+len(number)] == number {
				newLine = newLine[:i] + strconv.Itoa(numberNumber) + newLine[i+len(number):]
			}
			number = "eight"
			numberNumber++

			if i+len(number) <= len(newLine) && newLine[i:i+len(number)] == number {
				newLine = newLine[:i] + strconv.Itoa(numberNumber) + newLine[i+len(number):]
			}
			number = "nine"
			numberNumber++

			if i+len(number) <= len(newLine) && newLine[i:i+len(number)] == number {
				newLine = newLine[:i] + strconv.Itoa(numberNumber) + newLine[i+len(number):]
			}

			i++
		}

		// log.Printf("newLine: %s", newLine)
		newInput += newLine + "\n"

	}

	// log.Printf("input: %s", newInput)
	total := day1(strings.Trim(newInput, "\n"))

	return total
}

func TestDay1Part2Input(t *testing.T) {
	input, err := os.ReadFile("./d1in.txt")
	check(err)
	total := day1p2(string(input))
	if total <= 56001 {
		t.Fatalf(`Day1Input = %d, want more than 56001`, total)
	}
}

func TestDay1Part2AdditionalExamplesFromReddit(t *testing.T) {
	input := `one
two
three
four
five
six
seven
eight
nine
twone
