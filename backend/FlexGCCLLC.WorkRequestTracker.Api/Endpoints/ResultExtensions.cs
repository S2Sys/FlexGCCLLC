using FlexGCCLLC.WorkRequestTracker.Application.Common;

namespace FlexGCCLLC.WorkRequestTracker.Api.Endpoints;

public static class ResultExtensions
{
    public static IResult ToEndpointResult<T>(this Result<T> result)
    {
        if (result.IsSuccess)
            return Results.Ok(ApiResponse<T>.Ok(result.Value!));

        var statusCode = result.Error!.Code switch
        {
            "NotFound"        => StatusCodes.Status404NotFound,
            "InvalidStatus"   => StatusCodes.Status400BadRequest,
            "InvalidPriority" => StatusCodes.Status400BadRequest,
            "ValidationError" => StatusCodes.Status400BadRequest,
            _                 => StatusCodes.Status500InternalServerError
        };

        return Results.Json(ApiResponse<T>.Fail(result.Error), statusCode: statusCode);
    }
}
