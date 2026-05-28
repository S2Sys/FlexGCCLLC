namespace FlexGCC.WRT.Infrastructure.Persistence;

public sealed class WorkRequestPersistenceException : Exception
{
    public WorkRequestPersistenceException(string message) : base(message) { }
}

