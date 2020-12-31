using System;
using adventofcode2020;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Day5Test
    {
        private const string TestInput = @"BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL";

        [Test]
        public void Part1()
        {
            Assert.AreEqual(567, Day5.GetSeatId("BFFFBBFRRR"));
            Assert.AreEqual(119, Day5.GetSeatId("FFFBBBFRRR"));
            Assert.AreEqual(820, Day5.GetSeatId("BBFFBBFRLL"));
            
            Assert.AreEqual(820, new Day5(TestInput).Part1());
            Assert.AreEqual(915, new Day5(null).Part1());
        }

        [Test]
        public void Part2()
        {
            Assert.AreEqual(699,new Day5(null).Part2());
        }
    }
}