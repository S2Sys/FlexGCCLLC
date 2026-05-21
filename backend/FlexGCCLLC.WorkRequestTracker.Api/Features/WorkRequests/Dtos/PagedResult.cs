namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Dtos;

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int Total);
