using System.Collections.Generic;
using System.Linq;

namespace adventofcode2021;

static internal class EnumerableLongExtensions
{
    public static List<long> Derivative(IEnumerable<long> numbers)
    {
        long previous = 0;
        var derivativeList = numbers.Select(current =>
        {
            var derivative = current - previous;
            previous = current;
            return derivative;
        }).ToList();
        derivativeList.RemoveAt(0);
        return derivativeList;
    }
}