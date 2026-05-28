namespace FlexGCC.WRT.Domain.Common;

public interface IDomainEvent
{
    DateTime OccurredAt { get; }
}

