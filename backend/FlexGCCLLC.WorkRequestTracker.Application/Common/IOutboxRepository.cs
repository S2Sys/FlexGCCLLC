using FlexGCCLLC.WorkRequestTracker.Domain.Common;

namespace FlexGCCLLC.WorkRequestTracker.Application.Common;

public interface IOutboxRepository
{
    void Save(OutboxMessage message);
    IReadOnlyList<OutboxMessage> GetPending();
    void MarkProcessed(Guid id);
}
