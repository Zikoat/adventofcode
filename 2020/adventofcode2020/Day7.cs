using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace adventofcode2020
{
    public class Day7:Day

    {
        private IEnumerable<Bag>? _bags;

        public Day7(string? input) : base(input)
        {
        }

        public override long Part1()
        {
            _bags = ParseInput();
            _bags = AddParents(_bags);
            var bagsThatCanContainGolden = AllBagsReachableFrom("shiny golden");
            return bagsThatCanContainGolden.Count();
        }

        private IEnumerable<Bag> AllBagsReachableFrom(string initialBagId)
        {
            var initialBag = new HashSet<Bag>();
            initialBag.Enqueue(_bags.Single(bag => bag.Id == initialBagId));
            
            return RecursivelyAddReachableBags(initialBag);
        }

        private HashSet<Bag> RecursivelyAddReachableBags(HashSet<Bag> bagQueue)
        {
            var bag = bagQueue.Dequeue();
            foreach (var child in bag.Children)
            {
                
                var childBag = _bags.Single(bag => bag.Id == child);
            }
        }

        private static IEnumerable<Bag> AddParents(IEnumerable<Bag> bags)
        {
            bags = bags.ToList();
            foreach (var bag in bags)
            {
                foreach (var child in bag.Children)
                {
                    var childBag = bags.First(bag => bag.Id == child);
                    childBag.Parents.Add(bag.Id);
                }
            }

            return bags;
        }

        private IEnumerable<Bag> ParseInput()
        {
            return Input.Split(Environment.NewLine).Select(bagString=>
            {
                var bagId = Regex.Match(bagString, @"^(\w+ \w+)").Value;
                var childrenMatches = Regex.Matches(bagString, @"((\d+) ([a-z]+ [a-z]+))");
                var childrenIds = childrenMatches.Select(match => match.Groups[3].Value).ToList();
                return new Bag(bagId, childrenIds);
            });
        }

        public override long Part2()
        {
            throw new System.NotImplementedException();
        }
    }

    internal class Bag
    {
        public string Id { get; }
        public readonly List<string> Children;
        public List<string> Parents = new List<string>();

        public Bag(string id, List<string> children)
        {
            Id = id;
            Children = children;
        }

        
    }
}