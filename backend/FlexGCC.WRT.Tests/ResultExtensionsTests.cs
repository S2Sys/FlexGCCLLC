using System.Text.Json;
using FlexGCC.WRT.Api.Endpoints;
using FlexGCC.WRT.Application.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace FlexGCC.WRT.Tests;

public class ResultExtensionsTests
{
    [Fact]
    public async Task ToEndpointResult_ReturnsOkForSuccess()
    {
        var result = Result<string>.Success("created");
        var httpContext = CreateHttpContext();

        await result.ToEndpointResult().ExecuteAsync(httpContext);

        httpContext.Response.Body.Position = 0;
        var response = await JsonSerializer.DeserializeAsync<ApiResponse<string>>(
            httpContext.Response.Body,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        Assert.Equal(StatusCodes.Status200OK, httpContext.Response.StatusCode);
        Assert.True(response!.Success);
        Assert.Equal("created", response.Data);
        Assert.Null(response.Error);
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
        var response = await JsonSerializer.DeserializeAsync<ApiResponse<string>>(
            httpContext.Response.Body,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        Assert.Equal(expectedStatusCode, httpContext.Response.StatusCode);
        Assert.False(response!.Success);
        Assert.Null(response.Data);
        Assert.Equal(code, response.Error?.Code);
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

