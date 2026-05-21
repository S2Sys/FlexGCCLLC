using FlexGCCLLC.WorkRequestTracker.Application.Common;
using Microsoft.AspNetCore.Mvc;

namespace FlexGCCLLC.WorkRequestTracker.Api.Controllers;

public static class ControllerResultExtensions
{
    public static ActionResult<T> ToActionResult<T>(this Result<T> result)
    {
        if (result.IsSuccess)
        {
            return new OkObjectResult(result.Value);
        }

        var statusCode = result.Error!.Code switch
        {
            "NotFound" => StatusCodes.Status404NotFound,
            "InvalidStatus" => StatusCodes.Status400BadRequest,
            "InvalidPriority" => StatusCodes.Status400BadRequest,
            "ValidationError" => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };

        return new ObjectResult(result.Error)
        {
            StatusCode = statusCode
        };
    }
}
