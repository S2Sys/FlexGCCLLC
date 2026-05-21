using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<IWorkRequestRepository, InMemoryWorkRequestRepository>();
builder.Services.AddScoped<WorkRequestService>();
builder.Services.AddHealthChecks();
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors("LocalFrontend");

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
