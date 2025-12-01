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
            var passports = ParsePassports();
            // PrintPassports(passports);
            
            return passports.Count(RequiredFieldsPresent);
        }
        
        private IEnumerable<Dictionary<string, string>> ParsePassports()
        {
            return Input
                .Split(Environment.NewLine + Environment.NewLine)
                .Select(passportString => 
                    Regex.Split(passportString, Environment.NewLine + "| ", RegexOptions.IgnoreCase)
                        .ToDictionary(keyvalue=> 
                            keyvalue.Split(":")[0],
                            keyvalue=>keyvalue.Split(":")[1])
                        );
        }

        private static bool RequiredFieldsPresent(Dictionary<string, string> passport)
        {
            return passport.ContainsKey("byr") 
                   && passport.ContainsKey("iyr") 
                   && passport.ContainsKey("eyr") 
                   && passport.ContainsKey("hgt") 
                   && passport.ContainsKey("hcl") 
                   && passport.ContainsKey("ecl") 
                   && passport.ContainsKey("pid");
        }

        public override long Part2()
        {
            var passports = ParsePassports();
            // PrintPassports(passports);
            
            return passports.Count(IsValidPassport);
        }

        public static bool IsValidPassport(Dictionary<string, string> passport)
        {
            return RequiredFieldsPresent(passport)
                   && ValidBirthYear(passport["byr"])
                   && ValidIssueYear(passport["iyr"])
                   && ValidExpirationYear(passport["eyr"])
                   && ValidHeight(passport["hgt"])
                   && ValidHairColor(passport["hcl"])
                   && ValidEyeColor(passport["ecl"])
                   && ValidPassportId(passport["pid"]);
        }

        public static bool ValidBirthYear(string birthYear)
        {
            return Int64.Parse(birthYear)>=1920
                   && Int64.Parse(birthYear)<=2002;
        }

        public static bool ValidIssueYear(string issueYear)
        {
            return (Int64.Parse(issueYear)>=2010
                    && Int64.Parse(issueYear)<=2020);
        }
        
        public static bool ValidExpirationYear(string expirationYear)
        {
            return (Int64.Parse(expirationYear) >= 2020
                    && Int64.Parse(expirationYear) <= 2030);
        }
       
        public static bool ValidHeight(string height)
        {
            if (!Regex.IsMatch(height, @"(in|cm)")) return false;
            
            var splitHeight = Regex.Split(height, @"(\d+)(\D+)");
            var amount = Int64.Parse(splitHeight[1]);
            var unit = splitHeight[2];
            
            if (unit == "cm")
                return amount >= 150 && amount <= 193;
            if (unit == "in")
                return amount >= 59 && amount <= 76;
            
            throw new Exception("height did not contain cm or in");
        }

        public static bool ValidHairColor(string hairColor)
        {
            return Regex.IsMatch(hairColor, @"#[0-9a-f]{6}");
        }

        public static bool ValidEyeColor(string eyeColor)
        {
            return Regex.IsMatch(eyeColor, @"amb|blu|brn|gry|grn|hzl|oth");
        }

        public static bool ValidPassportId(string passportId)
        {
            return Regex.IsMatch(passportId, @"^\d{9}$");
        }
        
        private static void PrintPassports(IEnumerable<Dictionary<string, string>> passports)
        {
            foreach (var passport in passports)
            {
                PrintDict(passport);
                Console.WriteLine();
            }
        }

        private static void PrintDict(Dictionary<string, string> dict)
        {
            foreach (var (key, value) in dict)
            {
                Console.WriteLine("{0}:{1}", key, value);
            }
        }
    }
}