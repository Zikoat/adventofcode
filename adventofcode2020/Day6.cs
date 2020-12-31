using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace adventofcode2020
{
    public class Day6:Day
    {
        private readonly Regex _allWhitespace = new Regex(@"\s+");

        public Day6(string? input) : base(input) { }

        public override long Part1()
        {
            return Input
                .Split(Environment.NewLine + Environment.NewLine)
                .Select(group => _allWhitespace.Replace(group, "").ToCharArray().ToHashSet())
                .Sum(group=>group.Count);
        }

        public override long Part2()
        {
            var groups = Input
                .Split(Environment.NewLine + Environment.NewLine)
                .Select(group => group.Split(Environment.NewLine)
                    .Select(person=>person.ToCharArray()));

            var total = 0;
            foreach (var group in groups)
            {
                var questionsEveryone = new HashSet<char>(group.First());
                foreach (var person in group)
                {
                    questionsEveryone.IntersectWith(person);
                }

                total += questionsEveryone.Count;
            }

            return total;
        }
    }
}