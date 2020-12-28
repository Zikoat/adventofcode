using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace adventofcode2020
{
    public class Day1 : Day
    {
        public Day1(string? input) : base(input)
        {
        }
        
        public override int Part1()
        {
            IEnumerable<int> lines = Input.Split("\n").Select(val=>Int32.Parse(val.Trim()));

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

        public override int Part2()
        {
            IEnumerable<int> lines = Input.Split("\n").Select(val=>Int32.Parse(val.Trim()));

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