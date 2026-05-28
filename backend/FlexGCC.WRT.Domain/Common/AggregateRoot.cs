namespace FlexGCC.WRT.Domain.Common;

public abstract class AggregateRoot
{
    private readonly List<IDomainEvent> _events = [];

    protected void AddEvent(IDomainEvent domainEvent) => _events.Add(domainEvent);

    public IReadOnlyList<IDomainEvent> PullDomainEvents()
    {
        var copy = _events.ToArray();
        _events.Clear();
        return copy;
    }
}

