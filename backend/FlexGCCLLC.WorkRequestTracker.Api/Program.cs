using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
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
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

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
