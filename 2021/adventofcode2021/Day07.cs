using NUnit.Framework;

namespace adventofcode2021;

public class Day07 : DayBase
{
    public override string TestInput => @"16,1,2,0,4,2,7,1,2,14";

    [Test]
    public override void TestPart1()
    {
        var testInput = TestInput;
        
        var minFuel = GetMinFuel(testInput, false);


        Assert.That(minFuel.cost, Is.EqualTo(37));
        Assert.That(minFuel.pos, Is.EqualTo(2));

    }

    private (int pos, int cost) GetMinFuel(string testInput, bool part2)
    {
        var crabPositions = ParseInput(testInput);

        var fuelCosts = new List<(int pos, int cost)>();
        for (int i = crabPositions.Min(); i < crabPositions.Max(); i++)
        {
            var fuelCost = CalculateFuelCostToGoToPosition(crabPositions, i, part2);
            fuelCosts.Add((i, fuelCost));
        }

        (int pos, int cost) minFuel = (-1, int.MaxValue);
        foreach (var position in fuelCosts)
        {
            if (position.cost < minFuel.cost) minFuel = position;
        }

        return minFuel;
    }

    private static List<int> ParseInput(string testInput)
    {
        return testInput.Split(",").Select(c => Convert.ToInt32(c)).ToList();
    }

    private int CalculateFuelCostToGoToPosition(IEnumerable<int> crabPositions, int position, bool part2)
    {
        if (part2) return CalculatePart2FuelCostToGoToPosition(crabPositions, position);
        var totalFuel = 0;
        foreach (var crab in crabPositions)
        {
            totalFuel += Math.Abs(position-crab);
        }

        return totalFuel;
    }
    
    private int CalculatePart2FuelCostToGoToPosition(IEnumerable<int> crabPositions, int position)
    {
        var totalFuel = 0;
        
        foreach (var crab in crabPositions)
        {
            var thisCrabFuel = 0;
            var distance = Math.Abs(position-crab);
            
            for (int i = 1; i <= distance; i++)
            {
                thisCrabFuel += i;
            }

            totalFuel += thisCrabFuel;
        }

        return totalFuel;
    }

    [Test, Explicit("Slow")]
    public override void RunPart1OnRealInput()
    {
        var minFuel = GetMinFuel(GetInputForDay(this), false);

        Assert.That(minFuel.cost, Is.EqualTo(328262));
        Assert.That(minFuel.pos, Is.EqualTo(333));
    }

    [Test]
    public override void TestPart2()
    {
        var minfuel = GetMinFuel(TestInput, true);
        
        Assert.That(minfuel.cost, Is.EqualTo(168));
    }

    [Test]
    public void TestPart2Position2()
    {
        var crabs = ParseInput(TestInput);
        var fuelCost = CalculatePart2FuelCostToGoToPosition(crabs, 2);
        
        Assert.That(fuelCost, Is.EqualTo(206));
    }
    [Test]
    public void TestPart2Position5()
    {
        var crabs = ParseInput(TestInput);
        var fuelCost = CalculatePart2FuelCostToGoToPosition(crabs, 5);
        
        Assert.That(fuelCost, Is.EqualTo(168));
    }

    [Test, Explicit("Slow, run in debug mode")]
    public override void RunPart2OnRealInput()
    {
        var minfuel = GetMinFuel(GetInputForDay(this), true);
        
        Assert.That(minfuel.cost, Is.EqualTo(90040997));
    }
}
