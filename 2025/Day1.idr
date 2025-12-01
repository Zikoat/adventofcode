module Day1

import Data.String

puzzleInput: String
puzzleInput = """
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
"""

rotateDial: Int -> Int -> Int
rotateDial currentRotation rotateBy = mod (currentRotation+rotateBy) 100

rotateDialRight : Int -> Int -> Int
rotateDialRight currentRotation rotateBy = rotateDial currentRotation rotateBy

x : Int
x = 42

s : String
s = show x

rotateDial_example: rotateDial 11 8 = 19
rotateDial_example = Refl

rotateDial_example2: rotateDial 19 (-19) = 0
rotateDial_example2 = Refl

rotateDialRight_example : rotateDialRight 11 8 = 19
rotateDialRight_example = Refl

failing "Mismatch between: 18 and 19."
    rotateDialRight_badExample : rotateDialRight (11) (8) = 18
    rotateDialRight_badExample = Refl

rotateDialLeft: Int -> Int -> Int

rotateDialLeft currentRotation rotateBy = rotateDial currentRotation (-rotateBy)

rotateDialLeft_example : rotateDialLeft 19 19 = 0
rotateDialLeft_example = Refl

rotateDialLeft_wrap: rotateDialLeft 0 1 = 99
rotateDialLeft_wrap = Refl

data Direction = LeftDir | RightDir
giveDirPls : Direction
giveDirPls = LeftDir

-- parseString : String -> ("L"|"R", Int_0>99)

shit : strTail "hello" = "ello"
shit=Refl

shit2 : strIndex "hello" 0 = 'h'
shit2=Refl

export
isRight : ('L' == 'L') = True
isRight = Refl

stringToDirection : String -> Maybe (Direction)
stringToDirection char = 
    if char == "R"
        then Just(RightDir)
        else
            if char == "L"
                then Just(LeftDir)
                else Nothing

stringToDirection_example : stringToDirection "R" = Just(RightDir)
stringToDirection_example = Refl

stringToDirection_example2 : stringToDirection "O" = Nothing
stringToDirection_example2 = Refl

commandToDirection : String -> Maybe ((Direction, Int))
commandToDirection command = 
    let 
        direction = stringToDirection(substr 0 1 command)
        ticksStr = substr 1 (length command) command
    in 
        case (direction, parseInteger ticksStr) of 
            (Just dir, Just t) => Just (dir, t)
            _ => Nothing

commandToDirection_example : commandToDirection "R8" = Just(RightDir, 8)
commandToDirection_example=Refl
commandToDirection_example2 : commandToDirection "L99" = Just(LeftDir, 99)
commandToDirection_example2=Refl
commandToDirection_example3 : commandToDirection "O1" = Nothing
commandToDirection_example3=Refl

parseInteger_example : parseInteger "10" = Just 10
parseInteger_example = Refl



export
myFunc: IO ()
myFunc = putStr (substr 0 1 "hello")

-- putStrLn (unwords (lines (puzzleInput)))

-- ######
-- a dial pointing at 11
-- then rotated to the right 8 times
-- then it points to 19

-- ######

