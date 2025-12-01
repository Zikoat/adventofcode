using System;
using System.Linq;
using adventofcode2020;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Day2Test
    {
        private const string TestInput = @"1-3 a: abcde
                1-3 b: cdefg
                2-9 c: ccccccccc";
        
        [Test]
        public void TestPart1()
        {
            Console.WriteLine(new Day2(TestInput).Input);
            Assert.AreEqual(2, new Day2(TestInput).Part1());
            var answer = new Day2(null).Part1();
            Assert.Greater(answer, 231);
            Console.WriteLine(answer);
        }

        [Test]
        public void TestStringToTuple()
        {
            var generatedOutput = new Day2("1-3 a: abcde").GetPasswordTuples().First();
            var expected = (1, 3, 'a', "abcde");
            Assert.AreEqual(expected, generatedOutput);
        }

        [Test]
        public void TestStringToTupleLeadingAndTrailingSpaces()
        {
            var generatedOutput = new Day2(@"  1-3 b: cdefg").GetPasswordTuples().First();
            Assert.AreEqual((1, 3, 'b', "cdefg"), generatedOutput);
        }

        [Test]
        public void TestStringToTupleMultipleLines()
        {
            var passwords = new Day2(TestInput).GetPasswordTuples();
            Assert.AreEqual(3, passwords.Count());
        }

        [Test]
        public void TestIsValidTrue()
        {
            Assert.IsTrue(Day2.IsValidBetween((1, 3, 'a', "abcde")));
            Assert.AreEqual(
                new Day2("1-3 a: abcde")
                    .GetPasswordTuples()
                    .Select(Day2.IsValidBetween)
                    .First(),
                Day2.IsValidBetween((1, 3, 'a', "abcde"))
                );
        }

        [Test]
        public void IsValidFalse()
        {
            Assert.IsFalse(Day2.IsValidBetween((1, 3, 'b', "cdefg")));
        }

        [Test]
        public void BoundsAbove10()
        {
            var generatedOutput = new Day2("1-10 a: aabcde").GetPasswordTuples().First();
            Assert.AreEqual((1, 10, 'a', "aabcde"), generatedOutput);
        }

        [Test]
        public void IsValidAtPosition()
        {
            var passwordTuples = new Day2(TestInput).GetPasswordTuples();
            Assert.AreEqual(new[] {true, false, false}, passwordTuples.Select(Day2.IsValidAtPosition));

            Console.WriteLine(new Day2(null).Part2());
        }

        [Test]
        public void IsValidAtPositionOutOfBounds()
        {
            var passwordTuple = new Day2("2-9 c: ccccccccc").GetPasswordTuples().First();
            Assert.IsFalse(Day2.IsValidAtPosition(passwordTuple));
        }
    }
}