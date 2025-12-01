using System;
using System.Collections.Generic;
using System.Linq;

namespace adventofcode2020
{
    public class Day3 : Day
    {
        private IEnumerable<bool>[] map;
        public Day3(string? input) : base(input)
        {
            map = InputToMap();
        }

        public override long Part1()
        {
            var total = TraverseMapWithSlope(3, 1);
            return total;
        }

        private int TraverseMapWithSlope(int skipx, int skipy)
        {
            var xpos = 0;
            var height = map.Length;
            var width = map.First().Count();
            var total = 0;
            for (var i = 0; i < height; i+=skipy)
            {
                var line = map.ElementAt(i);
                total += Convert.ToInt32(line.ElementAt(xpos));
                xpos = (xpos + skipx) % width;
            }

            return total;
        }

        private IEnumerable<bool>[] InputToMap()
        {
            return Input
                .Split(new[] {"\r\n", "\r", "\n"}, StringSplitOptions.None)
                .Select(s => s.Select(c => c == '#'))
                .ToArray();
        }

        public override long Part2()
        {
            var slopes = new[]
            {
                ( 1, 1 ),
                ( 3, 1 ), 
                ( 5, 1 ),
                ( 7, 1 ),
                ( 1, 2 )
            };

            return AggregateSlopes(slopes, (x, y) => x*y);
        }

        private long AggregateSlopes((int, int)[] slopes, Func<long, long, long> aggregateFunction)
        {
            return slopes.Aggregate<(int, int), long>(1, (current, slope) => 
                aggregateFunction(current, TraverseMapWithSlope(slope.Item1, slope.Item2)));
        }
    }
}