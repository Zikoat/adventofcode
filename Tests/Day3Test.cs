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
            Console.WriteLine(new Day3(TestInput).Part1());
        }
    }
}