using System;
using System.Collections.Generic;
using System.Linq;

namespace adventofcode2021;

public static class EnumerableExtensions
{
    public static IEnumerable<(T item, int index)> WithIndex<T>(this IEnumerable<T> self)       
        => self.Select((item, index) => (item, index));
    
    public static void Print<T>(this IEnumerable<T> self, string separator = ", ")       
        => Console.WriteLine(string.Join(separator, self));
    
    public static string ToString<T>(this IEnumerable<T> self, string separator = ", ")       
        => string.Join(separator, self);

}