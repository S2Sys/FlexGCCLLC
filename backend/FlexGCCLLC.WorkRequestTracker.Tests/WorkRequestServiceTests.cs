using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Dtos;
using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Models;

namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class WorkRequestServiceTests
{
    [Fact]
    public void Create_rejects_missing_title()
    {
        var service = new WorkRequestService(new InMemoryWorkRequestRepository());

        var result = service.Create(new CreateWorkRequestRequest(
            "",
            "Acme",
            "Need a tracker",
            WorkRequestPriority.High,
            WorkRequestStatus.New,
            DateTime.UtcNow.AddDays(1)));

        Assert.False(result.IsSuccess);
        Assert.Equal("ValidationError", result.Error?.Code);
    }

    [Fact]
    public void Update_status_changes_status_and_updated_date()
    {
        var service = new WorkRequestService(new InMemoryWorkRequestRepository());
        var created = service.Create(new CreateWorkRequestRequest(
            "Build tracker",
            "Acme",
            "Need a tracker",
            WorkRequestPriority.Medium,
            WorkRequestStatus.New,
            DateTime.UtcNow.AddDays(1))).Value!;

        var result = service.UpdateStatus(created.Id, new UpdateWorkRequestStatusRequest(WorkRequestStatus.InProgress));

        Assert.True(result.IsSuccess);
        Assert.Equal(WorkRequestStatus.InProgress, result.Value!.Status);
        Assert.True(result.Value.UpdatedDate >= created.UpdatedDate);
    }
}
