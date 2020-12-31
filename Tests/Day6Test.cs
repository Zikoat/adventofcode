using System;
using adventofcode2020;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Day6Test
    {
        private const string TestInput = @"abc

a
b
c

ab
ac

a
a
a
a

b";

        [Test]
        public void Part1()
        {
            Assert.AreEqual(11, new Day6(TestInput).Part1());
            Assert.AreEqual(7283, new Day6(null).Part1());
        }

        [Test]
        public void Part2()
        {
            Assert.AreEqual(6, new Day6(TestInput).Part2());
            Assert.AreEqual(3520, new Day6(null).Part2());
        }
    }
}