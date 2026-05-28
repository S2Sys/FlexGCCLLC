using FlexGCCLLC.WorkRequestTracker.Domain.Common;

namespace FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests.Events;

public sealed record WorkRequestCreatedEvent(int WorkRequestId, DateTime OccurredAt) : IDomainEvent;
