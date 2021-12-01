namespace adventofcode2021;

public abstract class DayBase
{
    public abstract string TestInput { get; }

    private static string GetInputForDay(int dayNumber)
    {
        var directory = Directory.GetParent(Environment.CurrentDirectory)?.Parent?.Parent?.FullName ??
                        throw new InvalidOperationException();
        return File.ReadAllText(Path.Join(directory, $"Day{dayNumber:00}Input.txt"));
    }

    protected static string GetInputForDay(DayBase day)
    {
        var dayNumber = Convert.ToInt32(day.GetType().Name.Replace("Day", ""));
        return GetInputForDay(dayNumber);
    }

    public abstract void TestPart1();
    public abstract void RunPart1OnRealInput();
    public abstract void TestPart2();
    public abstract void RunPart2OnRealInput();
}