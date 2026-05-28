using FlexGCCLLC.WorkRequestTracker.Domain.Common;

namespace FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests.Events;

public sealed record WorkRequestStatusChangedEvent(
    int WorkRequestId,
    WorkRequestStatus PreviousStatus,
    WorkRequestStatus NewStatus,
    DateTime OccurredAt) : IDomainEvent;
