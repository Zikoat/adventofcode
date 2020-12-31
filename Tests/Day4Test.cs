using System;
using adventofcode2020;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Day4Test
    {
        private const string TestInput = @"ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in";

        private const string TestInput2Invalid = @"eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007";
        private const string TestInput2Valid = @"pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719";

        [Test]
        public void Part1()
        {
            Assert.AreEqual(2, new Day4(TestInput).Part1());
            Assert.AreEqual(264, new Day4(null).Part1());
        }
        
        [Test]
        public void Part2()
        {
            Assert.True(Day4.ValidBirthYear("2002"));
            Assert.False(Day4.ValidBirthYear("2003"));
            
            Assert.True(Day4.ValidHeight("60in"));
            Assert.True(Day4.ValidHeight("190cm"));
            Assert.False(Day4.ValidHeight("190in"));
            Assert.False(Day4.ValidHeight("190"));
            
            Assert.True(Day4.ValidHairColor("#123abc"));
            Assert.False(Day4.ValidHairColor("#123abz"));
            Assert.False(Day4.ValidHairColor("123abc"));
            
            Assert.True(Day4.ValidEyeColor("brn"));
            Assert.False(Day4.ValidEyeColor("wat"));
            
            Assert.True(Day4.ValidPassportId("000000001"));
            Assert.False(Day4.ValidPassportId("0123456789"));
            
            Assert.AreEqual(4, new Day4(TestInput2Valid).Part2());
            Assert.AreEqual(0, new Day4(TestInput2Invalid).Part2());

            Assert.AreEqual(new Day4(null).Part2(), 224);
        }
    }
}