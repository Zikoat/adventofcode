using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace adventofcode2020
{
    public class Day2 : Day
    {
        private const string RegexPattern = @"(\d+)-(\d+) ([a-z]): ([a-z]*)";

        public Day2(string? input) : base(input)
        {
            Console.WriteLine("hello from day 2");
        }

        public override int Part1()
        {
            var passwords = StringToPasswordTuples(input);

            var output = passwords.Count(IsValidBetween);

            return output;
        }

        public override int Part2()
        {
            var passwords = StringToPasswordTuples(input);
            var output = passwords.Count(IsValidAtPosition);
            
            return output;
        }

        public static IEnumerable<(int, int, char, string)> StringToPasswordTuples(string input)
        {
            List<(int, int, char, string)> passwordTuples = new List<(int, int, char, string)>();
            
            var matches = Regex.Matches(input, RegexPattern);
            
            foreach (Match m in matches)
            {
                var passwordTuple = MatchToPasswordTuple(m);
                passwordTuples.Add(passwordTuple);
            }

            return passwordTuples;
        }

        private static (int min, int max, char character, string password) MatchToPasswordTuple(Match m)
        {
            int min = Int32.Parse(m.Groups[1].Value);
            int max = Int32.Parse(m.Groups[2].Value);
            char character = char.Parse(m.Groups[3].Value);
            string password = m.Groups[4].Value;

            return (min, max, character, password);
        }
        
        public static bool IsValidBetween((int min, int max, char character, string password) passwordTuple)
        {
            int characterCount = passwordTuple.password.Count(character => character == passwordTuple.character);
            return characterCount >= passwordTuple.min && characterCount <= passwordTuple.max;
        }
        
        public static bool IsValidAtPosition((int min, int max, char character, string password) passwordTuple)
        {
            var (min, max, character, password) = passwordTuple;
            
            return password[min-1] == character ^ password[max-1] == character;
            
        }

    }
}