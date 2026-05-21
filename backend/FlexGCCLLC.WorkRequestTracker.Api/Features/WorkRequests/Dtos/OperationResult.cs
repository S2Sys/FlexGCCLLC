namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Dtos;

public sealed class OperationResult<T>
{
    private OperationResult(T? value, ApiErrorResponse? error)
    {
        Value = value;
        Error = error;
    }

    public T? Value { get; }

    public ApiErrorResponse? Error { get; }

    public bool IsSuccess => Error is null;

    public static OperationResult<T> Success(T value) => new(value, null);

    public static OperationResult<T> Failure(string code, string message, IReadOnlyList<string>? details = null) =>
        new(default, new ApiErrorResponse(code, message, details ?? Array.Empty<string>()));
}
