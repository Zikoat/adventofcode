using NUnit.Framework;
using static System.Environment;

namespace adventofcode2021;

public class Day02 : DayBase
{
    public override string TestInput => @"forward 5
down 5
forward 8
up 3
down 8
forward 2";

    [Test]
    public override void TestPart1()
    {
        var commands = ParseInput(TestInput);

        var positionProduct = CalculatePosition(commands, out var horizontalPosition, out var depth);

        Assert.That(horizontalPosition, Is.EqualTo(15));
        Assert.That(depth, Is.EqualTo(10));
        Assert.That(positionProduct, Is.EqualTo(150));
    }

    private static int CalculatePosition(IEnumerable<MovementCommand> commands, out int horizontalPosition,
        out int depth)
    {
        horizontalPosition = 0;
        depth = 0;
        foreach (var command in commands)
            switch (command.Text)
            {
                case "forward":
                    horizontalPosition += command.Amount;
                    break;
                case "down":
                    depth += command.Amount;
                    break;
                case "up":
                    depth -= command.Amount;
                    break;
                default:
                    throw new Exception($"did not recognize commandtext {command.Text}");
            }

        depth.Print();
        horizontalPosition.Print();
        var positionProduct = horizontalPosition * depth;
        return positionProduct;
    }

    private IEnumerable<MovementCommand> ParseInput(string input)
    {
        var commands = input.Split(NewLine).Select(line =>
        {
            var linesplit = line.Split(" ");
            return new MovementCommand(linesplit.First(), Convert.ToInt32(linesplit.Last()));
        });
        return commands;
    }

    [Test]
    public override void RunPart1OnRealInput()
    {
        var positionProduct = CalculatePosition(ParseInput(GetInputForDay(this)), out _, out _);

        Assert.That(positionProduct, Is.EqualTo(1938402));
    }

    [Test]
    public override void TestPart2()
    {
        var positionProduct = CalculatePositionUsingAim(TestInput, out var horizontalPosition, out var depth);

        Assert.That(horizontalPosition, Is.EqualTo(15));
        Assert.That(depth, Is.EqualTo(60));
        Assert.That(positionProduct, Is.EqualTo(900));
    }

    private int CalculatePositionUsingAim(string input, out int horizontalPosition, out int depth)
    {
        var commands = ParseInput(input);
        horizontalPosition = 0;
        depth = 0;
        var aim = 0;
        foreach (var command in commands)
            switch (command.Text)
            {
                case "forward":
                    horizontalPosition += command.Amount;
                    depth += aim * command.Amount;
                    break;
                case "down":
                    aim += command.Amount;
                    break;
                case "up":
                    aim -= command.Amount;
                    break;
                default:
                    throw new Exception($"did not recognize commandtext {command.Text}");
            }

        depth.Print();
        horizontalPosition.Print();
        var positionProduct = horizontalPosition * depth;
        return positionProduct;
    }

    [Test]
    public override void RunPart2OnRealInput()
    {
        var positionProduct = CalculatePositionUsingAim(GetInputForDay(this), out _, out _);
        Assert.That(positionProduct, Is.EqualTo(1947878632));
    }

    private class MovementCommand
    {
        public MovementCommand(string text, int amount)
        {
            Text = text;
            Amount = amount;
        }

        public string Text { get; }
        public int Amount { get; }
    }
}