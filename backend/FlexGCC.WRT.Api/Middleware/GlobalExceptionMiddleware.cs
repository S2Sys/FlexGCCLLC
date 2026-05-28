using System.Text.Json;
using FlexGCC.WRT.Application.Common;

namespace FlexGCC.WRT.Api.Middleware;

public sealed class GlobalExceptionMiddleware
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            if (context.Response.HasStarted)
            {
                throw;
            }

            var correlationId = context.Items[RequestTracingMiddleware.CorrelationIdItemName]?.ToString();
            _logger.LogError(exception, "Unhandled exception for correlation id {CorrelationId}", correlationId);

            context.Response.Clear();
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var details = string.IsNullOrWhiteSpace(correlationId)
                ? Array.Empty<string>()
                : [correlationId];
            if (!string.IsNullOrWhiteSpace(correlationId))
            {
                context.Response.Headers[RequestTracingMiddleware.CorrelationIdHeaderName] = correlationId;
            }

            var error = new ApiErrorResponse(
                "UnhandledException",
                "An unexpected error occurred.",
                details);

            await JsonSerializer.SerializeAsync(context.Response.Body, error, JsonOptions, context.RequestAborted);
        }
    }
}

