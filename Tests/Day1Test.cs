using System;
using adventofcode2020;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Day1Test
    {
        [Test]
        public void Test()
        {
            var testinput = @"1721
            979
            366
            299
            675
            1456";
            Assert.AreEqual(514579, Day1.Part1(testinput));
            Console.WriteLine(Day1.Part1(null));

            Assert.AreEqual(241861950, Day1.Part2(testinput));
            Console.WriteLine(Day1.Part2(null));
        }
    }
}