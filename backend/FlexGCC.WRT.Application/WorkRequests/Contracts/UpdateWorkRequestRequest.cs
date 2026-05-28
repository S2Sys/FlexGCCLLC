namespace FlexGCC.WRT.Application.WorkRequests.Contracts;

public sealed record UpdateWorkRequestRequest(
    string Title,
    string ClientName,
    string Description,
    WorkRequestPriority Priority,
    DateTime DueDate);

