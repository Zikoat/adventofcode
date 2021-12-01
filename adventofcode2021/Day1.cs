using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day1 : DayBase
{

    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Test1()
    {
        var testInput = @"199
200
208
210
200
207
240
269
260
263";

        var countOfIncreasingDepths = GetCountOfIncreasingDepths(testInput, out var derivatives, out var depths);

        ObjectExtensions.Print(depths);
        Assert.That(countOfIncreasingDepths, Is.EqualTo(7));
        Assert.That(derivatives.ToString(", "), Is.EqualTo("1, 8, 2, -10, 7, 33, 29, -9, 3"));
        Assert.That(derivatives.ToString(NewLine), Is.EqualTo(@"1
8
2
-10
7
33
29
-9
3"));
    }

    private static int GetCountOfIncreasingDepths(string testInput, out List<long> derivatives, out List<long> depths)
    {
        depths = testInput.Split(NewLine).Select(number => Convert.ToInt64(number)).ToList();
        derivatives = depths.Derivative();
        var countOfIncreasingDepths = derivatives.Count(d => d > 0);
        return countOfIncreasingDepths;
    }

    [Test]
    public void TestRunPart1OnRealInput()
    {
        var realInput = GetInputForDay(1);

        var answer = GetCountOfIncreasingDepths(realInput, out _, out _);
        answer.Print();
    }

    [TestCase(0, 1, 1)]
    [TestCase(1, 0, -1)]
    [TestCase(-1, 0, 1)]
    [TestCase(null, 1, 1)]
    [TestCase(0, (long)int.MaxValue + 1, 2147483648)]
    public void TestDerivative(long firstElement, long secondElement, long expectedValue)
    {
        var numbers = new[] { firstElement, secondElement };

        var derivative = numbers.Derivative();

        Assert.That(derivative, Is.EqualTo(new[] { expectedValue }));
    }

    [TestCase(1)]
    [TestCase(0)]
    [TestCase(null)]
    public void TestDerivativeSingleElement(long input)
    {
        IEnumerable<long> ints = new[] { input };

        var derivative = ints.Derivative();

        Assert.That(derivative, Is.EqualTo(Array.Empty<int>()));
    }

    [Test]
    public void TestDerivativeNull()
    {
        var exception = Assert.Throws<ArgumentNullException>(()=> EnumerableLongExtensions.Derivative(null!));
        Assert.That(exception?.Message, Is.EqualTo("Value cannot be null. (Parameter 'source')"));
    }
}


