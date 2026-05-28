using FlexGCC.WRT.Domain.Common;

namespace FlexGCC.WRT.Application.Common;

public interface IOutboxRepository
{
    void Save(OutboxMessage message);
    IReadOnlyList<OutboxMessage> GetPending();
    void MarkProcessed(Guid id);
}

