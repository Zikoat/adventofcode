using System.Text.RegularExpressions;
using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day04 : DayBase
{
    public override string TestInput => @"7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7";

    private class ParsedBoard
    {
        public int[,] Board { get; }
        public bool[,] Marks { get; }
        public int? WinningNumber { get; set; }

        public ParsedBoard(int[,] board, bool[,] marks)
        {
            Board = board;
            Marks = marks;
        }
    }

    [Test]
    public override void TestPart1()
    {
        var input = TestInput;
        
        var score = CalculateScore(input, out var winningNumber, true);
        
        Assert.That(winningNumber, Is.EqualTo(24));
        Assert.That(score, Is.EqualTo(4512));
    }

    private int CalculateScore(string input, out int winningNumber, bool getWinning)
    {
        ParsedBoard winningBoard;
        var parts = input.Split(NewLine + NewLine);
        var numbers = parts.First().Split(",").Select(n => Convert.ToInt32(n)).ToList();
        // Assert.That(numbers, Is.EqualTo(new[] { 7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1 }));

        var boards = parts.Skip(1);
        var parsedBoards = boards.Select(board =>
        {
            var linesStrings = board.Split(NewLine);
            var boardArr = linesStrings.Select(line =>
            {
                var splitNumbersStrings = Regex.Split(line, @"\s+");
                return splitNumbersStrings.Where(s => !string.IsNullOrWhiteSpace(s)).Select(n =>
                {
                    var numberAsInt = Convert.ToInt32(n);
                    return numberAsInt;
                }).ToArray();
            }).ToArray().To2D();
            Assert.That(boardArr.Length, Is.EqualTo(25));

            var boardMarks = InitMultiDimArray(false, 5, 5);

            return new ParsedBoard(boardArr, boardMarks);
        }).ToList();

        Assert.That(parsedBoards.First().Board.Rank, Is.EqualTo(2));
        Assert.That(parsedBoards.First().Marks.Rank, Is.EqualTo(2));
        // Assert.That(parsedBoards.First().board[3, 3], Is.EqualTo(18));

        var boardScores = MarkNumbersAndReturnWinningBoard(numbers, parsedBoards);

        winningBoard = getWinning ? boardScores.First() : boardScores.Last();
        winningNumber = winningBoard.WinningNumber ?? throw new Exception("Shit hits the fan yo.");        
            "winning board:".Print();
        winningBoard.Board.Print();
        winningBoard.Marks.Print();

        var score = CalculateScore(winningBoard, winningNumber);
        return score;
    }

    private int CalculateScore(ParsedBoard board, int number)
    {
        var unmarkedPositions = new List<int>();
        
        for (var i = 0; i < board.Board.GetLength(0); i++)
        for (var j = 0; j < board.Board.GetLength(1); j++)
            if(!board.Marks[i,j]) unmarkedPositions.Add(board.Board[i,j]);

        return unmarkedPositions.Sum() * number;
    }

    private static List<ParsedBoard> MarkNumbersAndReturnWinningBoard(List<int> numbers, List<ParsedBoard> parsedBoards)
    {
        var winningBoards = new List<ParsedBoard>();
        foreach (var currentNumber in numbers)
        {
            foreach (var board in parsedBoards)
            {
                if (winningBoards.Contains(board))
                {
                  continue;  
                }

                (int, int)? numberPosition = FindNumberInBoard(board.Board, currentNumber);
                if (numberPosition.HasValue)
                    board.Marks[numberPosition.Value.Item1, numberPosition.Value.Item2] = true;
                if (HasWon(board))
                {
                    board.WinningNumber = currentNumber;
                    winningBoards.Add(board);
                }
            }
        }

        return winningBoards;
    }
    
    private static bool HasWon(ParsedBoard parsedBoard)
    {
        for (var i = 0; i < 5; i++)
        {
            var column = Day03.GetColumn(parsedBoard.Marks, i);
            if (column.All(b => b)) return true;
        }
        
        for (var i = 0; i < 5; i++)
        {
            var row = Day03.GetRow(parsedBoard.Marks, i);
            if (row.All(b => b)) return true;
        }

        return false;
    }

    private static (int, int)? FindNumberInBoard(int[,] board, int number)
    {
        for (var i = 0; i < board.GetLength(0); i++)
        for (var j = 0; j < board.GetLength(1); j++)
            if (board[i, j] == number)
                return (i, j);
        return null;
    }

    private T[,] InitMultiDimArray<T>(T initValue, int width, int height)
    {
        var matrix = new T [width, height];

        for (var i = 0; i < width; i++)
        for (var j = 0; j < height; j++)
            matrix[i, j] = initValue;
        
        return matrix;
    }

    [Test, Explicit("Slow")]
    public override void RunPart1OnRealInput()
    {
        var score = CalculateScore(GetInputForDay(this), out _, true);

        Assert.That(score, Is.EqualTo(32844));
    }

    [Test]
    public override void TestPart2()
    {
        var score = CalculateScore(TestInput, out _, false);

        Assert.That(score, Is.EqualTo(1924));
    }

    [Test, Explicit("Slow")]
    public override void RunPart2OnRealInput()
    {
        var score = CalculateScore(GetInputForDay(this), out _, false);
        
        Assert.That(score, Is.LessThan(18850));
        Assert.That(score, Is.EqualTo(4920));
    }
}
