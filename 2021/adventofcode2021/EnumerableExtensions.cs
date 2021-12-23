namespace adventofcode2021;

public static class EnumerableExtensions
{
    public static void Print<T>(this IEnumerable<T> self, string separator = ", ")
    {
        Console.WriteLine(string.Join(separator, self));
    }
    public static void Print(this string self)
    {
        Console.WriteLine(self);
    }

    /// <summary>
    /// Joins all the elements in an IEnumerable using the specified separator
    /// </summary>
    /// <param name="self"></param>
    /// <param name="separator">The characters to use as separators, f.ex <code>Environment.NewLine</code>. Defaults to ", ".</param>
    /// <typeparam name="T"></typeparam>
    /// <returns>A string where every item is made into a string.</returns>
    public static string ToString<T>(this IEnumerable<T> self, string separator = ", ")
    {
        return string.Join(separator, self);
    }
    
    public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T> sequence)
    {
        return sequence.Where(e => e != null);
    }

    public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> sequence)
        where T : struct
    {
        return sequence.Where(e => e != null).Select(e => e.Value);
    }
    
    // https://stackoverflow.com/a/26291720/5936629
    public static T[,] To2D<T>(this IEnumerable<IEnumerable<T>> source)
    {
        try
        {
            var jaggedArray = source as IEnumerable<T>[] ?? source.ToArray();
            var firstDim = jaggedArray.Length;
            var secondDim = jaggedArray.GroupBy(row => row.Count()).Single().Key; // throws InvalidOperationException if source is not rectangular

            var result = new T[firstDim, secondDim];
            for (var i = 0; i < firstDim; ++i)
            for (var j = 0; j < secondDim; ++j)
                result[i, j] = jaggedArray.ElementAt(i).ElementAt(j);

            return result;
        }
        catch (InvalidOperationException e)
        {
            throw new InvalidOperationException("The given jagged array is not rectangular.", e);
        } 
    }


}