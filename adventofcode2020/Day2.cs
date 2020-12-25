using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Tests
{
    public static class Day2
    {
        public static int Part1(string? input)
        {
            input ??= File.ReadAllText("../../../..//adventofcode2020/day2.txt");
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

    }
}