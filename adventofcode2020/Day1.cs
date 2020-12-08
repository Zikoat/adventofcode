using System;
using System.IO;

namespace adventofcode2020
{
    public class Day1
    {
        public static int Part1(string? input)
        {
            input = input.GetValueOrDefault(File.ReadAllText("./day1.txt"))
            
            Console.WriteLine(input);
        }
    }
}