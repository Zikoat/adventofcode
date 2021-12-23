
using System.Text;
using NUnit.Framework;
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
        Assert.That(OptimizedDiff(TestInput,10),Is.EqualTo(1588), "optimized should have been");
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

    private static Dictionary<string, long> OptimizedPermutateSentence(string sentence, List<PolymerRule> rules,  long steps)
    {

        var pairDict = new Dictionary<string, long>();
        for (var i = 0; i < sentence.Length-1; i++)
        {
            var currentChar = sentence[i];;
            var nextChar = sentence[i+1];
            IncrementOrCreate(pairDict, currentChar.ToString()+nextChar, 1);
        }

        for (var i = 0; i < steps; i++)
        {
            Dictionary<string,long> newPairDict =new Dictionary<string, long>(pairDict);
            foreach (KeyValuePair<string,long> pair in pairDict)
            {
                foreach (var rule in rules)
                {
                    if (rule.fromString == pair.Key)
                    {
                        var firstcharacter = rule.fromString.First();
                        var secondCharacter = rule.fromString.Last();
                        IncrementOrCreate(newPairDict,"" + firstcharacter + rule.to, pair.Value);
                        IncrementOrCreate(newPairDict,"" + rule.to + secondCharacter,pair.Value);
                        IncrementOrCreate(newPairDict,rule.fromString, -pair.Value);
                        break;
                    }
                }
            }

            pairDict = new Dictionary<string, long>(newPairDict);
        }

        // permutatedSentence.Print();
        return pairDict;
    }
    private static string PermutateSentence(string sentence, List<PolymerRule> rules,  int steps)
    {
        var permutatedSentence = sentence;
        for (var i = 0; i < steps; i++)
        {
            var newSentence = new StringBuilder();
            for (var j = 0; j < permutatedSentence.Length - 1; j++)
            {
                var currentChar = permutatedSentence[j];
                newSentence.Append(currentChar);
                var nextChar = permutatedSentence[j + 1];
                var singleRule = rules.SingleOrDefault(rule => "" + currentChar + nextChar == rule.fromString,
                    new PolymerRule("", ""));
                newSentence.Append(singleRule.to);
            }

            newSentence.Append(permutatedSentence.Last());

            permutatedSentence = newSentence.ToString();
        }

        // permutatedSentence.Print();
        return permutatedSentence;
    }


    private static void IncrementOrCreate<T>(Dictionary<T,int> pairDict, T pair, int amount)
    {
        if (pairDict.ContainsKey(pair))
        {
            pairDict[pair] += amount;
        }
        else
        {
            pairDict.Add(pair, amount);
        }
    }
    private static void IncrementOrCreate<T>(Dictionary<T,long> pairDict, T pair, long amount)
    {
        if (pairDict.ContainsKey(pair))
        {
            pairDict[pair] += amount;
        }
        else
        {
            pairDict.Add(pair, amount);
        }
    }

    [Test]
    public override void RunPart1OnRealInput()
    {
        Assert.That(OptimizedDiff(GetInputForDay(this),10),Is.EqualTo(3411));
    }

    private static long OptimizedDiff(string input, long stepCount)
    {
        Dictionary<char, long> characterCount = OptimizedPermutateInput(input, stepCount);
        // Assert.That(permutatedSentence.Count(),Is.EqualTo(3073));

        var minCharacterCount = characterCount.Select(charCount => charCount.Value).Min();
        var maxCharacterCount = characterCount.Select(charCount => charCount.Value).Max();
        var diff = maxCharacterCount - minCharacterCount;
        return diff;
    }
    private static Dictionary<char, long> OptimizedPermutateInput(string input, long steps)
    {
        var (sentence, rules) = ParseSystem(input);
        
        var permutatedSentence = OptimizedPermutateSentence(sentence, rules, steps);

        var charCount = new Dictionary<char, long>();
        foreach (var (pairString, pairCount) in permutatedSentence)
        {
            IncrementOrCreate(charCount, pairString.First(), pairCount);
        }

        IncrementOrCreate(charCount,sentence.Last(),1);

        return charCount;
    }


    [Test]
    public override void TestPart2()
    {
        Assert.That(OptimizedDiff(TestInput,40),Is.EqualTo(2188189693529));
    }

    [Test]
    public override void RunPart2OnRealInput()
    {
        Assert.That(OptimizedDiff(GetInputForDay(this),40),Is.EqualTo(7477815755570));
    }
}
