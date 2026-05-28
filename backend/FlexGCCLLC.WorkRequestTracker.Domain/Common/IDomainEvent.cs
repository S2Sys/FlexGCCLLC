namespace FlexGCCLLC.WorkRequestTracker.Domain.Common;

public interface IDomainEvent
{
    DateTime OccurredAt { get; }
}
