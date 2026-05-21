using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Models;

namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Dtos;

public sealed record CreateWorkRequestRequest(
    string Title,
    string ClientName,
    string Description,
    WorkRequestPriority Priority,
    WorkRequestStatus Status,
    DateTime DueDate);
