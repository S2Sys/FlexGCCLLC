using System.Diagnostics;

namespace FlexGCC.WRT.Api.Middleware;

public sealed class RequestTracingMiddleware
{
    public const string CorrelationIdHeaderName = "X-Correlation-Id";
    public const string CorrelationIdItemName = "CorrelationId";

    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTracingMiddleware> _logger;

    public RequestTracingMiddleware(RequestDelegate next, ILogger<RequestTracingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = GetOrCreateCorrelationId(context);
        context.Items[CorrelationIdItemName] = correlationId;
        context.Response.Headers[CorrelationIdHeaderName] = correlationId;

        var stopwatch = Stopwatch.StartNew();
        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            _logger.LogInformation(
                "HTTP {Method} {Path} responded {StatusCode} in {ElapsedMilliseconds} ms with correlation id {CorrelationId}",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                stopwatch.ElapsedMilliseconds,
                correlationId);
        }
    }

    private static string GetOrCreateCorrelationId(HttpContext context)
    {
        var incomingCorrelationId = context.Request.Headers[CorrelationIdHeaderName].FirstOrDefault();
        return string.IsNullOrWhiteSpace(incomingCorrelationId)
            ? Guid.NewGuid().ToString("N")
            : incomingCorrelationId;
    }
}

