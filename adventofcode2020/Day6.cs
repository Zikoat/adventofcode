using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace adventofcode2020
{
    public class Day6 : Day
    {
        private readonly Regex _allWhitespace = new Regex(@"\s+");

        public Day6(string? input) : base(input)
        {
        }

        public override long Part1()
        {
            return Input
                .Split(Environment.NewLine + Environment.NewLine)
                .Select(group => _allWhitespace.Replace(group, "").ToCharArray().ToHashSet())
                .Sum(group => group.Count);
        }

        public override long Part2()
        {
            return Input
                .Split(Environment.NewLine + Environment.NewLine)
                .Select(group => group.Split(Environment.NewLine)
                    .Select(person => person.ToList()))
                .Select(IntersectMultipleLists)
                .Select(questions=>questions.Count)
                .Sum();
        }

        private static HashSet<T> IntersectMultipleLists<T>(IEnumerable<IEnumerable<T>> lists)
        {
            lists = lists.ToList();
            var intersection = new HashSet<T>(lists.First());
            foreach (var person in lists) intersection.IntersectWith(person);
            return intersection;
        }
    }
}