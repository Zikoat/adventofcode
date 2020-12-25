using System;
using System.IO;

namespace adventofcode2020
{
    public class Day1
    {
        public static void Part1(string? input)
        {
            input ??= File.ReadAllText("./day1.txt");
            Console.WriteLine(input);
        }
    }
}