using FlexGCCLLC.WorkRequestTracker.Application.Common;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Contracts;
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
        _service.List(status, search, page, pageSize).ToActionResult();

    [HttpGet("{id:int}")]
    public ActionResult<WorkRequestDto> GetById(int id)
    {
        var result = _service.GetById(id);
        return result.ToActionResult();
    }

    [HttpPost]
    public ActionResult<WorkRequestDto> Create(CreateWorkRequestRequest request)
    {
        var result = _service.Create(request);
        if (!result.IsSuccess)
        {
            return result.ToActionResult();
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPatch("{id:int}/status")]
    public ActionResult<WorkRequestDto> UpdateStatus(int id, UpdateWorkRequestStatusRequest request)
    {
        var result = _service.UpdateStatus(id, request);
        return result.ToActionResult();
    }

    [HttpPost("{id:int}/notes")]
    public ActionResult<WorkRequestNoteDto> AddNote(int id, AddWorkRequestNoteRequest request)
    {
        var result = _service.AddNote(id, request);
        return result.ToActionResult();
    }
}
