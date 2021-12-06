
using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day06 : DayBase
{
    public override string TestInput => @"3,4,3,1,2";

    [Test]
    public override void TestPart1()
    {
        var fishes = ParseInput(TestInput);
        SimulateFishes(fishes, 18);

        Assert.That(fishes.ToString(","), Is.EqualTo("6,0,6,4,5,6,0,1,1,2,6,0,1,1,1,2,2,3,3,4,6,7,8,8,8,8"));
        Assert.That(fishes.Count, Is.EqualTo(26));
    }
    
    [Test]
    public void TestPart180Steps()
    {
        var fishes = ParseInput(TestInput);
        SimulateFishes(fishes, 80);

        Assert.That(fishes.Count, Is.EqualTo(5934));
    }

    private List<int> ParseInput(string input)
    {
        return input.Split(",").Select(n=>Convert.ToInt32(n)).ToList();
    }

    private static List<int> SimulateFishes(List<int> fishes, int steps)
    {
        for (int i = 0; i < steps; i++)
        {
            var fishesCount = fishes.Count;
            for (int j = 0; j < fishesCount; j++)
            {
                if (fishes[j] == 0)
                {
                    fishes[j] = 6;
                    fishes.Add(8);
                }
                else
                {
                    fishes[j]--;
                }
            }

            fishes.Print();
        }

        return fishes;
    }

    [Test]
    public override void RunPart1OnRealInput()
    {
        var endingFishes = SimulateFishes(ParseInput(GetInputForDay(this)), 80);

        Assert.That(endingFishes.Count, Is.EqualTo(350605));
    }

    [Test]
    public override void TestPart2()
    {
        var fishes = ParseInput(TestInput);
        SimulateFishes(fishes, 256);

        Assert.That(fishes.Count, Is.EqualTo(1));
    }

    [Test]
    public override void RunPart2OnRealInput()
    {
        GetInputForDay(this).Split(NewLine);
        throw new NotImplementedException();
    }
}
