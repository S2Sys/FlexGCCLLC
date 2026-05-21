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

    [Fact]
    public void SqlClient_is_only_used_at_api_composition_root()
    {
        var backendRoot = FindBackendRoot();
        var repositoryPath = Path.Combine(
            backendRoot,
            "FlexGCCLLC.WorkRequestTracker.Infrastructure",
            "Persistence",
            "DapperWorkRequestRepository.cs");
        var programPath = Path.Combine(
            backendRoot,
            "FlexGCCLLC.WorkRequestTracker.Api",
            "Program.cs");

        var repositorySource = File.ReadAllText(repositoryPath);
        var programSource = File.ReadAllText(programPath);

        Assert.DoesNotContain("Microsoft.Data.SqlClient", repositorySource);
        Assert.Contains("IDbConnection", repositorySource);
        Assert.Contains("Microsoft.Data.SqlClient", programSource);
        Assert.Contains("IDbConnection", programSource);
    }

    [Fact]
    public void Api_uses_minimal_api_routes_with_versioned_v1_prefix()
    {
        var backendRoot = FindBackendRoot();
        var apiRoot = Path.Combine(backendRoot, "FlexGCCLLC.WorkRequestTracker.Api");
        var programSource = File.ReadAllText(Path.Combine(apiRoot, "Program.cs"));
        var controllerPath = Path.Combine(apiRoot, "Controllers", "WorkRequestsController.cs");

        Assert.False(File.Exists(controllerPath));
        Assert.DoesNotContain("AddControllers", programSource);
        Assert.DoesNotContain("MapControllers", programSource);
        Assert.Contains("MapWorkRequestEndpoints", programSource);
        Assert.Contains("/api/v1/work-requests", File.ReadAllText(Path.Combine(apiRoot, "Endpoints", "WorkRequestEndpoints.cs")));
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
