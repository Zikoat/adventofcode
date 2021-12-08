using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day03 : DayBase
{
    public override string TestInput => @"00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010";

    [Test]
    public override void TestPart1()
    {
        var testInput = TestInput;
        
        var powerconsumption = CalculatePowerConsumption(testInput, out var shit, out var gammarateString, out var gammarate, out var epsilonratestring, out var epsilonrate);

        Assert.That(epsilonratestring, Is.EqualTo("01001"));
        Assert.That(shit.Count, Is.EqualTo(12));
        Assert.That(shit.First().Count, Is.EqualTo(5));
        Assert.That(epsilonrate, Is.EqualTo(9));
        Assert.That(gammarate, Is.EqualTo(22));
        Assert.That(gammarateString, Is.EqualTo("10110"));
        Assert.That(powerconsumption, Is.EqualTo(198));
    }
    private static int CalculatePowerConsumption(string testInput, out List<List<bool>> matrix, out string gammarateString,
        out int gammarate, out string epsilonratestring, out int epsilonrate)
    {
        matrix = ParseDay3(testInput);
        var transposedMatrix = Transpose(matrix);
        
        gammarateString = transposedMatrix.Select(column => column.Count(b => b) > column.Count / 2 ? "1" : "0").ToString("");
        gammarate=Convert.ToInt32(gammarateString, 2);
        
        epsilonratestring = gammarateString.Select(c => c == '1' ? "0" : "1").ToString("");
        epsilonrate = Convert.ToInt32(epsilonratestring, 2);
        
        return epsilonrate * gammarate;
    }

    private static List<List<bool>> ParseDay3(string testInput)
    {
        return testInput.Split(NewLine).Select(s => s.Select(c => c=='1').ToList()).ToList();
    }

    [Test, Explicit("Slow")]
    public override void RunPart1OnRealInput()
    {
        var powerconsumption = CalculatePowerConsumption(GetInputForDay(this), out var shit, out var gammarateString,
            out var gammarate, out var epsilonratestring, out var epsilonrate);
        Assert.That(powerconsumption, Is.EqualTo(841526));
    }

    [Test]
    public override void TestPart2()
    {
        var lifeSupport = GetLifeSupportRating(out var oxygengeneratorRating, out var co2GeneratorRating, TestInput);

        Assert.That(oxygengeneratorRating, Is.EqualTo(23));
        Assert.That(co2GeneratorRating, Is.EqualTo(10));
        Assert.That(lifeSupport, Is.EqualTo(230));
    }

    private int GetLifeSupportRating(out int oxygengeneratorRating, out int co2GeneratorRating, string nput)
    {
        var matrix = ParseDay3(nput);
        var arrayMatrix = To2D(matrix.Select(column => column.ToArray()).ToArray());
        oxygengeneratorRating = GetRating(arrayMatrix, out var height,
            (validrowcount, halfvalidrow) => validrowcount >= halfvalidrow);
        co2GeneratorRating = GetRating(arrayMatrix, out _, (validrowcount, halfvalidrow) => validrowcount < halfvalidrow);
        var lifeSupport = co2GeneratorRating * oxygengeneratorRating;
        return lifeSupport;
    }

    [Test]
    public void TestTo2D()
    {
        var nonRectangularArray = new[] { new[] { 1, 1 }, new[] { 1 } };
        
        Assert.Throws(Is.TypeOf<InvalidOperationException>(), () => To2D(nonRectangularArray));
    }

    private int GetRating(bool[,] arrayMatrix, out int height, Func<int, float, bool> func )
    {
        var width = arrayMatrix.GetLength(1);
        height = arrayMatrix.GetLength(0);

        var validOxygenNumbers = Enumerable.Repeat(true, height).ToArray();

        for (var i = 0; i < width; i++)
        {
            var validRows = GetColumn(arrayMatrix, i).Select((bit, i1) => (bit, isvalid: validOxygenNumbers[i1]))
                .Where(row => row.isvalid);
            var validRowCount = validRows.Count(row => row.bit);
            var totalRowCount = validOxygenNumbers.Count(b => b);
            var dominantBit =func(validRowCount,(float)totalRowCount / 2) ;
            
            for (var j = 0; j < height; j++)
            {
                if (!validOxygenNumbers[j]) continue;
                if (arrayMatrix[j, i] != dominantBit) validOxygenNumbers[j] = false;
            }

            // print the remaining numbers
            validOxygenNumbers.Select((isvalid, i) => (isvalid, GetRow(arrayMatrix, i))).Where(valid => valid.isvalid)
                .Select(number => number.Item2).Select(bools => bools.Select(b => b ? "1" : "0").ToString("")).Print();

            if (validOxygenNumbers.Count(b => b) == 1) break;

            if (i == width - 1)
            {
                throw new Exception("reached end of loop through width");
            }
        }

        var indexofoxygengenerator = Array.FindIndex(validOxygenNumbers, b=>b);
        Assert.That(validOxygenNumbers.Count(b => b), Is.EqualTo(1));
        var oxygengenerator = GetRow(arrayMatrix, indexofoxygengenerator);
        var oxygengeneratorString = oxygengenerator.Select(b => b ? "1" : "0").ToString("");
        var oxygengeneratorRating = Convert.ToInt32(oxygengeneratorString, 2); 
            return oxygengeneratorRating;
    }

    public static T[] GetColumn<T>(T[,] matrix, int columnNumber)
    {
        return Enumerable.Range(0, matrix.GetLength(0))
            .Select(x => matrix[x, columnNumber])
            .ToArray();
    }

    public static T[] GetRow<T>(T[,] matrix, int rowNumber)
    {
        return Enumerable.Range(0, matrix.GetLength(1))
            .Select(x => matrix[rowNumber, x])
            .ToArray();
    }

    // https://stackoverflow.com/a/26291720/5936629
    public static T[,] To2D<T>(T[][] source)
    {
        try
        {
            int FirstDim = source.Length;
            int SecondDim = source.GroupBy(row => row.Length).Single().Key; // throws InvalidOperationException if source is not rectangular

            var result = new T[FirstDim, SecondDim];
            for (int i = 0; i < FirstDim; ++i)
            for (int j = 0; j < SecondDim; ++j)
                result[i, j] = source[i][j];

            return result;
        }
        catch (InvalidOperationException)
        {
            throw new InvalidOperationException("The given jagged array is not rectangular.");
        } 
    }


    [Test]
    public void TestTranspose()
    {
        var singleColumnMatrix = new[] { new[] { "a", "b" }.ToList() }.ToList();
        var transposedMatrix = Transpose(singleColumnMatrix);
        Assert.That(transposedMatrix, Is.EqualTo(new[]{new[]{"a"}.ToList(),new[]{"b"}.ToList()}.ToList()));
    }
    private static List<List<T>> Transpose<T>(List<List<T>> matrix)
    {
        var transposedMatrix = matrix.First().Select(_ => new List<T>()).ToList();
        for (int i = 0; i < matrix.First().Count; i++)
        {
            var column = matrix.Select(row=>row[i]);
            transposedMatrix[i].AddRange(column);
        }
        return transposedMatrix;
    }

    [Test, Explicit("Slow")]
    public override void RunPart2OnRealInput()
    {
        var lifeSupport = GetLifeSupportRating(out var _, out var _, GetInputForDay(this));
        
        Assert.That(lifeSupport, Is.EqualTo(4790390));
    }
}
