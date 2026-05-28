using FlexGCC.WRT.Application.WorkRequests;
using FlexGCC.WRT.Application.WorkRequests.Contracts;
using FlexGCC.WRT.Infrastructure.Persistence;

namespace FlexGCC.WRT.Tests;

public class WorkRequestServiceUpdateTests
{
    private static WorkRequestService BuildService() =>
        new(new InMemoryWorkRequestRepository());

    [Fact]
    public void Update_WithValidRequest_ReturnsUpdatedDto()
    {
        var service = BuildService();
        var created = service.Create(new CreateWorkRequestRequest(
            "Original", "Client", "Desc",
            WorkRequestPriority.Low, WorkRequestStatus.New,
            DateTime.UtcNow.AddDays(7)));
        Assert.True(created.IsSuccess);

        var result = service.Update(created.Value!.Id, new UpdateWorkRequestRequest(
            "Updated Title", "New Client", "New Desc",
            WorkRequestPriority.High, DateTime.UtcNow.AddDays(14)));

        Assert.True(result.IsSuccess);
        Assert.Equal("Updated Title", result.Value!.Title);
        Assert.Equal("New Client", result.Value.ClientName);
        Assert.Equal(WorkRequestPriority.High, result.Value.Priority);
    }

    [Fact]
    public void Update_WithUnknownId_ReturnsNotFound()
    {
        var service = BuildService();
        var result = service.Update(999, new UpdateWorkRequestRequest(
            "T", "C", "D", WorkRequestPriority.Low, DateTime.UtcNow.AddDays(1)));
        Assert.False(result.IsSuccess);
        Assert.Equal("NotFound", result.Error!.Code);
    }

    [Fact]
    public void Update_WithEmptyTitle_ReturnsValidationError()
    {
        var service = BuildService();
        var created = service.Create(new CreateWorkRequestRequest(
            "T", "C", "D", WorkRequestPriority.Low, WorkRequestStatus.New,
            DateTime.UtcNow.AddDays(7)));

        var result = service.Update(created.Value!.Id, new UpdateWorkRequestRequest(
            "", "C", "D", WorkRequestPriority.Low, DateTime.UtcNow.AddDays(1)));

        Assert.False(result.IsSuccess);
        Assert.Equal("ValidationError", result.Error!.Code);
    }
}

