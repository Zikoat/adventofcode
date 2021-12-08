
using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day08 : DayBase
{
    public override string TestInput => @"be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce";

    [Test]
    public override void TestPart1()
    {
        var digitCount = SimpleOutputsOnly(, out var simpleOutputsOnly);

        Assert.That(simpleOutputsOnly.Select(signal=>signal.ToString("")).ToString(","), Is.EqualTo("fdgacbe,gcbe,cgb,dgebacf,gc,cg,cg,cbg,cb,gecf,egdcabf,bgf,gebdcfa,ecba,ca,fadegcb,cefg,fcge,gbcadfe,ed,gbdfcae,bgc,cg,cgb,fgae,fg"));
        Assert.That(digitCount, Is.EqualTo(26));
    }

    private int SimpleOutputsOnly(string input, out string simpleOutputsOnly)
    {
        var shit = ParseInput(input);
        simpleOutputsOnly =
            shit.SelectMany(tuple => tuple.signalOutput.Where(signal => new[] { 2, 4, 3, 7 }.Contains(signal.Length)))
                .ToArray();
        var digitCount = simpleOutputsOnly.Length;
        return digitCount;
    }

    private IEnumerable<(IEnumerable<char[]> signalInput, IEnumerable<char[]> signalOutput)> ParseInput(string input)
    {
        return input.Split(NewLine).Select(line=>
        {
            var entry = line.Split(" | ");
            Assert.That(entry.Length, Is.EqualTo(2));
            var signalInput = entry.First().Split(" ").Select(numberSignal => numberSignal.ToCharArray());
            var signalOutput = entry.Last().Split(" ").Select(numberSignal => numberSignal.ToCharArray());
            return (signalInput, signalOutput);
        });
    }

    [Test]
    public override void RunPart1OnRealInput()
    {
        GetInputForDay(this).Split(NewLine);
        throw new NotImplementedException();
    }

    // [Test]
    public override void TestPart2()
    {
        TestInput.Split(NewLine);
        throw new NotImplementedException();
    }

    // [Test]
    public override void RunPart2OnRealInput()
    {
        GetInputForDay(this).Split(NewLine);
        throw new NotImplementedException();
    }
}
