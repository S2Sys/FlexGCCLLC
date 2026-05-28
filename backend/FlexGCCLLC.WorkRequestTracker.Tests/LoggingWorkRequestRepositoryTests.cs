using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Infrastructure.Persistence;
using Microsoft.Extensions.Logging;

namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class LoggingWorkRequestRepositoryTests
{
    private sealed class CountingLogger : ILogger<LoggingWorkRequestRepository>
    {
        public int LogCount { get; private set; }
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => true;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state,
            Exception? exception, Func<TState, Exception?, string> formatter) => LogCount++;
    }

    private static (LoggingWorkRequestRepository, CountingLogger) Build()
    {
        var logger = new CountingLogger();
        var inner = new InMemoryWorkRequestRepository();
        return (new LoggingWorkRequestRepository(inner, logger), logger);
    }

    [Fact]
    public void GetAll_LogsOneEntry()
    {
        var (repo, logger) = Build();
        repo.GetAll();
        Assert.Equal(1, logger.LogCount);
    }

    [Fact]
    public void Add_LogsOneEntry()
    {
        var (repo, logger) = Build();
        repo.Add(new WorkRequest { Title = "T", ClientName = "C", Description = "D",
            DueDate = DateTime.UtcNow.AddDays(1), CreatedDate = DateTime.UtcNow, UpdatedDate = DateTime.UtcNow });
        Assert.Equal(1, logger.LogCount);
    }
}
