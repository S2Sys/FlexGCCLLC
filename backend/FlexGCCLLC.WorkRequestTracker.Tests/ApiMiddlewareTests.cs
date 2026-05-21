using System.Net;
using System.Text.Json;
using FlexGCCLLC.WorkRequestTracker.Api.Middleware;
using FlexGCCLLC.WorkRequestTracker.Application.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;

namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class ApiMiddlewareTests
{
    [Fact]
    public async Task RequestTracingMiddleware_AddsGeneratedCorrelationIdToResponseAndContext()
    {
        var context = new DefaultHttpContext();
        context.Request.Method = HttpMethods.Get;
        context.Request.Path = "/api/work-requests";

        var middleware = new RequestTracingMiddleware(
            next: httpContext =>
            {
                httpContext.Response.StatusCode = StatusCodes.Status204NoContent;
                return Task.CompletedTask;
            },
            NullLogger<RequestTracingMiddleware>.Instance);

        await middleware.InvokeAsync(context);

        Assert.True(context.Response.Headers.ContainsKey(RequestTracingMiddleware.CorrelationIdHeaderName));
        Assert.False(string.IsNullOrWhiteSpace(context.Response.Headers[RequestTracingMiddleware.CorrelationIdHeaderName]));
        Assert.Equal(
            context.Response.Headers[RequestTracingMiddleware.CorrelationIdHeaderName].ToString(),
            context.Items[RequestTracingMiddleware.CorrelationIdItemName]);
    }

    [Fact]
    public async Task RequestTracingMiddleware_UsesIncomingCorrelationId()
    {
        var context = new DefaultHttpContext();
        context.Request.Headers[RequestTracingMiddleware.CorrelationIdHeaderName] = "client-correlation-id";

        var middleware = new RequestTracingMiddleware(
            _ => Task.CompletedTask,
            NullLogger<RequestTracingMiddleware>.Instance);

        await middleware.InvokeAsync(context);

        Assert.Equal("client-correlation-id", context.Response.Headers[RequestTracingMiddleware.CorrelationIdHeaderName]);
        Assert.Equal("client-correlation-id", context.Items[RequestTracingMiddleware.CorrelationIdItemName]);
    }

    [Fact]
    public async Task GlobalExceptionMiddleware_ReturnsJsonErrorWithCorrelationId()
    {
        var context = new DefaultHttpContext();
        context.Items[RequestTracingMiddleware.CorrelationIdItemName] = "trace-123";
        context.Response.Body = new MemoryStream();

        var middleware = new GlobalExceptionMiddleware(
            _ => throw new InvalidOperationException("database unavailable"),
            NullLogger<GlobalExceptionMiddleware>.Instance);

        await middleware.InvokeAsync(context);

        context.Response.Body.Position = 0;
        var error = await JsonSerializer.DeserializeAsync<ApiErrorResponse>(
            context.Response.Body,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        Assert.Equal((int)HttpStatusCode.InternalServerError, context.Response.StatusCode);
        Assert.Equal("application/json", context.Response.ContentType);
        Assert.Equal("UnhandledException", error?.Code);
        Assert.Equal("An unexpected error occurred.", error?.Message);
        Assert.Contains("trace-123", error?.Details ?? []);
    }

    [Fact]
    public async Task TracingAndExceptionMiddleware_ReturnsCorrelationHeaderOnError()
    {
        var context = new DefaultHttpContext();
        context.Request.Method = HttpMethods.Get;
        context.Request.Path = "/api/work-requests";
        context.Request.Headers[RequestTracingMiddleware.CorrelationIdHeaderName] = "trace-456";
        context.Response.Body = new MemoryStream();

        var exceptionMiddleware = new GlobalExceptionMiddleware(
            _ => throw new InvalidOperationException("database unavailable"),
            NullLogger<GlobalExceptionMiddleware>.Instance);
        var tracingMiddleware = new RequestTracingMiddleware(
            exceptionMiddleware.InvokeAsync,
            NullLogger<RequestTracingMiddleware>.Instance);

        await tracingMiddleware.InvokeAsync(context);

        Assert.Equal("trace-456", context.Response.Headers[RequestTracingMiddleware.CorrelationIdHeaderName]);
        Assert.Equal((int)HttpStatusCode.InternalServerError, context.Response.StatusCode);
    }
}
