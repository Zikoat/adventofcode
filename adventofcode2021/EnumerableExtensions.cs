namespace adventofcode2021;

public static class EnumerableExtensions
{
    public static void Print<T>(this IEnumerable<T> self, string separator = ", ")       
        => Console.WriteLine(string.Join(separator, self));
    
    public static string ToString<T>(this IEnumerable<T> self, string separator = ", ")       
        => string.Join(separator, self);

}