using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace adventofcode2020
{
    public class Day5 : Day
    {
        private const string SeatPattern = @"(F|B){7}(R|L){3}";

        public Day5(string? input) : base(input)
        {
        }

        public override long Part1()
        {
            return ParseSeats().Max();
        }

        private IEnumerable<long> ParseSeats()
        {
            return Input.Split(Environment.NewLine).Select(GetSeatId);
        }

        public override long Part2()
        {
            return FindGaps(ParseSeats()).Single() + 1;
        }

        private static IEnumerable<long> FindGaps(IEnumerable<long> seats)
        {
            var seatsList = seats.ToList();
            seatsList.Sort();
            var validSeats = new List<long>();

            for (var i = 0; i < seatsList.Count - 1; i++)
                if (seatsList[i + 1] - seatsList[i] > 1)
                    validSeats.Add(seatsList[i]);

            return validSeats;
        }

        public static long GetSeatId(string seatLabel)
        {
            if (!Regex.IsMatch(seatLabel, SeatPattern))
                throw new ArgumentException($"The seat {seatLabel} does not match regex: {SeatPattern}");

            seatLabel = Regex.Replace(seatLabel, @"B|R", "1");
            seatLabel = Regex.Replace(seatLabel, @"F|L", "0");
            
            return Convert.ToInt64(seatLabel, 2);
        }
    }
}