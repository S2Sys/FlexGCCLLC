using System.Text.Json.Serialization;

namespace FlexGCC.WRT.Application.Common;

public sealed class ApiResponse<T>
{
    [JsonConstructor]
    private ApiResponse(bool success, T? data, ApiErrorResponse? error)
    {
        Success = success;
        Data = data;
        Error = error;
    }

    public bool Success { get; }
    public T? Data { get; }
    public ApiErrorResponse? Error { get; }

    public static ApiResponse<T> Ok(T data) => new(true, data, null);
    public static ApiResponse<T> Fail(ApiErrorResponse error) => new(false, default, error);
}

