using FlexGCC.WRT.Domain.Common;

namespace FlexGCC.WRT.Domain.WorkRequests.Events;

public sealed record WorkRequestCreatedEvent(int WorkRequestId, DateTime OccurredAt) : IDomainEvent;

