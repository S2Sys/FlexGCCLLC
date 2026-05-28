using System.Data;
using FlexGCC.WRT.Application.Common;

namespace FlexGCC.WRT.Infrastructure.Persistence;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly IDbConnection _connection;
    private IDbTransaction? _transaction;

    public UnitOfWork(Func<IDbConnection> connectionFactory)
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


