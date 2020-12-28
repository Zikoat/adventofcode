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

        [Test]
        public void TestPart1()
        {
            Assert.AreEqual(2, Day2.Part1(TestInput));
            var answer = Day2.Part1(null);
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

            Console.WriteLine(Day2.Part2(null));
        }

        [Test]
        public void IsValidAtPositionOutOfBounds()
        {
            var passwordTuple = Day2.StringToPasswordTuples("2-9 c: ccccccccc").First();
            Assert.IsFalse(Day2.IsValidAtPosition(passwordTuple));
        }
    }
}