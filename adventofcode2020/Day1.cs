using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace adventofcode2020
{
    public static class Day1
    {
        public static int Part1(string? input)
        {
            input ??= File.ReadAllText("../../../..//adventofcode2020/day1.txt");
            IEnumerable<int> lines = input.Split("\n").Select(val=>Int32.Parse(val.Trim()));

            var output = 0;
            foreach (var line1 in lines)
            {
                foreach (var line2 in lines)
                {
                    if (line1 + line2 == 2020)
                    {
                        output = line1 * line2;
                    }
                }

            }
            
            return output;
        }

        public static int Part2(string? input)
        {
            input ??= File.ReadAllText("../../../..//adventofcode2020/day1.txt");
            IEnumerable<int> lines = input.Split("\n").Select(val=>Int32.Parse(val.Trim()));

            var output = 0;
            foreach (var line1 in lines)
            {
                foreach (var line2 in lines)
                {
                    foreach (var line3 in lines)
                    {
                        if (line1 + line2 + line3 == 2020)
                        {
                            output = line1 * line2 * line3;
                        }
                    }
                }
            }
            
            return output;

        }
    }
}