using System.Data;
using FlexGCCLLC.WorkRequestTracker.Application.Common;

namespace FlexGCCLLC.WorkRequestTracker.Infrastructure.Persistence;

public sealed class DapperUnitOfWork : IUnitOfWork
{
    private readonly IDbConnection _connection;
    private IDbTransaction? _transaction;

    public DapperUnitOfWork(Func<IDbConnection> connectionFactory)
    {
        Guard.NotNull(connectionFactory, nameof(connectionFactory));
        _connection = connectionFactory();
        _connection.Open();
    }

    public void Begin() => _transaction = _connection.BeginTransaction();

    public void Commit()
    {
        _transaction?.Commit();
        _transaction?.Dispose();
        _transaction = null;
    }

    public void Rollback()
    {
        _transaction?.Rollback();
        _transaction?.Dispose();
        _transaction = null;
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _connection.Dispose();
    }
}
