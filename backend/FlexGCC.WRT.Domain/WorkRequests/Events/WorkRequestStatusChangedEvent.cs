using FlexGCC.WRT.Domain.Common;

namespace FlexGCC.WRT.Domain.WorkRequests.Events;

public sealed record WorkRequestStatusChangedEvent(
    int WorkRequestId,
    WorkRequestStatus PreviousStatus,
    WorkRequestStatus NewStatus,
    DateTime OccurredAt) : IDomainEvent;

