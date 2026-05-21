using FlexGCCLLC.WorkRequestTracker.Api.Middleware;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Infrastructure.Persistence;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IWorkRequestRepository>(services =>
{
    var configuration = services.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("WorkRequestTracker")
        ?? throw new InvalidOperationException("Connection string 'WorkRequestTracker' is required.");

    return new DapperWorkRequestRepository(connectionString);
});
builder.Services.AddScoped<WorkRequestService>();
builder.Services.AddHealthChecks();
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalFrontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
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

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
