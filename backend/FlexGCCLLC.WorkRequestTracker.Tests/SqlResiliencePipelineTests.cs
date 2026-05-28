using FlexGCCLLC.WorkRequestTracker.Infrastructure.Resilience;
using Polly;

namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class SqlResiliencePipelineTests
{
    [Fact]
    public async Task Pipeline_SucceedsOnFirstTry()
    {
        var pipeline = SqlResiliencePipeline.Build();
        var result = await pipeline.ExecuteAsync(async _ =>
        {
            await Task.Yield();
            return 42;
        });
        Assert.Equal(42, result);
    }

    [Fact]
    public async Task Pipeline_RetriesOnTransientFailure()
    {
        var pipeline = SqlResiliencePipeline.Build();
        var attempts = 0;
        var result = await pipeline.ExecuteAsync(async _ =>
        {
            attempts++;
            if (attempts < 3) throw new TimeoutException("Transient");
            await Task.Yield();
            return attempts;
        });
        Assert.Equal(3, result);
    }
}
