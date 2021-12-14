
using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day11 : DayBase
{
    public override string TestInput => @"5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526";

    [Test]
    public void TestFlashCircle()
    {
        var simpleInput = @"11111
19991
19191
19991
11111";

        var parsedInput = ParseInput(simpleInput);
        parsedInput.Print();

        var flashesCount = SimulateSteps(parsedInput);
    }

    private int SimulateSteps(int[,] parsedInput)
    {
        var newMatrix = (int[,])parsedInput.Clone();
        foreach (var (x, y, _) in parsedInput.EveryPointIn()) newMatrix[x, y]++;
        foreach (var (x, y, _) in parsedInput.EveryPointIn()) newMatrix[x, y]++;

    }

    private static int[,] ParseInput(string simpleInput)
    {
        return simpleInput.Split(NewLine).Select(line => line.Select(c=>Convert.ToInt32(c.ToString()))).To2D();
    }

    [Test]
    public override void TestPart1()
    {
        ParseInput(TestInput).Print();
    }

    [Test]
    public override void RunPart1OnRealInput()
    {
        GetInputForDay(this).Split(NewLine);
        throw new NotImplementedException();
    }

    [Test]
    public override void TestPart2()
    {
        TestInput.Split(NewLine);
        throw new NotImplementedException();
    }

    [Test]
    public override void RunPart2OnRealInput()
    {
        GetInputForDay(this).Split(NewLine);
        throw new NotImplementedException();
    }
}
