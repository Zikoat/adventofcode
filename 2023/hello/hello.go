package main

import (
	"aoc2023/greetings"
	"fmt"
	"log"

	"rsc.io/quote"
)

func main() {

	log.SetPrefix("greetings: ")
	log.SetFlags(0)

	message, err := greetings.Hello("Sigurd")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(message)

	fmt.Println(quote.Go())

}
