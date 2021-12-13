
using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day13 : DayBase
{
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
    public override void TestPart1()
    {
        var parts = TestInput.Split(NewLine+NewLine);
        var coordinates = parts.First().Split(NewLine).Select(line =>
        {
            var coordinatePair = line.Split(",").Select(c=>Convert.ToInt32(c)).ToArray();
            var coordinate = new { x = coordinatePair.First(), y = coordinatePair.Last() };
            return coordinate;
        });
        var folds = parts.Last().Split(NewLine).Select(line=>Convert.ToInt32(line.Split("=").Last()));
        CollectionAssert.AllItemsAreNotNull(folds);

        var height = coordinates.Select(c => c.y).Max();
        var width = coordinates.Select(c => c.x).Max();
        Assert.That(width,Is.EqualTo(10));
        Assert.That(height,Is.EqualTo(14));
        var paper = new bool[height+1,width+1];
        foreach (var coordinate in coordinates)
        {
            paper[coordinate.y, coordinate.x] = true;
        }


        List<bool> test = new List<bool>();
        test.Select(b => MappingFunction(b));

        paper.Select<bool,char>(b => MappingFunction(b));
        
        var map = new char[paper.GetLength(0),paper.GetLength(1)];

        char MappingFunction(bool b)
        {
            return b ? '#' : '.';
        }

        foreach (var (x, y, value) in Day09.EveryPointIn(paper))
        {
            var newValue = MappingFunction(value);
            map[x, y] = newValue;
        }
        
        Day04.PrintMatrix(map);
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
