using System;
using System.IO;
using System.Text.RegularExpressions;

namespace adventofcode2020
{
    public abstract class Day
    {
        public string input;
        private int _dayNumber;

        protected Day(string? input)
        {
            this.input = input;
            this.input ??= File.ReadAllText("../../../..//adventofcode2020/day2.txt");
            var dayNumber = GetDayNumber();
            _dayNumber = dayNumber;
        }

        public abstract int Part1();
        public abstract int Part2();
        private protected int GetDayNumber()
        {
            var className = GetType().Name;
            Regex dayExpression = new Regex(@"Day(?<dayNumber>\d{1,2})");
            var dayNumber = Int32.Parse(dayExpression.Match(className).Groups["dayNumber"].Value);
            return dayNumber;
        }

    }
}