namespace FlexGCCLLC.WorkRequestTracker.Api.Contracts.Common;

public sealed record ApiErrorResponse(string Code, string Message, IReadOnlyList<string> Details);
