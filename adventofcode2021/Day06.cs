
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
        var fishesCount = SimulateFishes(fishes, 18);
        
        Assert.That(fishesCount, Is.EqualTo(26));
    }
    
    [Test]
    public void TestPart180Steps()
    {
        var fishes = ParseInput(TestInput);
        var fishesCount = SimulateFishes(fishes, 80);

        Assert.That(fishesCount, Is.EqualTo(5934));
    }

    private List<int> ParseInput(string input)
    {
        return input.Split(",").Select(n=>Convert.ToInt32(n)).ToList();
    }

    private static int SimulateFishes(List<int> fishes, int steps)
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

        return fishes.Count;
    }

    [Test]
    public override void RunPart1OnRealInput()
    {
        var endingFishes = SimulateFishes(ParseInput(GetInputForDay(this)), 80);

        Assert.That(endingFishes, Is.EqualTo(350605));
    }

    [Test]
    public override void TestPart2()
    {
        var fishes = ParseInput(TestInput);
        
        var fishesCount = SimulateFishes(fishes, 80);

        Assert.That(fishesCount, Is.EqualTo(1));
    }

    // [Test]
    public override void RunPart2OnRealInput()
    {
        GetInputForDay(this).Split(NewLine);
        throw new NotImplementedException();
    }
}
