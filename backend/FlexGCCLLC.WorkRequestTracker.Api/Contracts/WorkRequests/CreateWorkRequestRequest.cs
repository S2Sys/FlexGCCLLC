namespace FlexGCCLLC.WorkRequestTracker.Api.Contracts.WorkRequests;

public sealed record CreateWorkRequestRequest(
    string Title,
    string ClientName,
    string Description,
    WorkRequestPriority Priority,
    WorkRequestStatus Status,
    DateTime DueDate);
