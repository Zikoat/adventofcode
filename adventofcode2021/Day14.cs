
using System.Text;
using NUnit.Framework;
using NUnit.Framework.Constraints;
using NUnit.Framework.Internal;
using static System.Environment;

namespace adventofcode2021;

public class Day14 : DayBase
{
    public override string TestInput => @"NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C";

    public class PolymerRule
    {
        public string fromString { get; }
        public string to { get; }

        public PolymerRule(string fromString, string to)
        {
            this.fromString = fromString;
            this.to = to;
        }
    }

    [Test]
    public void TestSingleStep()
    {
        var permutatedSentence = PermutateInput(TestInput, 1);

        Assert.That(permutatedSentence,Is.EqualTo("NCNBCHB"));
    }

    [Test]
    public override void TestPart1()
    {
        Assert.That(Diff(TestInput,10),Is.EqualTo(1588));
        Assert.That(OptimizedDiff(TestInput,10),Is.EqualTo(1588));

    }
    
    private static int Diff(string input, int stepCount)
    {
        var permutatedSentence = PermutateInput(input, stepCount);
        // Assert.That(permutatedSentence.Count(),Is.EqualTo(3073));
        var characterCount = permutatedSentence.GroupBy(c => c).OrderBy(chars => chars.Count()).ToList();
        var minCharacterCount = characterCount.First().Count();
        var maxCharacterCount = characterCount.Last().Count();
        var diff = maxCharacterCount - minCharacterCount;
        return diff;
    }

    private static string PermutateInput(string input, int steps)
    {
        var (sentence, rules) = ParseSystem(input);
        
        var permutatedSentence = PermutateSentence(sentence, rules, steps);
        return permutatedSentence;
    }

    private static (string sentence, List<PolymerRule> rules) ParseSystem(string input)
    {
        var parts = input.Split(NewLine + NewLine);
        var sentence = parts.First();
        var rules = parts.Last().Split(NewLine).Select(line =>
        {
            var splitLine = line.Split(" -> ");
            var fromString = splitLine.First();
            var to = splitLine.Last();
            return new PolymerRule(fromString, to);
        }).ToList();
        return (sentence, rules);
    }

    private static Dictionary<string, int> PermutateSentence(string sentence, List<PolymerRule> rules,  int steps)
    {

        var pairDict = new Dictionary<string, int>();
        for (var i = 0; i < sentence.Length-1; i++)
        {
            var currentChar = sentence[i];;
            var nextChar = sentence[i+1];
            addPair(pairDict, currentChar.ToString()+nextChar, 1);
        }

        for (var i = 0; i < steps; i++)
        {
            foreach (KeyValuePair<string,int> pair in pairDict)
            {
                foreach (var rule in rules)
                {
                    if (rule.fromString == pair.Key)
                    {
                        var firstcharacter = rule.fromString.First();
                        var secondCharacter = rule.fromString.Last();
                        pairDict["" + firstcharacter + rule.to] += pair.Value;
                        pairDict["" + rule.to + secondCharacter] += pair.Value;
                        break;
                    }
                }
            }
        }

        // permutatedSentence.Print();
        return pairDict;
    }

    private static void addPair(Dictionary<string,int> pairDict, string pair, int amount)
    {
        if (pairDict.TryGetValue(pair, out _))
        {
            pairDict[pair] += amount;
        }
        else
        {
            pairDict.Add(pair, 1);
        }
    }

    [Test]
    public override void RunPart1OnRealInput()
    {
        Assert.That(Diff(GetInputForDay(this),10),Is.EqualTo(3411));
        Assert.That(OptimizedDiff(GetInputForDay(this),10),Is.EqualTo(3411));
    }

    private static int OptimizedDiff(string input, int stepCount)
    {
        var permutatedSentence = OptimizedPermutateInput(input, stepCount);
        // Assert.That(permutatedSentence.Count(),Is.EqualTo(3073));
        var characterCount = permutatedSentence.GroupBy(c => c).OrderBy(chars => chars.Count()).ToList();
        var minCharacterCount = characterCount.First().Count();
        var maxCharacterCount = characterCount.Last().Count();
        var diff = maxCharacterCount - minCharacterCount;
        return diff;
    }
    private static string OptimizedPermutateInput(string input, int steps)
    {
        var (sentence, rules) = ParseSystem(input);
        
        var permutatedSentence = PermutateSentence(sentence, rules, steps);
        return permutatedSentence;
    }


    // [Test]
    public override void TestPart2()
    {
        OptimizedDiff(TestInput, 40);
        Assert.That(Diff(TestInput,40),Is.EqualTo(2188189693529));
    }

    [Test]
    public override void RunPart2OnRealInput()
    {
        GetInputForDay(this).Split(NewLine);
        throw new NotImplementedException();
    }
}
