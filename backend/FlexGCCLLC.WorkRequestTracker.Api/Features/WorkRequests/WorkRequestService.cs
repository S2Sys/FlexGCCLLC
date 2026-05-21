using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Dtos;
using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Models;
using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Validation;

namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests;

public sealed class WorkRequestService
{
    private readonly IWorkRequestRepository _repository;

    public WorkRequestService(IWorkRequestRepository repository)
    {
        _repository = repository;
    }

    public PagedResult<WorkRequestDto> List(WorkRequestStatus? status, string? search, int page, int pageSize)
    {
        var safePage = Math.Max(page, 1);
        var safePageSize = Math.Clamp(pageSize, 1, 100);
        var query = _repository.GetAll().AsEnumerable();

        if (status is not null)
        {
            query = query.Where(request => request.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(request =>
                request.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                request.ClientName.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        var total = query.Count();
        var items = query
            .OrderBy(request => request.DueDate)
            .Skip((safePage - 1) * safePageSize)
            .Take(safePageSize)
            .Select(ToDto)
            .ToArray();

        return new PagedResult<WorkRequestDto>(items, safePage, safePageSize, total);
    }

    public OperationResult<WorkRequestDto> GetById(int id)
    {
        var request = _repository.GetById(id);
        return request is null
            ? OperationResult<WorkRequestDto>.Failure("NotFound", "Work request was not found.")
            : OperationResult<WorkRequestDto>.Success(ToDto(request));
    }

    public OperationResult<WorkRequestDto> Create(CreateWorkRequestRequest request)
    {
        var errors = WorkRequestValidator.ValidateCreate(request);
        if (errors.Count > 0)
        {
            return OperationResult<WorkRequestDto>.Failure("ValidationError", "Work request is invalid.", errors);
        }

        var now = DateTime.UtcNow;
        var entity = new WorkRequest
        {
            Title = request.Title.Trim(),
            ClientName = request.ClientName.Trim(),
            Description = request.Description.Trim(),
            Priority = request.Priority,
            Status = request.Status,
            DueDate = request.DueDate,
            CreatedDate = now,
            UpdatedDate = now
        };

        return OperationResult<WorkRequestDto>.Success(ToDto(_repository.Add(entity)));
    }

    public OperationResult<WorkRequestDto> UpdateStatus(int id, UpdateWorkRequestStatusRequest request)
    {
        if (!Enum.IsDefined(typeof(WorkRequestStatus), request.Status))
        {
            return OperationResult<WorkRequestDto>.Failure(
                "InvalidStatus",
                "Status must be New, InProgress, Blocked, or Completed.");
        }

        var entity = _repository.GetById(id);
        if (entity is null)
        {
            return OperationResult<WorkRequestDto>.Failure("NotFound", "Work request was not found.");
        }

        entity.Status = request.Status;
        entity.UpdatedDate = DateTime.UtcNow;
        return OperationResult<WorkRequestDto>.Success(ToDto(_repository.Update(entity)));
    }

    public OperationResult<WorkRequestNoteDto> AddNote(int id, AddWorkRequestNoteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NoteText))
        {
            return OperationResult<WorkRequestNoteDto>.Failure(
                "ValidationError",
                "Note is invalid.",
                ["Note text is required."]);
        }

        if (_repository.GetById(id) is null)
        {
            return OperationResult<WorkRequestNoteDto>.Failure("NotFound", "Work request was not found.");
        }

        var note = _repository.AddNote(id, request.NoteText.Trim(), DateTime.UtcNow);
        return OperationResult<WorkRequestNoteDto>.Success(ToDto(note));
    }

    private static WorkRequestDto ToDto(WorkRequest request) =>
        new(
            request.Id,
            request.Title,
            request.ClientName,
            request.Description,
            request.Priority,
            request.Status,
            request.DueDate,
            request.CreatedDate,
            request.UpdatedDate,
            request.Notes.Select(ToDto).ToArray());

    private static WorkRequestNoteDto ToDto(WorkRequestNote note) =>
        new(note.Id, note.WorkRequestId, note.NoteText, note.CreatedDate);
}
