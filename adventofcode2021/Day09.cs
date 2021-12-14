
using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day09 : DayBase
{
    public override string TestInput => @"2199943210
3987894921
9856789892
8767896789
9899965678";

    [Test]
    public override void TestPart1()
    {
        var riskSum = GetRiskSum(TestInput);

        Assert.That(riskSum, Is.EqualTo(15));
    }

    private static int[,] ParseInput(string input)
    {
        return Day03.To2D(input.Split(NewLine).Select(line=> line.Select(c=>Convert.ToInt32(c.ToString())))).Transpose();
    }

    private static int GetRiskSum(string Input)
    {
        var matrix = ParseInput(Input);
        var riskSum = 0;
        foreach (var (x, y, value) in matrix.EveryPointIn())
        {
            var everyAdjacentIsLower = !(IsInsideBounds(matrix, x + 1, y) && matrix[x + 1, y] <= value) &&
                                       !(IsInsideBounds(matrix, x, y + 1) && matrix[x, y + 1] <= value) &&
                                       !(IsInsideBounds(matrix, x - 1, y) && matrix[x - 1, y] <= value) &&
                                       !(IsInsideBounds(matrix, x, y - 1) && matrix[x, y - 1] <= value);

            if (everyAdjacentIsLower) riskSum += value + 1;
        }

        return riskSum;
    }

    [Test]
    public void TestIsInsideBounds()
    {
        var matrix = new[,] { { 0, 1 } };
        Assert.That(matrix[0,1], Is.EqualTo(1));
        var width = matrix.GetLength(0);
        Assert.That(width, Is.EqualTo(1));
        var height = matrix.GetLength(1);
        Assert.That(height, Is.EqualTo(2));

        Assert.That(IsInsideBounds(matrix, 0, 1), Is.True);
        
        Assert.That(IsInsideBounds(matrix, -1, 0), Is.False);
        Assert.That(IsInsideBounds(matrix, 0, -1), Is.False);
        Assert.That(IsInsideBounds(matrix, 1, 0), Is.False);
        Assert.That(IsInsideBounds(matrix, 0, 2), Is.False);
    }

    private static bool IsInsideBounds<T>(T[,] matrix, int x, int y)
    {
        return x <= matrix.GetUpperBound(0) && y <= matrix.GetUpperBound(1) && x >= 0 && y >= 0;
    }

    [Test]
    public void TestEveryPointIn()
    {
        var matrix = new[,] { { 0, 1 }, { 2, 3 } }.Transpose();

        var actualOutput = matrix.EveryPointIn().ToList();

        Assert.That(actualOutput, Is.EqualTo(new[] { (0, 0, 0), (1, 0, 1), (0, 1, 2), (1, 1, 3) }));
    }
    [Test]
    public void TestEveryPointIn_WhenMatrixIsEmpty()
    {
        var matrix = new int[,] { {} };
        
        foreach (var _ in matrix.EveryPointIn()) Assert.Fail();

    }
    
    [Test]
    public override void RunPart1OnRealInput()
    {
        Assert.That(GetRiskSum(GetInputForDay(this)), Is.EqualTo(516));
    }

    [Test, Explicit("Day not finished")]
    public override void TestPart2()
    {
        var matrix = ParseInput(TestInput);
        var basinCount = new int[matrix.GetLength(0), matrix.GetLength(1)];
        Assert.That(matrix.GetUpperBound(0), Is.EqualTo(basinCount.GetUpperBound(0)));

        matrix.Transpose().Print();
        
        foreach (var point in matrix.EveryPointIn())
        {
            FlowToLowPoint(point, matrix, basinCount);
        }
        
        basinCount.Print();
        
        var basinsProduct = basinCount.Cast<int>().OrderBy(n => n).Take(3).Aggregate((total, next) => total * next);
        Assert.That(basinsProduct, Is.EqualTo(1134));
    }

    private void FlowToLowPoint((int x, int y, int value) point, int[,] matrix, int[,] basinCount)
    {
        var currentValue = point.value;
        var allNeighbors = GetAllNeighbors(point, matrix);
        foreach (var neighbor in allNeighbors)
        {
            if (currentValue < neighbor.value)
            {
                FlowToLowPoint(neighbor, matrix, basinCount);
                break;
            }
        }

        basinCount[point.x, point.y]++;
    }

    private static IEnumerable<(int x, int y, int value)> GetAllNeighbors((int x, int y, int value) point, int[,] matrix)
    {
        var (x, y, _) = point;
        if (IsInsideBounds(matrix, x + 1, y)) yield return (x+1, y, matrix[x + 1, y]);
        if (IsInsideBounds(matrix, x, y +1 )) yield return (x+1, y, matrix[x, y + 1]);
        if (IsInsideBounds(matrix,  x - 1, y)) yield return (x+1, y, matrix[x - 1, y]);
        if (IsInsideBounds(matrix, x, y - 1)) yield return (x+1, y, matrix[x, y - 1]);
    }

    // [Test]
    public override void RunPart2OnRealInput()
    {
        GetInputForDay(this).Split(NewLine);
        throw new NotImplementedException();
    }
}
