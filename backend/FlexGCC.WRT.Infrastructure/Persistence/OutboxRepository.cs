using System.Data;
using Dapper;
using FlexGCC.WRT.Application.Common;
using FlexGCC.WRT.Domain.Common;

namespace FlexGCC.WRT.Infrastructure.Persistence;

public sealed class OutboxRepository : IOutboxRepository
{
    private const string SaveProcedure = "dbo.usp_OutboxMessages_Save";
    private const string GetPendingProcedure = "dbo.usp_OutboxMessages_GetPending";
    private const string MarkProcessedProcedure = "dbo.usp_OutboxMessages_MarkProcessed";

    private readonly Func<IDbConnection> _connectionFactory;

    public OutboxRepository(Func<IDbConnection> connectionFactory) =>
        _connectionFactory = Guard.NotNull(connectionFactory, nameof(connectionFactory));

    public void Save(OutboxMessage message)
    {
        using var conn = _connectionFactory();
        conn.Execute(
            SaveProcedure,
            new { message.Id, message.EventType, message.Payload, message.CreatedAt },
            commandType: CommandType.StoredProcedure);
    }

    public IReadOnlyList<OutboxMessage> GetPending()
    {
        using var conn = _connectionFactory();
        return conn.Query<OutboxMessage>(
            GetPendingProcedure,
            commandType: CommandType.StoredProcedure).ToArray();
    }

    public void MarkProcessed(Guid id)
    {
        using var conn = _connectionFactory();
        conn.Execute(
            MarkProcessedProcedure,
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }
}


