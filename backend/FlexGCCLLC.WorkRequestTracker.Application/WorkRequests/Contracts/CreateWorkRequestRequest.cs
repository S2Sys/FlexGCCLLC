namespace FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Contracts;

public sealed record CreateWorkRequestRequest(
    string Title,
    string ClientName,
    string Description,
    WorkRequestPriority Priority,
    WorkRequestStatus Status,
    DateTime DueDate);
