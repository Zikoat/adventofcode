using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace adventofcode2020
{
    public class Day2 : Day
    {
        private const string RegexPattern = @"(\d+)-(\d+) ([a-z]): ([a-z]*)";

        public Day2(string? input) : base(input)
        {
        }

        public override long Part1()
        {
            var passwords = GetPasswordTuples();
            var output = passwords.Count(IsValidBetween);

            return output;
        }

        public override long Part2()
        {
            var passwords = GetPasswordTuples();
            var output = passwords.Count(IsValidAtPosition);

            return output;
        }

        public IEnumerable<(int, int, char, string)> GetPasswordTuples()
        {
            return Regex.Matches(Input, RegexPattern).Select(MatchToPasswordTuple);
        }

        private static (int min, int max, char character, string password) MatchToPasswordTuple(Match m)
        {
            var min = int.Parse(m.Groups[1].Value);
            var max = int.Parse(m.Groups[2].Value);
            var character = char.Parse(m.Groups[3].Value);
            string password = m.Groups[4].Value;

            return (min, max, character, password);
        }

        public static bool IsValidBetween((int min, int max, char character, string password) passwordTuple)
        {
            var characterCount = passwordTuple.password.Count(character => character == passwordTuple.character);
            return characterCount >= passwordTuple.min && characterCount <= passwordTuple.max;
        }

        public static bool IsValidAtPosition((int min, int max, char character, string password) passwordTuple)
        {
            var (min, max, character, password) = passwordTuple;

            return (password[min - 1] == character) ^ (password[max - 1] == character);
        }
    }
}