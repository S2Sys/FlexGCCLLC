namespace FlexGCCLLC.WorkRequestTracker.Application.Common;

public sealed class ApiResponse<T>
{
    // Required for JSON deserialization
    public ApiResponse()
    {
        Success = false;
        Data = default;
        Error = null;
    }

    private ApiResponse(bool success, T? data, ApiErrorResponse? error)
    {
        Success = success;
        Data = data;
        Error = error;
    }

    public bool Success { get; init; }
    public T? Data { get; init; }
    public ApiErrorResponse? Error { get; init; }

    public static ApiResponse<T> Ok(T data) => new(true, data, null);
    public static ApiResponse<T> Fail(ApiErrorResponse error) => new(false, default, error);
}
