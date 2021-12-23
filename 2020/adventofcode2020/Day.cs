using System.IO;
using System.Text.RegularExpressions;

namespace adventofcode2020
{
    public abstract class Day
    {
        private readonly int _dayNumber;
        public string Input;

        protected Day(string? input)
        {
            _dayNumber = GetDayNumber();
            Input = input ?? GetFullInput();
        }
        
        private int GetDayNumber()
        {
            var className = GetType().Name;
            Regex dayExpression = new Regex(@"Day(?<dayNumber>\d{1,2})");
            var dayNumber = int.Parse(dayExpression.Match(className).Groups["dayNumber"].Value);
            return dayNumber;
        }

        private string GetFullInput()
        {
            return File.ReadAllText($"../../../..//adventofcode2020/day{_dayNumber}.txt");
        }

        public abstract long Part1();
        public abstract long Part2();
    }
}