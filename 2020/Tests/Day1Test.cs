using System;
using adventofcode2020;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Day1Test
    {
        private const string Testinput = @"1721
            979
            366
            299
            675
            1456";

        [Test]
        public void TestPart1()
        {
            Assert.AreEqual(514579, new Day1(Testinput).Part1());
            Console.WriteLine(new Day1(null).Part1());
        }

        [Test]
        public void TestPart2()
        {
            Assert.AreEqual(241861950, new Day1(Testinput).Part2());
            Console.WriteLine(new Day1(null).Part2());
        }
    }
}