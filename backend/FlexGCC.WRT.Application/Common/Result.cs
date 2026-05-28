namespace FlexGCC.WRT.Application.Common;

public sealed class Result<T>
{
    private Result(T? value, ApiErrorResponse? error)
    {
        Value = value;
        Error = error;
    }

    public T? Value { get; }

    public ApiErrorResponse? Error { get; }

    public bool IsSuccess => Error is null;

    public static Result<T> Success(T value) => new(value, null);

    public static Result<T> Failure(string code, string message, IReadOnlyList<string>? details = null) =>
        new(default, new ApiErrorResponse(code, message, details ?? Array.Empty<string>()));
}

