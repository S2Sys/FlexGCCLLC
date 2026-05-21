using System.Text.Json;
using FlexGCCLLC.WorkRequestTracker.Api.Endpoints;
using FlexGCCLLC.WorkRequestTracker.Application.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class ResultExtensionsTests
{
    [Fact]
    public async Task ToEndpointResult_ReturnsOkForSuccess()
    {
        var result = Result<string>.Success("created");
        var httpContext = CreateHttpContext();

        await result.ToEndpointResult().ExecuteAsync(httpContext);

        httpContext.Response.Body.Position = 0;
        var response = await JsonSerializer.DeserializeAsync<string>(httpContext.Response.Body);

        Assert.Equal(StatusCodes.Status200OK, httpContext.Response.StatusCode);
        Assert.Equal("created", response);
    }

    [Theory]
    [InlineData("NotFound", StatusCodes.Status404NotFound)]
    [InlineData("InvalidStatus", StatusCodes.Status400BadRequest)]
    [InlineData("InvalidPriority", StatusCodes.Status400BadRequest)]
    [InlineData("ValidationError", StatusCodes.Status400BadRequest)]
    public async Task ToEndpointResult_MapsKnownErrorsToExpectedStatusCodes(string code, int expectedStatusCode)
    {
        var result = Result<string>.Failure(code, "bad request");
        var httpContext = CreateHttpContext();

        await result.ToEndpointResult().ExecuteAsync(httpContext);

        httpContext.Response.Body.Position = 0;
        var error = await JsonSerializer.DeserializeAsync<ApiErrorResponse>(
            httpContext.Response.Body,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        Assert.Equal(expectedStatusCode, httpContext.Response.StatusCode);
        Assert.Equal(code, error?.Code);
    }

    private static DefaultHttpContext CreateHttpContext()
    {
        var services = new ServiceCollection()
            .AddLogging()
            .BuildServiceProvider();

        return new DefaultHttpContext
        {
            RequestServices = services,
            Response = { Body = new MemoryStream() }
        };
    }
}
