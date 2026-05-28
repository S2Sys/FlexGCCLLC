using System.Data;
using Dapper;
using FlexGCCLLC.WorkRequestTracker.Application.Common;
using FlexGCCLLC.WorkRequestTracker.Domain.Common;

namespace FlexGCCLLC.WorkRequestTracker.Infrastructure.Persistence;

public sealed class DapperOutboxRepository : IOutboxRepository
{
    private readonly Func<IDbConnection> _connectionFactory;

    public DapperOutboxRepository(Func<IDbConnection> connectionFactory) =>
        _connectionFactory = Guard.NotNull(connectionFactory, nameof(connectionFactory));

    public void Save(OutboxMessage message)
    {
        using var conn = _connectionFactory();
        conn.Execute(
            "INSERT INTO dbo.OutboxMessages (Id, EventType, Payload, CreatedAt, IsProcessed) VALUES (@Id, @EventType, @Payload, @CreatedAt, 0)",
            new { message.Id, message.EventType, message.Payload, message.CreatedAt });
    }

    public IReadOnlyList<OutboxMessage> GetPending()
    {
        using var conn = _connectionFactory();
        return conn.Query<OutboxMessage>(
            "SELECT Id, EventType, Payload, CreatedAt, IsProcessed FROM dbo.OutboxMessages WHERE IsProcessed = 0 ORDER BY CreatedAt").ToArray();
    }

    public void MarkProcessed(Guid id)
    {
        using var conn = _connectionFactory();
        conn.Execute("UPDATE dbo.OutboxMessages SET IsProcessed = 1 WHERE Id = @Id", new { Id = id });
    }
}
