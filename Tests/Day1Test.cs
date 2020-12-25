using System;
using adventofcode2020;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Day1Test
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void Test()
        {
            string testinput = @"1721
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
        [Test]
        public void Test2()
        {
            string testinput = @"1-3 a: abcde
                1-3 b: cdefg
                2-9 c: ccccccccc";
            
            Assert.AreEqual(514579, Day2.Part1(testinput));
            Console.WriteLine(Day2.Part1(null));
            
            Assert.AreEqual(241861950, Day2.Part2(testinput));
            Console.WriteLine(Day2.Part2(null));
        }

    }

    [TestFixture]
    public class Day2Test
    {
    }
}