using System;
using NUnit.Framework;

namespace Tests
{
    public class SumNumbersTests
    {
        [SetUp]
        public void Setup()
        {
            Console.WriteLine("shit");
        }

        [Test]
        public void Test1()
        {
            Assert.AreEqual(3, adventofcode2020.Program.SumNumbers(1, 2));
        }
    }
}