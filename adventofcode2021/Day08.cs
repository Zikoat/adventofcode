
using System.ComponentModel.Design.Serialization;
using System.Numerics;
using Combinatorics.Collections;
using NUnit.Framework;
using NUnit.Framework.Constraints;
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
        var digitCount = SimpleOutputsOnly(TestInput, out var simpleOutputsOnly);

        Assert.That(simpleOutputsOnly.Select(signal=>signal.ToString()).ToString(","), Is.EqualTo("fdgacbe,gcbe,cgb,dgebacf,gc,cg,cg,cbg,cb,gecf,egdcabf,bgf,gebdcfa,ecba,ca,fadegcb,cefg,fcge,gbcadfe,ed,gbdfcae,bgc,cg,cgb,fgae,fg"));
        Assert.That(digitCount, Is.EqualTo(26));
    }

    private int SimpleOutputsOnly(string input, out Signal[] simpleOutputsOnly)
    {
        var shit = ParseInput(input);
        simpleOutputsOnly =
            shit.SelectMany(tuple => tuple.signalOutput.Where(signal => new[] { 2, 4, 3, 7 }.Contains(signal.OnSegments)))
                .ToArray();
        var digitCount = simpleOutputsOnly.Length;
        return digitCount;
    }

    
    private static readonly Dictionary<int, string> Digits = new()
    {
        { 0, "abcefg" },
        { 1, "cf" },
        { 2, "acdeg" },
        { 3, "acdfg" },
        { 4, "bcdf" },
        { 5, "abdfg" },
        { 6, "abdefg" },
        { 7, "acf" },
        { 8, "abcdefg" },
        { 9, "abcdfg" },
    };
    
    private static readonly string OriginalMapping = Digits[8];

    private class Displays
    
    {
        public IEnumerable<Signal> signalInput { get; }
        public IEnumerable<Signal> signalOutput { get; }

        public Displays(IEnumerable<Signal> signalInput, IEnumerable<Signal> signalOutput)
        {
            this.signalInput = signalInput;
            this.signalOutput = signalOutput;
        }

        public string FindWireMapping()
        {
            // var mapping = OriginalMapping.Split("").Select(pulse=>new{pulse,MayBeConnectedTo=OriginalMapping, MayBeNotConnectedTo=OriginalMapping});

            var p = new Permutations<char>(OriginalMapping, GenerateOption.WithoutRepetition);

            Assert.That(p.Count, Is.EqualTo(new BigInteger(5040)));

            string correctmapping = "";
            
            foreach (var v in p)
            {
                if (IsValidMapping(v))
                {
                    $"The mapping is valid {v}".Print();
                    correctmapping = v.ToString("");
                }
            }
            
            return correctmapping;
        }

        public bool IsValidMapping(IReadOnlyList<char> mapping)
        {
            var signals = signalInput.Concat(signalOutput);
            var isValidMapping = signals.All(signal => signal.UnScrambleUsingMapping(mapping) != null);
            return isValidMapping;
        }

        public bool IsValidMapping(string mapping)
        {
            return IsValidMapping(mapping.ToCharArray());
        }
    }

    private class Signal
    {
        public readonly char[] _chars;

        public Signal(char[] chars)
        {
            _chars = chars;
        }

        public int OnSegments => _chars.Length;
        public int OffSegments => OriginalMapping.Length - _chars.Length;

        public int? UnScrambleUsingMapping(IReadOnlyList<char> mapping)
        {
            var unscrambledSignal = new List<char>();
            foreach (var c in _chars)
            {
                var mappedCharacter = mapping[OriginalMapping.IndexOf(c)];
                unscrambledSignal.Add(mappedCharacter);
            }

            foreach (var digit in Digits)
            {
                if (digit.Value.OrderBy(t => t).SequenceEqual(unscrambledSignal.OrderBy(t => t))) return digit.Key;
            }

            return null;
        }
        
        public override string ToString()
        {
            return _chars.ToString("");
        }
    }


    private IEnumerable<Displays> ParseInput(string input)
    {
        return input.Split(NewLine).Select(line=>
        {
            var entry = line.Split(" | ");
            Assert.That(entry.Length, Is.EqualTo(2));
            var signalInput = entry.First().Split(" ").Select(numberSignal => new Signal(numberSignal.ToCharArray()));
            var signalOutput = entry.Last().Split(" ").Select(numberSignal => new Signal(numberSignal.ToCharArray()));
            return new Displays(signalInput, signalOutput);
        });
    }

    [Test]
    public override void RunPart1OnRealInput()
    {
        var digitCount = SimpleOutputsOnly(GetInputForDay(this), out var simpleOutputsOnly);
        Assert.That(digitCount, Is.EqualTo(449));
    }

    [Test]
    public void FindWireMapping()
    {
        var input = "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf";
        var sum = GetSum(input);
        Assert.That(sum, Is.EqualTo(5353));
    }

    private int GetSum(string input)
    {
        var sum = ParseInput(input).Sum(GetDisplayNumber);

        return sum;
    }

    private static int GetDisplayNumber(Displays display)
    {
        var wireMapping = display.FindWireMapping();
        // display.signalInput.Select(signal => signal + ":" + signal.UnScrambleUsingMapping(wireMapping.ToCharArray()))
            // .Print(NewLine);
        // Assert.That(wireMapping, Is.EqualTo("cfgabde"));
        var sum = Convert.ToInt32(display.signalOutput
            .Select(signal => signal.UnScrambleUsingMapping(wireMapping.ToCharArray()).ToString()).ToString(""));
        return sum;
    }

    [Test]
    public void TestIsValidMapping()
    {
        var input = "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf";
        var display = ParseInput(input).Single();
        var isvalid = display.IsValidMapping("abcdefg");
        Assert.That(isvalid, Is.False);
        isvalid = display.IsValidMapping("deafgbc");
        Assert.That(isvalid, Is.False);
        
    }

    [Test]
    public override void TestPart2()
    {
        Assert.That(GetSum(TestInput),Is.EqualTo(61229));
        // TestInput.Split(NewLine);
        // throw new NotImplementedException();
    }

    [Test, Explicit("Slow, brute forces")]
    public override void RunPart2OnRealInput()
    {
        Assert.That(GetSum(GetInputForDay(this)),Is.EqualTo(968175));
    }
}

