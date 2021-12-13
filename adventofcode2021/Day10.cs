using System.Diagnostics;
using NUnit.Framework;
using static System.Environment;
using MathNet.Numerics.Statistics;

namespace adventofcode2021;

public class Day10 : DayBase
{
    private readonly (char, char)[] _bracketPairs = { ('(', ')'), ('[', ']'), ('{', '}'), ('<', '>') };
    private readonly Dictionary<char, int> _scoreTable = new Dictionary<char, int> { { ')', 1}, { ']', 2 }, { '}', 3 }, { '>', 4 } };

    public override string TestInput => @"[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]";

    [TestCase("()")]
    [TestCase("[]")]
    [TestCase("([])")]
    [TestCase("{()()()}")]
    [TestCase("<([{}])>")]
    [TestCase("[<>({}){}[([])<>]]")]
    [TestCase("(((((((((())))))))))")]
    
    
    public void TestLegalChunks(string chunk)
    {
        Assert.That(GetFirstCorruptedCharacter(chunk), Is.EqualTo(((char?, char?, Stack<int>?))(null, null, new Stack<int>())));
    }
    
    [TestCase("(]", ')',']')]
    [TestCase("{()()()>", '}', '>')]
    [TestCase("(((()))}", ')', '}')]
    [TestCase("<([]){()}[{}])", '>', ')')]
    public void TestCorruptedChunks(string chunk, char expectedCharacter, char corruptedCharacter)
    {
        Assert.That(GetFirstCorruptedCharacter(chunk), Is.EqualTo(((char?, char?, Stack<int>?))(expectedCharacter, corruptedCharacter, null)));
    }

    private (char? expected, char? actual, Stack<char>? finishedStack) GetFirstCorruptedCharacter(string chunk)
    {
        var stack = new Stack<char>();
        foreach (var character in chunk)
        {
            if (IsOpeningCharacter(character))
            {
                stack.Push(character);
            }
            else
            {
                var previousOpeningCharacter = stack.Pop();
                if (!IsPair(previousOpeningCharacter, character))
                {
                    var expectedCharacter = GetPairingBrace(previousOpeningCharacter); 
                    return (expectedCharacter, character, null);
                }
            }
        }

        return (null, null, stack);
    }

    private bool IsPair(char openingCharacter, char closingCharacter)
    {
        return _bracketPairs.Contains((openingCharacter, closingCharacter));
    }

    private bool IsOpeningCharacter(char character)
    {
        if (_bracketPairs.Select(c=>c.Item1).Contains(character))
        {
            return true;
        }
        if (_bracketPairs.Select(c=>c.Item2).Contains(character))
        {
            return false;
        }

        throw new Exception($"Character \"{character}\" is not an opening or closing brace");
    }
    
    [Test]
    public void TestIsOpeningCharacterShouldThrowOnNonBraceCharacter()
    {
        var ex = Assert.Throws<Exception>(() => IsOpeningCharacter('a'));
        Assert.That(ex?.Message, Is.EqualTo("Character \"a\" is not an opening or closing brace"));
    }
    
    [Test]
    public void TestIsOpeningCharacterShouldReturnTrueOnOpeningBracket()
    {
        Assert.That(IsOpeningCharacter('('),Is.True);
    }

    [Test]
    public void TestIsOpeningBracketShouldReturnFalseOnClosingBracket()
    {
        Assert.That(IsOpeningCharacter('>'),Is.False);

    }
    
    [Test]
    public override void TestPart1()
    {
        var syntaxErrorScore = GetSyntaxErrorScore(TestInput);

        Assert.That(syntaxErrorScore, Is.EqualTo(26397));
    }

    private int GetSyntaxErrorScore(string input)
    {
        var scoreTable = new Dictionary<char, int> { { ')', 3 }, { ']', 57 }, { '}', 1197 }, { '>', 25137 } };
        var firstCorrupteCharacters = input.Split(NewLine).Select(GetFirstCorruptedCharacter).Select(c=>c.actual).WhereNotNull().ToList();
        var syntaxErrorScore = firstCorrupteCharacters.Select(corrupted =>
        {
            scoreTable.TryGetValue(corrupted, out var score);
            return score;
        }).Sum();
        return syntaxErrorScore;
    }


    [Test]
    public override void RunPart1OnRealInput()
    {
        var syntaxErrorScore = GetSyntaxErrorScore(GetInputForDay(this));
        Assert.That(syntaxErrorScore,Is.EqualTo(392421));
    }

    public override void TestPart2()
    {
        var input = TestInput;
        
        // var middleScore = GetMiddleScore(input);
        var scores = input.Split(NewLine).Select(GetLineScore);
        Assert.That(scores, Is.EqualTo(new[]{288957,5566,1480781,995444,294}));

        // Assert.That(middleScore, Is.EqualTo(288957));
    }

    private double GetMiddleScore(string input)
    {
        var lines = input.Split(NewLine);
        List<long> scores=new List<long>();
        foreach (var line in lines)
        {
            var lineScore = GetLineScore(line);
         scores.Add(lineScore);
        }
        var nonZeroScores = scores.Where(s =>s!=0).ToList();
        nonZeroScores.Count.Print();
        nonZeroScores.Print();
        
        var middleScore = nonZeroScores.Select(Convert.ToDouble).Median();
        return middleScore;
    }

    [Test]
    public void TestIncompleteLine()
    {
        var input = "<{([{{}}[<[[[<>{}]]]>[]]";

        var score = GetLineScore(input);

        Assert.That(score, Is.EqualTo(294));
    }

    private long GetLineScore(string lineString)
    {
        var finishedStack = GetFirstCorruptedCharacter(lineString).finishedStack?.Select(GetPairingBrace).ToArray();
        if (finishedStack == null) return 0;
        
        long score = 0;
        foreach (var c in finishedStack)
        {
            score *= 5;
            if (!_scoreTable.TryGetValue(c, out var characterScore)) throw new Exception($"Could not find Score for {c}");
            score += characterScore;
        }

        return score;
    }

    [Test]
    public void TestGetPairingBraceShouldThrowOnNonBrace()
    {
        Assert.Throws<InvalidOperationException>(() => GetPairingBrace('a'));
    }

    [Test]
    public void TestGetPairingOpeningBrace()
    {
        Assert.That(GetPairingBrace(')'), Is.EqualTo('('));
    }
    [Test]
    public void TestGetPairingClosingBrace()
    {
        Assert.That(GetPairingBrace('<'), Is.EqualTo('>'));
    }

    private char GetPairingBrace(char bracket)
    {
        var (openingBrace, closingBrace) = _bracketPairs.Single(pair => pair.Item1 == bracket || pair.Item2 == bracket);
        return openingBrace == bracket ? closingBrace : openingBrace;
    }

    [Test]
    public override void RunPart2OnRealInput()
    {
        var middleScore = GetMiddleScore(GetInputForDay(this));
        Assert.That(middleScore, Is.EqualTo(2769449099));
    }
}
