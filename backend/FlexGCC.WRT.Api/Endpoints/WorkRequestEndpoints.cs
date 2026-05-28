using FlexGCC.WRT.Application.Common;
using FlexGCC.WRT.Application.WorkRequests;
using FlexGCC.WRT.Application.WorkRequests.Contracts;

namespace FlexGCC.WRT.Api.Endpoints;

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
            .Produces<ApiResponse<PagedResult<WorkRequestDto>>>();

        group.MapGet("/{id:int}", (WorkRequestService service, int id) =>
            service.GetById(id).ToEndpointResult())
            .WithName("GetWorkRequestByIdV1")
            .Produces<ApiResponse<WorkRequestDto>>()
            .Produces<ApiResponse<string>>(StatusCodes.Status404NotFound);

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
            .Produces<ApiResponse<WorkRequestDto>>(StatusCodes.Status201Created)
            .Produces<ApiResponse<string>>(StatusCodes.Status400BadRequest);

        group.MapPatch("/{id:int}/status", (
                WorkRequestService service,
                int id,
                UpdateWorkRequestStatusRequest request) =>
            service.UpdateStatus(id, request).ToEndpointResult())
            .WithName("UpdateWorkRequestStatusV1")
            .Produces<ApiResponse<WorkRequestDto>>()
            .Produces<ApiResponse<string>>(StatusCodes.Status400BadRequest)
            .Produces<ApiResponse<string>>(StatusCodes.Status404NotFound);

        group.MapPut("/{id:int}", (WorkRequestService service, int id, UpdateWorkRequestRequest request) =>
            service.Update(id, request).ToEndpointResult())
            .WithName("UpdateWorkRequestV1")
            .Produces<ApiResponse<WorkRequestDto>>()
            .Produces<ApiResponse<string>>(StatusCodes.Status400BadRequest)
            .Produces<ApiResponse<string>>(StatusCodes.Status404NotFound);

        group.MapPost("/{id:int}/notes", (
                WorkRequestService service,
                int id,
                AddWorkRequestNoteRequest request) =>
            service.AddNote(id, request).ToEndpointResult())
            .WithName("AddWorkRequestNoteV1")
            .Produces<ApiResponse<WorkRequestNoteDto>>()
            .Produces<ApiResponse<string>>(StatusCodes.Status400BadRequest)
            .Produces<ApiResponse<string>>(StatusCodes.Status404NotFound);

        return app;
    }
}

