using FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests.Events;

namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class DomainEventTests
{
    [Fact]
    public void RaiseCreated_AddsWorkRequestCreatedEvent()
    {
        var request = new WorkRequest { Title = "T", ClientName = "C" };
        request.RaiseCreated();
        var events = request.PullDomainEvents();
        Assert.Single(events);
        Assert.IsType<WorkRequestCreatedEvent>(events[0]);
    }

    [Fact]
    public void RaiseStatusChanged_AddsStatusChangedEvent()
    {
        var request = new WorkRequest { Id = 1, Status = WorkRequestStatus.New };
        request.RaiseStatusChanged(WorkRequestStatus.New, WorkRequestStatus.InProgress);
        var events = request.PullDomainEvents();
        Assert.Single(events);
        var evt = Assert.IsType<WorkRequestStatusChangedEvent>(events[0]);
        Assert.Equal(WorkRequestStatus.InProgress, evt.NewStatus);
    }

    [Fact]
    public void PullDomainEvents_ClearsAfterRead()
    {
        var request = new WorkRequest();
        request.RaiseCreated();
        request.PullDomainEvents();
        Assert.Empty(request.PullDomainEvents());
    }
}
