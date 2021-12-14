using System.Text;
using static System.Console;

namespace adventofcode2021;

public static class MatrixExtensions
{
    public static TResult[,] Select<TSource, TResult>(this TSource[,] sourceMatrix, Func<TSource, TResult> selector)
    {
        var map = new TResult[sourceMatrix.GetLength(0),sourceMatrix.GetLength(1)];

        foreach (var (x, y, value) in EveryPointIn(sourceMatrix))
        {
            var newValue = selector(value);
            map[x, y] = newValue;
        }

        return map;
    }

    public static void Print<T>(this T[,] matrix)
    {
        var matrixString = matrix.ToString(" ");

        WriteLine(matrixString);
    }

    private static string ToString<T>(this T[,] matrix, string separator = " ")
    {
        // https://stackoverflow.com/a/12827010/5936629
        var rowLength = matrix.GetLength(0);
        var colLength = matrix.GetLength(1);

        var sb = new StringBuilder();
        for (var i = 0; i < rowLength; i++)
        {
            for (var j = 0; j < colLength; j++)
            {
                sb.Append($"{matrix[i, j]} ");
            }

            sb.AppendLine();
        }

        var matrixString = sb.ToString();
        return matrixString;
    }
    
    public static IEnumerable<(int x, int y, T value)> EveryPointIn<T>(this T[,] matrix)
    {
        var width = matrix.GetLength(0);
        var height = matrix.GetLength(1);

        for (var j = 0; j < height; j++)
        for (var i = 0; i < width; i++)
            yield return (i, j, matrix[i, j]);
    }

    public static T[,] Transpose<T>(this T[,] matrix)
    {
        var width = matrix.GetLength(0);
        var height = matrix.GetLength(1);

        var newArray = new T[height, width];
        for (var i = 0; i < height; i++)
        for (var j = 0; j < width; j++)
            newArray[i, j] = matrix[j, i];
        return newArray;
    }


    // todo move things here from day3, 4 and 9
}