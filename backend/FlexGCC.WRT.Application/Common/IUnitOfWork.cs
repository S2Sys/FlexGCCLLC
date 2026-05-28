namespace FlexGCC.WRT.Application.Common;

public interface IUnitOfWork : IDisposable
{
    void Begin();
    void Commit();
    void Rollback();
}

