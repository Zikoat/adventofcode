using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day01 : DayBase
{
    public override string TestInput => @"199
200
208
210
200
207
240
269
260
263";

    [Test]
    public override void TestPart1()
    {
        var countOfIncreasingDepths = GetCountOfIncreasingDepths(TestInput, out var derivatives, out var depths);

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

    [Test]
    public override void RunPart1OnRealInput()
    {
        var realInput = GetInputForDay(this);

        var answer = GetCountOfIncreasingDepths(realInput, out _, out _);

        answer.Print();
        Assert.That(answer, Is.EqualTo(1154));
    }

    [Test]
    public override void TestPart2()
    {
        var answer = ThreeUnitSlidingWindow(TestInput, out var threeUnitSlidingWindow);

        Assert.That(threeUnitSlidingWindow.ToString(", "), Is.EqualTo("607, 618, 618, 617, 647, 716, 769, 792"));
        Assert.That(answer, Is.EqualTo(5));
    }

    [Test]
    public override void RunPart2OnRealInput()
    {
        var answer = ThreeUnitSlidingWindow(GetInputForDay(this), out _);

        Assert.That(answer, Is.EqualTo(1127));
    }

    private static int GetCountOfIncreasingDepths(string testInput, out List<long> derivatives, out List<long> depths)
    {
        depths = ParseDepths(testInput);
        derivatives = depths.Derivative();
        var countOfIncreasingDepths = derivatives.Count(d => d > 0);
        return countOfIncreasingDepths;
    }

    private static List<long> ParseDepths(string testInput)
    {
        return testInput.Split(NewLine).Select(number => Convert.ToInt64(number)).ToList();
    }

    private static int ThreeUnitSlidingWindow(string testInput, out List<long> threeUnitSlidingWindow)
    {
        var depths = ParseDepths(testInput);

        threeUnitSlidingWindow = CreateThreeUnitSlidingWindow(depths);

        var derivatives = threeUnitSlidingWindow.Derivative();
        var countOfIncreasingDepths = derivatives.Count(d => d > 0);
        return countOfIncreasingDepths;
    }

    private static List<long> CreateThreeUnitSlidingWindow(List<long> depths)
    {
        long windowFirst = 0;
        long windowSecond = 0;
        var threeUnitSlidingWindow = depths.Select(current =>
        {
            var sum = windowFirst + windowSecond + current;
            windowFirst = windowSecond;
            windowSecond = current;
            return sum;
        }).ToList();
        threeUnitSlidingWindow.RemoveRange(0, 2);
        return threeUnitSlidingWindow;
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
        var exception = Assert.Throws<ArgumentNullException>(() => EnumerableLongExtensions.Derivative(null!));
        Assert.That(exception?.Message, Is.EqualTo("Value cannot be null. (Parameter 'source')"));
    }
}