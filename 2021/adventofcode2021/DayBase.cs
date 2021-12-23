using System.Reflection;
using System.Text.RegularExpressions;
using NUnit.Framework;

namespace adventofcode2021;
[Parallelizable(ParallelScope.All)]
public abstract class DayBase
{
    public abstract string TestInput { get; }

    protected static string GetInputForDay(DayBase day)
    {
        var dayNumber = Convert.ToInt32(day.GetType().Name.Replace("Day", ""));
        var fileName = $"Day{dayNumber:00}Input.txt";
        var assembly = Assembly.GetExecutingAssembly();
        var moduleName = Regex.Replace(assembly.ManifestModule.Name, @"\.(exe|dll)$", string.Empty, RegexOptions.IgnoreCase);
        var resourceName = $"{moduleName}.{fileName}";
        using var stream = assembly.GetManifestResourceStream(resourceName);
        using var reader = new StreamReader(stream ?? throw new InvalidOperationException($"Could not read file {fileName}"));
        return reader.ReadToEnd();
    }

    public abstract void TestPart1();
    public abstract void RunPart1OnRealInput();
    public abstract void TestPart2();
    public abstract void RunPart2OnRealInput();
}