using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Dtos;
using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Models;
using Microsoft.AspNetCore.Mvc;

namespace FlexGCCLLC.WorkRequestTracker.Api.Controllers;

[ApiController]
[Route("api/work-requests")]
public sealed class WorkRequestsController : ControllerBase
{
    private readonly WorkRequestService _service;

    public WorkRequestsController(WorkRequestService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<PagedResult<WorkRequestDto>> List(
        [FromQuery] WorkRequestStatus? status,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20) =>
        Ok(_service.List(status, search, page, pageSize));

    [HttpGet("{id:int}")]
    public ActionResult<WorkRequestDto> GetById(int id)
    {
        var result = _service.GetById(id);
        return ToActionResult(result);
    }

    [HttpPost]
    public ActionResult<WorkRequestDto> Create(CreateWorkRequestRequest request)
    {
        var result = _service.Create(request);
        if (!result.IsSuccess)
        {
            return ToActionResult(result);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPatch("{id:int}/status")]
    public ActionResult<WorkRequestDto> UpdateStatus(int id, UpdateWorkRequestStatusRequest request)
    {
        var result = _service.UpdateStatus(id, request);
        return ToActionResult(result);
    }

    [HttpPost("{id:int}/notes")]
    public ActionResult<WorkRequestNoteDto> AddNote(int id, AddWorkRequestNoteRequest request)
    {
        var result = _service.AddNote(id, request);
        return ToActionResult(result);
    }

    private ActionResult<T> ToActionResult<T>(OperationResult<T> result)
    {
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        var statusCode = result.Error!.Code switch
        {
            "NotFound" => StatusCodes.Status404NotFound,
            "InvalidStatus" => StatusCodes.Status400BadRequest,
            "InvalidPriority" => StatusCodes.Status400BadRequest,
            "ValidationError" => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };

        return StatusCode(statusCode, result.Error);
    }
}
