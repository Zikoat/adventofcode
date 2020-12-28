using System;
using System.Linq;
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

    [TestFixture]
    public class Day2Test // todo move to own file
    {
        private const string TestInput = @"1-3 a: abcde
                1-3 b: cdefg
                2-9 c: ccccccccc";

        private readonly Day2 testDay2 = new Day2(TestInput);
        private readonly Day2 fullDay2 = new Day2(null);

        [Test]
        public void TestPart1()
        {
            Console.WriteLine(testDay2.input);
            Assert.AreEqual(2, testDay2.Part1());
            var answer = fullDay2.Part1();
            Assert.Greater(answer, 231);
            Console.WriteLine(answer);
        }

        [Test]
        public void TestStringToTuple()
        {
            var generatedOutput = Day2.StringToPasswordTuples("1-3 a: abcde").First();
            var expected = (1, 3, 'a', "abcde");
            Assert.AreEqual(expected, generatedOutput);
        }

        [Test]
        public void testStringToTupleLeadingAndTrailingSpaces()
        {
            var generatedOutput = Day2.StringToPasswordTuples(@"  1-3 b: cdefg").First();
            Assert.AreEqual((1, 3, 'b', "cdefg"), generatedOutput);
        }

        [Test]
        public void TestStringToTupleMultipleLines()
        {
            var passwords = Day2.StringToPasswordTuples(TestInput);
            Assert.AreEqual(3, passwords.Count());
        }

        [Test]
        public void TestIsValidTrue()
        {
            Assert.IsTrue(Day2.IsValidBetween((1, 3, 'a', "abcde")));
        }

        [Test]
        public void IsValidFalse()
        {
            Assert.IsFalse(Day2.IsValidBetween((1, 3, 'b', "cdefg")));
        }

        [Test]
        public void BoundsAbove10()
        {
            var generatedOutput = Day2.StringToPasswordTuples("1-10 a: aabcde").First();
            Assert.AreEqual((1, 10, 'a', "aabcde"), generatedOutput);
        }

        [Test]
        public void IsValidAtPosition()
        {
            var passwordTuples = Day2.StringToPasswordTuples(TestInput);
            Assert.AreEqual(new[] {true, false, false}, passwordTuples.Select(Day2.IsValidAtPosition));

            Console.WriteLine(fullDay2.Part2());
        }

        [Test]
        public void IsValidAtPositionOutOfBounds()
        {
            var passwordTuple = Day2.StringToPasswordTuples("2-9 c: ccccccccc").First();
            Assert.IsFalse(Day2.IsValidAtPosition(passwordTuple));
        }
    }
}