using System;
using adventofcode2020;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Day3Test
    {
        private const string TestInput = @"..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#";

        [Test]
        public void Part1()
        {
            Assert.AreEqual(7, new Day3(TestInput).Part1());
            Assert.AreEqual(247, new Day3(null).Part1());
        }

        [Test]
        public void Part2()
        {
            Assert.AreEqual(336, new Day3(TestInput).Part2());
            Assert.AreEqual(2983070376, new Day3(null).Part2());
        }
    }
}