using FlexGCCLLC.WorkRequestTracker.Application.Common;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Contracts;

namespace FlexGCCLLC.WorkRequestTracker.Api.Endpoints;

public static class WorkRequestEndpoints
{
    public static IEndpointRouteBuilder MapWorkRequestEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/work-requests")
            .WithTags("Work Requests");

        group.MapGet("/", (
                WorkRequestService service,
                WorkRequestStatus? status,
                string? search,
                int? page,
                int? pageSize) =>
            {
                var result = service.List(status, search, page ?? 1, pageSize ?? 20);
                return result.ToEndpointResult();
            })
            .WithName("ListWorkRequestsV1")
            .Produces<PagedResult<WorkRequestDto>>();

        group.MapGet("/{id:int}", (WorkRequestService service, int id) =>
            service.GetById(id).ToEndpointResult())
            .WithName("GetWorkRequestByIdV1")
            .Produces<WorkRequestDto>()
            .Produces<ApiErrorResponse>(StatusCodes.Status404NotFound);

        group.MapPost("/", (WorkRequestService service, CreateWorkRequestRequest request) =>
            {
                var result = service.Create(request);
                return result.IsSuccess
                    ? Results.Created(
                        $"/api/v1/work-requests/{result.Value!.Id}",
                        ApiResponse<WorkRequestDto>.Ok(result.Value))
                    : result.ToEndpointResult();
            })
            .WithName("CreateWorkRequestV1")
            .Produces<WorkRequestDto>(StatusCodes.Status201Created)
            .Produces<ApiErrorResponse>(StatusCodes.Status400BadRequest);

        group.MapPatch("/{id:int}/status", (
                WorkRequestService service,
                int id,
                UpdateWorkRequestStatusRequest request) =>
            service.UpdateStatus(id, request).ToEndpointResult())
            .WithName("UpdateWorkRequestStatusV1")
            .Produces<WorkRequestDto>()
            .Produces<ApiErrorResponse>(StatusCodes.Status400BadRequest)
            .Produces<ApiErrorResponse>(StatusCodes.Status404NotFound);

        group.MapPut("/{id:int}", (WorkRequestService service, int id, UpdateWorkRequestRequest request) =>
            service.Update(id, request).ToEndpointResult())
            .WithName("UpdateWorkRequestV1")
            .Produces<WorkRequestDto>()
            .Produces<ApiErrorResponse>(StatusCodes.Status400BadRequest)
            .Produces<ApiErrorResponse>(StatusCodes.Status404NotFound);

        group.MapPost("/{id:int}/notes", (
                WorkRequestService service,
                int id,
                AddWorkRequestNoteRequest request) =>
            service.AddNote(id, request).ToEndpointResult())
            .WithName("AddWorkRequestNoteV1")
            .Produces<WorkRequestNoteDto>()
            .Produces<ApiErrorResponse>(StatusCodes.Status400BadRequest)
            .Produces<ApiErrorResponse>(StatusCodes.Status404NotFound);

        return app;
    }
}
