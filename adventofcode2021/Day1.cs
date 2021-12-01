using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day1Tests
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

        var depths = testInput.Split(Environment.NewLine).Select(number => Convert.ToInt64(number)).ToList();
        
        depths.Print();
        
        var derivatives = depths.Derivative();
        var answer1 = derivatives.Count(d => d > 0);
        var answer = answer1;

        Assert.That(answer, Is.EqualTo(7));
        
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


