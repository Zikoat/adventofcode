
using System.Dynamic;
using NUnit.Framework;
using static System.Environment;
using QuikGraph;
using QuikGraph.Algorithms; // enables extension methods


namespace adventofcode2021;

public class Day12 : DayBase
{
    public override string TestInput => @"start-A
start-b
A-c
A-b
b-d
A-end
b-end";

    [Test]
    public override void TestPart1()
    {
        var input = TestInput;
        
        var finishedPaths = GetAmountOfPaths(input, false);

        Assert.That(finishedPaths,Is.EqualTo(10));
    }

    private int GetAmountOfPaths(string input, bool allowTwice)
    {
        var graph = ParseGraph(input);
        var paths = new Stack<List<string>>();
        paths.Push(new List<string> { "start" });
        var finishedPaths = new List<List<string>>();
        while (paths.TryPop(out var path))
        {
            if (path.Last() == "end")
            {
                finishedPaths.Add(path);
                continue;
            }

            var validEdges = GetValidEdgesToFollow(graph, path, allowTwice).ToList();
            foreach (var edge in validEdges)
            {
                var newPath = new List<string>(path) { edge };
                paths.Push(newPath);
            }
        }
        finishedPaths.Select(path=>path.ToString(",")).Print(NewLine);
        return finishedPaths.Count();
    }

    private static UndirectedGraph<string, Edge<string>> ParseGraph(string input)
    {
        var graph = input.Split(NewLine).Select(line =>
        {
            var edgeString = line.Split("-");
            var from = edgeString.First();
            var to = edgeString.Last();

            var edge = new Edge<string>(from, to);

            return edge;
        }).ToUndirectedGraph<string, Edge<string>>();
        return graph;
    }

    private List<string> GetValidEdgesToFollow(UndirectedGraph<string, Edge<string>> graph,
        List<string> path, bool allowTwice)
    {
        var duplicates = path.Where(IsSmallCave).Count() - path.Where(IsSmallCave).Distinct().Count();
        if (duplicates > 1) throw new Exception($"there are more than 2 duplicates in path {path.ToString(", ")}");
        var smallCaveHasBeenVisitedTwice = duplicates == 1;
        var currentPosition = path.Last();
        var edges = graph.AdjacentEdges(currentPosition);
        var validEdges = edges.Where(edge =>
        {
            var target = edge.GetOtherVertex(currentPosition);
            if (target == "start") return false; 
            if (IsSmallCave(target))
            {
                var seenBeforeCount = path.Count(vertex => vertex == target);
                if (seenBeforeCount == 0) return true;
                if (seenBeforeCount == 1 && !smallCaveHasBeenVisitedTwice && allowTwice) return true;
                return false;
            }

            return true;
        }).ToList();
        return validEdges.Select(edge=>edge.GetOtherVertex(currentPosition)).ToList();
    }

    private bool IsSmallCave(string vertex)
    {
        if (vertex.All(char.IsLower)) return true;
        if (vertex.All(char.IsUpper)) return false;
        throw new Exception($"cant determine sze of cave {vertex}");

    }

    [Test]
    public void TestSlightlyLarger()
    {
        var input = @"dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc";
        
        var paths = GetAmountOfPaths(input, false);
        
        Assert.That(paths, Is.EqualTo(19));
    }

    [Test, Explicit("Slow")]
    public void TestEvenLarger()
    {
        var input = @"fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW";

        var paths = GetAmountOfPaths(input, false);
        Assert.That(paths, Is.EqualTo(226));
    }
    
    [Test, Explicit("Slow")]
    public override void RunPart1OnRealInput()
    {
        Assert.That(GetAmountOfPaths(GetInputForDay(this), false), Is.EqualTo(5576));
    }

    [Test]
    public override void TestPart2()
    {
        var paths = GetAmountOfPaths(TestInput, true);
        
        Assert.That(paths,Is.EqualTo(36));
    }

    [Test, Explicit("Slow")]
    public override void RunPart2OnRealInput()
    {
        var paths = GetAmountOfPaths(GetInputForDay(this), true);
        
        Assert.That(paths,Is.EqualTo(152837));
    }
}
