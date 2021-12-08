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

    [Test]
    public override void TestPart1()
    {
        var overlappingCount = GetOverlappingCount(TestInput, false);

        Assert.That(overlappingCount, Is.EqualTo(5));
    }

    private int GetOverlappingCount(string input, bool allowDiagonal)
    {
        var lines = input.Split(NewLine).Select(lineString =>
        {
            var points = lineString.Split(" -> ");
            var startpoint = points.First().Split(",").Select(n => Convert.ToInt32(n)).ToArray();
            var endpoint = points.Last().Split(",").Select(n => Convert.ToInt32(n)).ToArray();
            var parsedLine = new Line(startpoint.First(), startpoint.Last(), endpoint.First(), endpoint.Last(), allowDiagonal);
            return parsedLine;
        }).ToList();

        var maxx = lines.Max(line => Math.Max(line.x1, line.x2));
        var maxy = lines.Max(line => Math.Max(line.y1, line.y2));

        var oceanfloor = new int[maxx + 1, maxy + 1];

        foreach (var line in lines)
        {
            foreach (var pixel in line)
            {
                oceanfloor[pixel.x, pixel.y]++;
            }
        }

        Day04.PrintMatrix(oceanfloor);

        var overlappingCount = 0;

        for (var i = 0; i < maxx + 1; i++)
        for (var j = 0; j < maxy + 1; j++)
            if (oceanfloor[i, j] >= 2)
                overlappingCount++;
        return overlappingCount;
    }

    [Test]
    public void TestSinglePixel()
    {
        var line = new Line(0, 0, 0, 0, false);
        var amountCalled = 0;

        foreach (var pixel in line)
        {
            Assert.That(pixel.x, Is.EqualTo(0));
            Assert.That(pixel.y, Is.EqualTo(0));
            amountCalled++;
        }

        Assert.That(amountCalled, Is.EqualTo(1));
    }

    [Test]
    public void Test2PixelLine()
    {
        var line = new Line(0, 0, 1, 0, false);
        var positions = new List<(int x, int y)>();

        foreach (var position in line)
        {
            positions.Add(position);
        }

        Assert.That(positions, Is.EqualTo((new[] { (0, 0), (1, 0) }).ToList()));
    }

    [Test]
    public void Test3PixelLine()
    {
        var line = new Line(0, 0, 2, 0, false);
        var positions = new List<(int x, int y)>();

        foreach (var position in line)
        {
            positions.Add(position);
        }

        Assert.That(positions, Is.EqualTo(new[] { (0, 0), (1, 0), (2, 0) }));
    }

    [Test]
    public void TestVerticalLine()
    {
        var line = new Line(0, 0, 0, 1, false);
        var positions = new List<(int x, int y)>();

        foreach (var position in line)
        {
            positions.Add(position);
        }

        Assert.That(positions, Is.EqualTo(new[] { (0, 0), (0, 1) }));
    }

    [Test]
    public void TestBackwardsLine()
    {
        var line = new Line(1, 0, 0, 0, false);
        var positions = new List<(int x, int y)>();

        foreach (var position in line)
        {
            positions.Add(position);
        }

        Assert.That(positions, Is.EqualTo(new[] { (1, 0), (0, 0) }));
    }

    [Test]
    public void TestDiagonalLine()
    {
        var line = new Line(1, 0, 0, 1, true);
        var positions = new List<(int x, int y)>();

        foreach (var position in line)
        {
            positions.Add(position);
        }

        Assert.That(positions, Is.EqualTo(new[] { (1, 0), (0, 1) }));
    }

    [Test]
    public void TestDiagonalLineNotAllowed()
    {
        var line = new Line(1, 0, 0, 1, false);

        foreach (var _ in line) Assert.Fail();
    }

    [Test, Explicit("Slow")]
    public override void RunPart1OnRealInput()
    {
        var overlappingCount = GetOverlappingCount(GetInputForDay(this), false);

        Assert.That(overlappingCount, Is.EqualTo(6397));
    }

    [Test]
    public override void TestPart2()
    {
        var overlappingCount = GetOverlappingCount(TestInput, true);
        Assert.That(overlappingCount, Is.EqualTo(12));
    }

    [Test, Explicit("Slow")]
    public override void RunPart2OnRealInput()
    {
        var overlappingCount = GetOverlappingCount(GetInputForDay(this), true);
        Assert.That(overlappingCount, Is.EqualTo(22335));
    }
}

public class Line : IEnumerable
{
    public int x1 { get; }
    public int x2 { get; }
    public int y1 { get; }
    public int y2 { get; }
    public bool AllowDiagonal { get; }

    public Line(int x1, int y1, int x2, int y2, bool allowDiagonal)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        AllowDiagonal = allowDiagonal;
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }

    public LineEnum GetEnumerator()
    {
        return new LineEnum(this, AllowDiagonal);
    }

    public bool IsDiagonal()
    {
        return Math.Abs(x2 - x1) != 0 && Math.Abs(y2 - y1) != 0;
    }
}

public class LineEnum : IEnumerator
{
    private readonly Line _line;
    private readonly bool _allowDiagonal;
    private readonly (int x, int y) _direction;
    private (int x, int y) _position;
    private bool _firstHasBeenGotten;
    private int _safeSwitch;
    private bool _lastPointHasBeenReached;

    public LineEnum(Line line, bool allowDiagonal)
    {
        _line = line;
        _allowDiagonal = allowDiagonal;
        _lastPointHasBeenReached = false;
        _position = (line.x1, line.y1);
        _direction = (Math.Sign(line.x2 - line.x1), Math.Sign(line.y2 - line.y1));
        _firstHasBeenGotten = false;
        if (
            _direction.x != 0
            && _direction.y != 0
            && Math.Abs(line.x2 - line.x1) - Math.Abs(line.y2 - line.y1) != 0)
            throw new Exception($"line is not straight or diagonal: {line}");

        _safeSwitch = 0;
    }

    public bool MoveNext()
    {
        Console.Out.WriteLine($"now is ({_position.x},{_position.y}), moving to next");

        if (_line.IsDiagonal() && !_allowDiagonal) return false;

        if (!_firstHasBeenGotten)
        {
            _firstHasBeenGotten = true;
            return true;
        }

        _position.x += _direction.x;
        _position.y += _direction.y;

        if (_safeSwitch > 1000) throw new Exception("Safeswitch activated. Line is longer than 1000 pixels");
        _safeSwitch++;

        if (!_lastPointHasBeenReached && (_line.x1 == _line.x2 && _line.y1 == _line.y2))
        {
            _lastPointHasBeenReached = true;
            return false;
        }

        if (!_lastPointHasBeenReached && _position == (_line.x2, _line.y2))
        {
            _lastPointHasBeenReached = true;
            return true;
        }

        return !_lastPointHasBeenReached;
    }

    public void Reset()
    {
        _position = (_line.x1, _line.x2);
    }

    object IEnumerator.Current => Current;
    public (int x, int y) Current => _position;
}