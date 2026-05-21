namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Dtos;

public sealed record ApiErrorResponse(string Code, string Message, IReadOnlyList<string> Details);
