using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Models;

namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Dtos;

public sealed record UpdateWorkRequestStatusRequest(WorkRequestStatus Status);
