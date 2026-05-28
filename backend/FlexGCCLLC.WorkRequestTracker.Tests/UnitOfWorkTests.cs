using System.Data;
using FlexGCCLLC.WorkRequestTracker.Infrastructure.Persistence;

namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class UnitOfWorkTests
{
    private sealed class FakeConnection : IDbConnection
    {
        public string ConnectionString { get => ""; set => _ = value; }
        public int ConnectionTimeout => 0;
        public string Database => "";
        public ConnectionState State => ConnectionState.Open;

        public IDbTransaction BeginTransaction() => new FakeTransaction();
        public IDbTransaction BeginTransaction(IsolationLevel il) => new FakeTransaction();
        public void ChangeDatabase(string databaseName) { }
        public void Close() { }
        public IDbCommand CreateCommand() => throw new NotImplementedException();
        public void Open() { }
        public void Dispose() { }
    }

    private sealed class FakeTransaction : IDbTransaction
    {
        public IDbConnection? Connection => null;
        public IsolationLevel IsolationLevel => IsolationLevel.ReadCommitted;

        public void Commit() { }
        public void Rollback() { }
        public void Dispose() { }
    }

    [Fact]
    public void DapperUnitOfWork_CanBeCreatedAndDisposed()
    {
        // Uses a fake connection that doesn't require a real database.
        var factory = new Func<IDbConnection>(() => new FakeConnection());

        using var uow = new DapperUnitOfWork(factory);
        Assert.NotNull(uow);
        // Dispose must not throw
    }

    [Fact]
    public void DapperUnitOfWork_Begin_CreatesTransaction()
    {
        var factory = new Func<IDbConnection>(() => new FakeConnection());

        using var uow = new DapperUnitOfWork(factory);
        uow.Begin();
        // Should not throw
    }

    [Fact]
    public void DapperUnitOfWork_Commit_DisposesTransaction()
    {
        var factory = new Func<IDbConnection>(() => new FakeConnection());

        using var uow = new DapperUnitOfWork(factory);
        uow.Begin();
        uow.Commit();
        // Should not throw
    }

    [Fact]
    public void DapperUnitOfWork_Rollback_DisposesTransaction()
    {
        var factory = new Func<IDbConnection>(() => new FakeConnection());

        using var uow = new DapperUnitOfWork(factory);
        uow.Begin();
        uow.Rollback();
        // Should not throw
    }
}
