using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Day1Test
    {
        [Test]
        public void Test1()
        {
            Assert.AreEqual(3, adventofcode2020.Program.SumNumbers(1, 2));
        }
    }
}