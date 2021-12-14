
using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day13 : DayBase
{
    [Test]
    public override void TestPart1()
    {
        var input = TestInput;
        
        var pixelsCount = GetPixelsCountAfterOneFold(input);

        Assert.That(pixelsCount, Is.EqualTo(17));
    }

    private static int GetPixelsCountAfterOneFold(string input)
    {
        var parsed = ParseInput(input);

        parsed.paper.Cast<bool>().Count(value => value).Print();
        "Unfolded paper:".Print();
        parsed.paper.Select(p => p ? '#' : '.').Print();

        var foldedPaper = FoldPaper(parsed.paper, parsed.folds.First());

        nameof(foldedPaper).Print();
        foldedPaper.Select(p => p ? '#' : '.').Print();

        var pixelsCount = foldedPaper.Cast<bool>().Count(value => value);
        return pixelsCount;
    }

    private static bool[,] FoldPaper(bool[,] paper, (bool alongX, int alongLine) valueTuple)
    {
        var (alongX, alongLine) = valueTuple;
        if (alongX) paper = paper.Transpose();

        var foldedPaper = FoldPaper(paper, alongLine);
        if (alongX) foldedPaper = foldedPaper.Transpose();
        return foldedPaper;
    }

    private static bool[,] FoldPaper(bool[,] paper, int foldYLine)
    {
        var foldedPaper = new bool[foldYLine - 1, paper.GetLength(1)];

        for (int y = 1; y <= foldYLine - 1; y++)
        {
            for (int x = 0; x <= paper.GetUpperBound(1); x++)
            {
                var unfoldedYPosition = foldYLine + 1 + y; // +- a little
                var foldedYPosition = foldYLine - 1 - y; // +- a little

                if (x < 0 || foldedYPosition < 0 || x > foldedPaper.GetUpperBound(1) ||
                    foldedYPosition > foldedPaper.GetUpperBound(0))
                    throw new Exception(
                        $"index was outside bouds of array. x={x},y={foldedYPosition},height={foldedPaper.GetLength(0)},width={foldedPaper.GetLength(1)}");
                foldedPaper[foldedYPosition, x] = paper[unfoldedYPosition, x];
            }
        }

        foreach (var (x, y, value) in foldedPaper.EveryPointIn())
        {
            foldedPaper[x, y] = paper[x, y] || value;
        }

        return foldedPaper;
    }

    private static (bool[,] paper,IEnumerable<(bool alongX, int alongLine)> folds ) ParseInput(string input)
    {
        var parts = input.Split(NewLine + NewLine);
        var coordinates = parts.First().Split(NewLine).Select(line =>
        {
            var coordinatePair = line.Split(",").Select(c => Convert.ToInt32(c)).ToArray();
            var coordinate = new { x = coordinatePair.First(), y = coordinatePair.Last() };
            return coordinate;
        });
        IEnumerable<(bool alongX, int alongLine)> folds = parts.Last().Split(NewLine).Select(line =>
        {
            var foldSplit = line.Split("=").ToList();
            var alongCharacter = foldSplit.First().Last();

            return (alongX: alongCharacter == 'x', alongLine: Convert.ToInt32(foldSplit.Last()));
        });
        CollectionAssert.AllItemsAreNotNull(folds);

        var height = coordinates.Select(c => c.y).Max();
        var width = coordinates.Select(c => c.x).Max();
        // Assert.That(width, Is.EqualTo(10));
        // Assert.That(height, Is.EqualTo(14));
        var paper = new bool[height + 1, width + 1];
        foreach (var coordinate in coordinates)
        {
            paper[coordinate.y, coordinate.x] = true;
        }

        return (paper, folds);
    }

    public override string TestInput => @"6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5";

    [Test]
    public override void RunPart1OnRealInput()
    {
        var pixelsCount = GetPixelsCountAfterOneFold(GetInputForDay(this));
        
        Assert.That(pixelsCount, Is.EqualTo(1));
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
