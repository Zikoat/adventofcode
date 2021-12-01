using System;
using System.IO;

namespace adventofcode2021;

public abstract class DayBase
{
    protected static string GetInputForDay(int dayNumber)
    {
        var directory = Directory.GetParent(Environment.CurrentDirectory)?.Parent?.Parent?.FullName ??
                        throw new InvalidOperationException();
        return File.ReadAllText(Path.Join(directory, $"Day{dayNumber}Input.txt"));
    }

    public abstract string TestInput { get; }

    public abstract void TestPart1();
    public abstract void RunPart1OnRealInput();
    public abstract void TestPart2();
    public abstract void RunPart2OnRealInput();
}