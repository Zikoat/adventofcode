using adventofcode2020;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Day8Test
    {
        private const string TestInput = @"";

        [Test]
        public void Part1()
        {
            Assert.AreEqual(-1, new Day8(TestInput).Part1());
            Assert.AreEqual(-1, new Day8(null).Part1());
        }

        [Test]
        public void Part2()
        {
            // Assert.AreEqual(-1, new Day8(TestInput).Part2());
            // Assert.AreEqual(-1, new Day8(null).Part2());
        }
    }
}