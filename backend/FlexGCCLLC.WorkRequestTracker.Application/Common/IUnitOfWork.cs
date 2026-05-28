namespace FlexGCCLLC.WorkRequestTracker.Application.Common;

public interface IUnitOfWork : IDisposable
{
    void Begin();
    void Commit();
    void Rollback();
}
