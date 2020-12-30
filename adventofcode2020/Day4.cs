using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace adventofcode2020
{
    public class Day4 : Day
    {
        public Day4(string? input) : base(input)
        {
        }

        public override long Part1()
        {
            var passports = Input.Split(Environment.NewLine + Environment.NewLine).Select(passportString =>
                Regex.Split(passportString, Environment.NewLine + "| ", RegexOptions.IgnoreCase).ToDictionary(keyvalue=> keyvalue.Split(":")[0],keyvalue=>keyvalue.Split(":")[1]));

            // PrintPassports(passports);

            var totalValid = 0;
            foreach (var passport in passports)
            {
                if (
                    passport.ContainsKey("byr") 
                    && passport.ContainsKey("iyr") 
                    && passport.ContainsKey("eyr") 
                    && passport.ContainsKey("hgt") 
                    && passport.ContainsKey("hcl") 
                    && passport.ContainsKey("ecl") 
                    && passport.ContainsKey("pid") 
                    // && passport.ContainsKey("cid")
                    && Int64.Parse(passport["byr"])>=1920
                    && Int64.Parse(passport["byr"])<=2002
                    && Int64.Parse(passport["iyr"])>=2010
                    && Int64.Parse(passport["iyr"])<=2020
                    && Int64.Parse(passport["eyr"])>=2020
                    && Int64.Parse(passport["eyr"])<=2030
                    && ValidateHeight(passport["hgt"])
                    && Regex.IsMatch(passport["hcl"],@"#[0-9a-f]{6}")
                    && Regex.IsMatch(passport["ecl"], @"amb|blu|brn|gry|grn|hzl|oth")
                    && Regex.IsMatch(passport["pid"],@"\d{9}")
                )
                {
                    totalValid++;
                }
                     
            }
            return totalValid;
        }

        private static bool ValidateHeight(string height)
        {
            var splitHeight = Regex.Split(height, @"(\d+)(\D+)");
            var amount = Int64.Parse(splitHeight[1]);
            var unit = splitHeight[2];
            
            if (unit == "cm")
                return amount >= 150 && amount <= 193;
            if (unit == "in")
                return amount >= 59 && amount <= 76;
            
            throw new Exception("height did not contain cm or in");
        }

        private static void PrintPassports(IEnumerable<Dictionary<string, string>> passports)
        {
            foreach (var passport in passports)
            {
                PrintDict(passport);
                Console.WriteLine();
            }
        }

        public override long Part2()
        {
            throw new System.NotImplementedException();
        }

        public static void PrintDict(Dictionary<string, string> dict)
        {
            foreach (KeyValuePair<string, string> kvp in dict)
            {
                //textBox3.Text += ("Key = {0}, Value = {1}", kvp.Key, kvp.Value);
                Console.WriteLine("{0}:{1}", kvp.Key, kvp.Value);
            }

        }
    }
}