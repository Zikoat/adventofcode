using System.Reflection;
using System.Text.RegularExpressions;

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
        if (false) return GetInputForDay(dayNumber);
        var fileName = $"Day{dayNumber:00}Input.txt";
        var assembly = Assembly.GetExecutingAssembly();
        var moduleName = Regex.Replace(assembly.ManifestModule.Name, @"\.(exe|dll)$", string.Empty, RegexOptions.IgnoreCase);
        var resourceName = $"{moduleName}.{fileName}";
        using var stream = assembly.GetManifestResourceStream(resourceName);
        using var reader = new StreamReader(stream ?? throw new InvalidOperationException());
        return reader.ReadToEnd();
    }

    public abstract void TestPart1();
    public abstract void RunPart1OnRealInput();
    public abstract void TestPart2();
    public abstract void RunPart2OnRealInput();
}