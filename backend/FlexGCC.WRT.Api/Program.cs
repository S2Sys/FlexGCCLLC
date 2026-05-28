using FlexGCC.WRT.Api.Endpoints;
using FlexGCC.WRT.Api.Middleware;
using FlexGCC.WRT.Application.Common;
using FlexGCC.WRT.Application.WorkRequests;
using FlexGCC.WRT.Infrastructure.Persistence;
using FlexGCC.WRT.Infrastructure.Resilience;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<Func<IDbConnection>>(services =>
{
    var configuration = services.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("WorkRequestTracker")
        ?? throw new InvalidOperationException("Connection string 'WorkRequestTracker' is required.");
    var pipeline = SqlResiliencePipeline.Build();
    return () =>
    {
        var conn = new SqlConnection(connectionString);
        pipeline.Execute(() => conn.Open());
        return conn;
    };
});
builder.Services.AddScoped<IUnitOfWork>(sp =>
    new UnitOfWork(sp.GetRequiredService<Func<IDbConnection>>()));
builder.Services.AddScoped<WorkRequestRepository>();
builder.Services.AddScoped<IWorkRequestRepository>(sp =>
    new LoggingWorkRequestRepository(
        sp.GetRequiredService<WorkRequestRepository>(),
        sp.GetRequiredService<ILogger<LoggingWorkRequestRepository>>()));
builder.Services.AddScoped<IOutboxRepository, OutboxRepository>();
builder.Services.AddScoped<WorkRequestService>();
builder.Services.AddHealthChecks();
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalFrontend", policy =>
        policy.WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5174")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseMiddleware<RequestTracingMiddleware>();
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Work Request Tracker API v1");
});

app.UseHttpsRedirection();

app.UseCors("LocalFrontend");

app.MapWorkRequestEndpoints();
app.MapHealthChecks("/health");

app.Run();


