using FlexGCCLLC.WorkRequestTracker.Domain.Common;
using FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests.Events;

namespace FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests;

public sealed class WorkRequest : AggregateRoot
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public WorkRequestPriority Priority { get; set; }
    public WorkRequestStatus Status { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public List<WorkRequestNote> Notes { get; } = [];

    public void RaiseCreated() =>
        AddEvent(new WorkRequestCreatedEvent(Id, DateTime.UtcNow));

    public void RaiseStatusChanged(WorkRequestStatus previous, WorkRequestStatus next) =>
        AddEvent(new WorkRequestStatusChangedEvent(Id, previous, next, DateTime.UtcNow));
}
