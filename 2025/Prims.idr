module Prims

reverse2 : List a -> List a
reverse2 xs = revAcc [] xs where
    revAcc : List a -> List a -> List a
    revAcc acc [] = acc
    revAcc acc (x :: xs) = revAcc (x :: acc) xs

-- not possible, undefined name reverse2?
--reverse2 [1,2,3]

main : IO ()
-- not possible, cant convert list of numbers to string
-- main = putStrLn (reverse2 [1,2,3])


foo : Int -> Int
foo x = case isLt of
        Yes => x * 2
        No => x * 4
    where
        data MyLT = Yes | No
        isLt : MyLT
        isLT = if x < 20 then Yes else No

even : Nat -> Bool
even Z = True
even (S k) = odd k where
    odd : Nat -> Bool
    -- odd Z = False
    -- odd (S k) = even k

test : List Nat
test = [c (S 1), c Z, d (S Z)]
    where 
        c : Nat -> Nat
        c x = 42 + x
        
        d : Nat -> Nat
        d y = c (y + 1 + z y)
            where 
                z : Nat -> Nat
                z w = y + w

partial fromMaybe : Maybe a -> a
fromMaybe (Just x) = x



-- main = fromMaybe 1
--main = putStrLn ?greeting

even2 : Nat -> Bool
even2 Z = True
even2 (S k) = ?even_rhs

isSingleton : Bool -> Type
isSingleton True = Nat
isSingleton False = List Nat

mkSingle : (x : Bool) -> isSingleton x
mkSingle True = 0
mkSingle False = []


--main = mkSingle False

sum : (single : Bool) -> isSingleton single -> Nat
sum True x = x
sum False [] = 0
sum False (x :: xs) = x + sum False xs

--main = sum [1,2]
main = putStrLn "hello world"