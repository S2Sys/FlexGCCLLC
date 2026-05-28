using FlexGCCLLC.WorkRequestTracker.Application.Common;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Contracts;
using FlexGCCLLC.WorkRequestTracker.Domain.Common;
using FlexGCCLLC.WorkRequestTracker.Infrastructure.Persistence;

namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class OutboxTests
{
    private sealed class InMemoryOutboxRepository : IOutboxRepository
    {
        private readonly List<OutboxMessage> _messages = [];
        public void Save(OutboxMessage message) => _messages.Add(message);
        public IReadOnlyList<OutboxMessage> GetPending() => _messages.Where(m => !m.IsProcessed).ToArray();
        public void MarkProcessed(Guid id)
        {
            var msg = _messages.FirstOrDefault(m => m.Id == id);
            if (msg is not null) msg.IsProcessed = true;
        }
    }

    [Fact]
    public void Create_SavesOutboxMessage()
    {
        var outbox = new InMemoryOutboxRepository();
        var service = new WorkRequestService(new InMemoryWorkRequestRepository(), outbox);

        service.Create(new CreateWorkRequestRequest(
            "T", "C", "D", WorkRequestPriority.Low, WorkRequestStatus.New,
            DateTime.UtcNow.AddDays(1)));

        Assert.Single(outbox.GetPending());
        Assert.Equal("WorkRequestCreatedEvent", outbox.GetPending()[0].EventType);
    }
}
