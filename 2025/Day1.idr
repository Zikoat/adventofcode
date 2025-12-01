module Day1

foo : String
foo = "Welcome to day 1 of Advent of Code 2025 with Idris 2"

export
myFunc: IO ()
myFunc = putStrLn foo