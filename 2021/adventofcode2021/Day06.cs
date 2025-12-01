using NUnit.Framework;

namespace adventofcode2021;

public class Day06 : DayBase
{
    public override string TestInput => @"3,4,3,1,2";

    [Test]
    public override void TestPart1()
    {
        var fishesCount = SimulateFishes(TestInput, 18);

        Assert.That(fishesCount, Is.EqualTo(26));
    }

    [Test]
    public void TestPart180Steps()
    {
        var fishesCount = SimulateFishes(TestInput, 80);

        Assert.That(fishesCount, Is.EqualTo(5934));
    }

    private static List<long> ParseInput(string input)
    {
        return input.Split(",").Select(n => Convert.ToInt64(n)).ToList();
    }

    private static long SimulateFishes(string fishesString, long steps)
    {
        return SimulateFishes(ParseInput(fishesString), steps);
    }

    private static long SimulateFishes(List<long> fishes, long steps)
    {
        var fishesGroups = new long[9];

        for (long i = 0; i < 8; i++)
        {
            fishesGroups[i] = fishes.Count(fishAge => fishAge == i);
        }

        for (long i = 0; i < steps; i++)
        {
            var nextGroup = new long[9];

            for (long j = 0; j <= 7; j++)
            {
                nextGroup[j] = fishesGroups[j + 1];
            }

            nextGroup[6] += fishesGroups[0];
            nextGroup[8] += fishesGroups[0];

            fishesGroups = nextGroup;
        }

        return fishesGroups.Sum();
    }

    [Test]
    public override void RunPart1OnRealInput()
    {
        var endingFishes = SimulateFishes(GetInputForDay(this), 80);

        Assert.That(endingFishes, Is.EqualTo(350605));
    }

    [Test]
    public override void TestPart2()
    {
        var fishesCount = SimulateFishes(TestInput, 256);

        Assert.That(fishesCount, Is.EqualTo(26984457539));
    }

    [Test]
    public override void RunPart2OnRealInput()
    {
        var fishesCount = SimulateFishes(GetInputForDay(this), 256);
        Assert.That(fishesCount, Is.EqualTo(1592778185024));
    }
}