namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class ArchitectureTests
{
    [Fact]
    public void Backend_is_split_into_clean_architecture_projects()
    {
        var backendRoot = FindBackendRoot();

        Assert.True(File.Exists(Path.Combine(backendRoot, "FlexGCCLLC.WorkRequestTracker.Domain", "FlexGCCLLC.WorkRequestTracker.Domain.csproj")));
        Assert.True(File.Exists(Path.Combine(backendRoot, "FlexGCCLLC.WorkRequestTracker.Application", "FlexGCCLLC.WorkRequestTracker.Application.csproj")));
        Assert.True(File.Exists(Path.Combine(backendRoot, "FlexGCCLLC.WorkRequestTracker.Infrastructure", "FlexGCCLLC.WorkRequestTracker.Infrastructure.csproj")));
    }

    [Fact]
    public void Dapper_repository_uses_stored_procedures_only()
    {
        var backendRoot = FindBackendRoot();
        var repositoryPath = Path.Combine(
            backendRoot,
            "FlexGCCLLC.WorkRequestTracker.Infrastructure",
            "Persistence",
            "DapperWorkRequestRepository.cs");

        Assert.True(File.Exists(repositoryPath));

        var repositorySource = File.ReadAllText(repositoryPath);

        Assert.Contains("CommandType.StoredProcedure", repositorySource);
        Assert.DoesNotContain("SELECT ", repositorySource, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("INSERT ", repositorySource, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("UPDATE ", repositorySource, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("DELETE ", repositorySource, StringComparison.OrdinalIgnoreCase);
    }

    private static string FindBackendRoot()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);

        while (directory is not null && !Directory.Exists(Path.Combine(directory.FullName, "backend")))
        {
            directory = directory.Parent;
        }

        Assert.NotNull(directory);
        return Path.Combine(directory!.FullName, "backend");
    }
}
