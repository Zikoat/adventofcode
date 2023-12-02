package aoc2023

import (
	"os"
	"regexp"
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
		// fmt.Printf("first: %s, last: %s, combined: %s", first, last, combined)
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

		// fmt.Printf("newLine: %s", newLine)
		newInput += newLine + "\n"

	}

	// fmt.Printf("input: %s", newInput)
	total := day1(strings.Trim(newInput, "\n"))

	return total
}

func SkipTestDay1Part2Input(t *testing.T) {
	input, err := os.ReadFile("./d1in.txt")
	check(err)
	total := day1p2(string(input))
	if total <= 56001 {
		t.Fatalf(`Day1Input = %d, want more than 56001`, total)
	}
}

func skipTestDay1Part2AdditionalExamplesFromReddit(t *testing.T) {
	input := `threeight`
	total := day1p2(input)
	if total != 38 {
		t.Fatalf(`Day1Example = %d, want 38`, total)
	}

}

func TestDay2Part1Input(t *testing.T) {

	inputFile, err := os.ReadFile("./d2in.txt")
	check(err)
	input := string(inputFile)

	sumOfValidGames := d2p1(input)

	// less tnan 2200
	if sumOfValidGames != 2105 {
		t.Fatalf(`Day2Example = %d, want 8`, sumOfValidGames)
	}
}

func TestDay2Part1Example(t *testing.T) {

	input := `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

	sumOfValidGames := d2p1(input)

	// should be 8
	if sumOfValidGames != 8 {
		t.Fatalf(`Day2Example = %d, want 8`, sumOfValidGames)
	}

}

func d2parse(input string) [][][3]int {
	lines := strings.Split(input, "\n")

	games := [][][3]int{}

	for _, line := range lines {
		game := [][3]int{}

		lineRegex := regexp.MustCompile(`^Game (\d+): (.*)$`)

		lineMatches := lineRegex.FindStringSubmatch(line)
		if len(lineMatches) != 3 {
			errorMessage := "line did not match regex, " + line + ", " + lineMatches[0] + ", " + lineMatches[1] + ", " + lineMatches[2]
			panic(errorMessage)
		}
		// gameNumber, err := strconv.Atoi(lineMatches[1])
		// check(err)
		gameString := lineMatches[2]
		bags := strings.Split(gameString, "; ")
		for _, bag := range bags {

			// fmt.Println("'" + bag + "'")

			colors := strings.Split(bag, ", ")

			red := 0
			green := 0
			blue := 0

			for _, color := range colors {
				colorRegex := regexp.MustCompile(`^(\d+) (.*)$`)
				colorMatches := colorRegex.FindStringSubmatch(color)
				if len(colorMatches) != 3 {
					panic("color did not match regex " + color + ", " + colorMatches[0] + ", " + colorMatches[1] + ", " + colorMatches[2])
				}
				colorNumber, err := strconv.Atoi(colorMatches[1])
				check(err)

				colorName := strings.Trim(colorMatches[2], "\r\n")
				// fmt.Printf("gameNumber: %d, colorNumber: %d, colorName: '%s'", gameNumber, colorNumber, colorMatches[2])

				if colorName == "red" {
					red = colorNumber
				} else if colorName == "green" {
					green = colorNumber
				} else if colorName == "blue" {
					blue = colorNumber
				} else {
					panic("colorName not recognized: '" + colorName + "'")
				}
			}
			bagInGames := [3]int{red, green, blue}

			game = append(game, bagInGames)
		}
		games = append(games, game)
	}
	return games
}

func d2p1(input string) int {

	// fmt.Sprint(games)
	games := d2parse(input)

	maxRed := 12
	maxGreen := 13
	maxBlue := 14

	sumOfValidGames := 0

	for i, game := range games {

		gameValid := true
		for _, bag := range game {
			if bag[0] > maxRed || bag[1] > maxGreen || bag[2] > maxBlue {
				gameValid = false
			}
		}
		if gameValid {
			sumOfValidGames += i + 1
		}
		// fmt.Println(i+1, gameValid, game, sumOfValidGames)
	}
	return sumOfValidGames
}
