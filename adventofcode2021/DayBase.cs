using System;
using System.IO;

namespace adventofcode2021;

public class DayBase
{
    protected static string GetInputForDay(int dayNumber)
    {
        var directory = Directory.GetParent(Environment.CurrentDirectory)?.Parent?.Parent?.FullName ??
                        throw new InvalidOperationException();
        return File.ReadAllText(Path.Join(directory, $"Day{dayNumber}Input.txt"));
    }
}