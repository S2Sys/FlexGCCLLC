using FlexGCCLLC.WorkRequestTracker.Api.Controllers;
using FlexGCCLLC.WorkRequestTracker.Application.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class ControllerResultExtensionsTests
{
    [Fact]
    public void ToActionResult_ReturnsOkForSuccess()
    {
        var result = Result<string>.Success("created");

        var actionResult = result.ToActionResult();

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        Assert.Equal("created", okResult.Value);
    }

    [Theory]
    [InlineData("NotFound", StatusCodes.Status404NotFound)]
    [InlineData("InvalidStatus", StatusCodes.Status400BadRequest)]
    [InlineData("InvalidPriority", StatusCodes.Status400BadRequest)]
    [InlineData("ValidationError", StatusCodes.Status400BadRequest)]
    public void ToActionResult_MapsKnownErrorsToExpectedStatusCodes(string code, int expectedStatusCode)
    {
        var result = Result<string>.Failure(code, "bad request");

        var actionResult = result.ToActionResult();

        var objectResult = Assert.IsType<ObjectResult>(actionResult.Result);
        Assert.Equal(expectedStatusCode, objectResult.StatusCode);
        Assert.Equal(code, Assert.IsType<ApiErrorResponse>(objectResult.Value).Code);
    }
}
