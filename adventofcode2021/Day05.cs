
using System.Collections;
using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day05 : DayBase
{
    public override string TestInput => @"0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2";

    public class Line
    {
        public int x1 { get; }
        public int x2 { get; }
        public int y1 { get; }
        public int y2 { get; }

        public Line(int x1, int x2, int y1, int y2)
        {
            this.x1 = x1;
            this.x2 = x2;
            this.y1 = y1;
            this.y2 = y2;
        }
    }

    [Test]
    public override void TestPart1()
    {
       var lines =  TestInput.Split(NewLine).Select(lineString=>
        {
            var points = lineString.Split(" -> ");
            var startpoint = points.First().Split(",").Select(n=>Convert.ToInt32(n)).ToArray();
            var endpoint = points.Last().Split(",").Select(n=>Convert.ToInt32(n)).ToArray();
            var parsedLine = new Line(startpoint.First(), startpoint.Last(), endpoint.First(), endpoint.Last());
            return parsedLine;
        }).ToList();

       var maxx = lines.Max(line => line.x2);
       var maxy = lines.Max(line => line.y2);

       var oceanfloor = new int[maxx, maxy];

       foreach (var line in lines)
       {
       }

       var overlappingCount = 0;
        Assert.That(overlappingCount, Is.EqualTo(5));    
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
