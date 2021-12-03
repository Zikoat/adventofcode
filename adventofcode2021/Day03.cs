
using NUnit.Framework;
using NUnit.Framework.Constraints;
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

    private static int Strings(string testInput, out string[] shit, out string gammarateString, out int stringLength,
        out int gammarate, out string epsilonratestring, out int epsilonrate)
    {
        shit = testInput.Split(NewLine);
        gammarateString = "";
        stringLength = shit.First().Length;
        for (var i = 0; i < stringLength; i++)
        {
            var currentBitsString = shit.Select(shitstring => shitstring[i]);
            var currentBitsStringOnesCount = currentBitsString.Count(bitstring => bitstring == '1');
            var currentBit = currentBitsStringOnesCount > shit.Length / 2 ? "1" : "0";
            gammarateString += currentBit;
        }

        gammarate = Convert.ToInt32(gammarateString, 2);
        epsilonratestring = gammarateString.Select(c => c == '1' ? "0" : "1").ToString("");
        epsilonratestring.Print(",");
        epsilonrate = Convert.ToInt32(epsilonratestring, 2);
        var powerconsumption = epsilonrate * gammarate;
        return powerconsumption;
    }

    [Test]
    public override void RunPart1OnRealInput()
    {
        var powerconsumption = CalculatePowerConsumption(GetInputForDay(this), out var shit, out var gammarateString, out var gammarate, out var epsilonratestring, out var epsilonrate);
Assert.Multiple(()=>
{
    Assert.That(powerconsumption, Is.EqualTo(841526));
    Assert.That(gammarateString, Is.EqualTo("000011011001"));
    Assert.That(gammarate, Is.EqualTo(217));
    Assert.That(epsilonratestring, Is.EqualTo(   "111100100110"));
    Assert.That(epsilonrate, Is.EqualTo(3878));

});
    }

    [Test]
    public override void TestPart2()
    {
        var lifeSupport = 0;
        var oxygenGenerator = 0;
        var co2Scrubber = 0;

        var matrix = ParseDay3(TestInput);

        
        
        var enumerable = TestInput.Split(NewLine).Select(s => s.Split().Select(c => c == "1")).ToList();
        Assert.That(enumerable, Is.InstanceOf<IEnumerable<IEnumerable<bool>>>());
        // var transposedBoolMatrix = Transpose(enumerable);
        // Assert.That(transposedBoolMatrix);
        throw new NotImplementedException();
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

    [Test]
    public override void RunPart2OnRealInput()
    {
        GetInputForDay(this).Split(NewLine);
        throw new NotImplementedException();
    }
}
