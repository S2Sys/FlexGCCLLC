using FlexGCCLLC.WorkRequestTracker.Application.Common;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Contracts;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Validation;
using FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests;
using ContractPriority = FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Contracts.WorkRequestPriority;
using ContractStatus = FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Contracts.WorkRequestStatus;
using DomainPriority = FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests.WorkRequestPriority;
using DomainStatus = FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests.WorkRequestStatus;

namespace FlexGCCLLC.WorkRequestTracker.Application.WorkRequests;

public sealed class WorkRequestService
{
    private readonly IWorkRequestRepository _repository;

    public WorkRequestService(IWorkRequestRepository repository)
    {
        _repository = repository;
    }

    public Result<PagedResult<WorkRequestDto>> List(ContractStatus? status, string? search, int page, int pageSize)
    {
        var safePage = Math.Max(page, 1);
        var safePageSize = Math.Clamp(pageSize, 1, 100);
        var query = _repository.GetAll().AsEnumerable();

        if (status is not null)
        {
            if (!Enum.IsDefined(typeof(ContractStatus), status.Value))
            {
                return Result<PagedResult<WorkRequestDto>>.Failure(
                    "InvalidStatus",
                    "Status must be New, InProgress, Blocked, or Completed.");
            }

            var domainStatus = ToDomainStatus(status.Value);
            query = query.Where(request => request.Status == domainStatus);
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

        return Result<PagedResult<WorkRequestDto>>.Success(
            new PagedResult<WorkRequestDto>(items, safePage, safePageSize, total));
    }

    public Result<WorkRequestDto> GetById(int id)
    {
        var request = _repository.GetById(id);
        return request is null
            ? Result<WorkRequestDto>.Failure("NotFound", "Work request was not found.")
            : Result<WorkRequestDto>.Success(ToDto(request));
    }

    public Result<WorkRequestDto> Create(CreateWorkRequestRequest request)
    {
        var errors = WorkRequestValidator.ValidateCreate(request);
        if (errors.Count > 0)
        {
            return Result<WorkRequestDto>.Failure("ValidationError", "Work request is invalid.", errors);
        }

        var now = DateTime.UtcNow;
        var entity = new WorkRequest
        {
            Title = request.Title.Trim(),
            ClientName = request.ClientName.Trim(),
            Description = request.Description.Trim(),
            Priority = ToDomainPriority(request.Priority),
            Status = ToDomainStatus(request.Status),
            DueDate = request.DueDate,
            CreatedDate = now,
            UpdatedDate = now
        };

        return Result<WorkRequestDto>.Success(ToDto(_repository.Add(entity)));
    }

    public Result<WorkRequestDto> UpdateStatus(int id, UpdateWorkRequestStatusRequest request)
    {
        if (!Enum.IsDefined(typeof(ContractStatus), request.Status))
        {
            return Result<WorkRequestDto>.Failure(
                "InvalidStatus",
                "Status must be New, InProgress, Blocked, or Completed.");
        }

        var entity = _repository.GetById(id);
        if (entity is null)
        {
            return Result<WorkRequestDto>.Failure("NotFound", "Work request was not found.");
        }

        entity.Status = ToDomainStatus(request.Status);
        entity.UpdatedDate = DateTime.UtcNow;
        return Result<WorkRequestDto>.Success(ToDto(_repository.Update(entity)));
    }

    public Result<WorkRequestDto> Update(int id, UpdateWorkRequestRequest request)
    {
        var errors = WorkRequestValidator.ValidateUpdate(request);
        if (errors.Count > 0)
            return Result<WorkRequestDto>.Failure("ValidationError", "Work request is invalid.", errors);

        var entity = _repository.GetById(id);
        if (entity is null)
            return Result<WorkRequestDto>.Failure("NotFound", "Work request was not found.");

        entity.Title = request.Title.Trim();
        entity.ClientName = request.ClientName.Trim();
        entity.Description = request.Description.Trim();
        entity.Priority = ToDomainPriority(request.Priority);
        entity.DueDate = request.DueDate;
        entity.UpdatedDate = DateTime.UtcNow;
        return Result<WorkRequestDto>.Success(ToDto(_repository.Update(entity)));
    }

    public Result<WorkRequestNoteDto> AddNote(int id, AddWorkRequestNoteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NoteText))
        {
            return Result<WorkRequestNoteDto>.Failure(
                "ValidationError",
                "Note is invalid.",
                ["Note text is required."]);
        }

        if (_repository.GetById(id) is null)
        {
            return Result<WorkRequestNoteDto>.Failure("NotFound", "Work request was not found.");
        }

        var note = _repository.AddNote(id, request.NoteText.Trim(), DateTime.UtcNow);
        return Result<WorkRequestNoteDto>.Success(ToDto(note));
    }

    private static WorkRequestDto ToDto(WorkRequest request) =>
        new(
            request.Id,
            request.Title,
            request.ClientName,
            request.Description,
            ToContractPriority(request.Priority),
            ToContractStatus(request.Status),
            request.DueDate,
            request.CreatedDate,
            request.UpdatedDate,
            request.Notes.Select(ToDto).ToArray());

    private static WorkRequestNoteDto ToDto(WorkRequestNote note) =>
        new(note.Id, note.WorkRequestId, note.NoteText, note.CreatedDate);

    private static DomainPriority ToDomainPriority(ContractPriority priority) => priority switch
    {
        ContractPriority.Low => DomainPriority.Low,
        ContractPriority.Medium => DomainPriority.Medium,
        ContractPriority.High => DomainPriority.High,
        _ => throw new ArgumentOutOfRangeException(nameof(priority), priority, "Unsupported priority.")
    };

    private static DomainStatus ToDomainStatus(ContractStatus status) => status switch
    {
        ContractStatus.New => DomainStatus.New,
        ContractStatus.InProgress => DomainStatus.InProgress,
        ContractStatus.Blocked => DomainStatus.Blocked,
        ContractStatus.Completed => DomainStatus.Completed,
        _ => throw new ArgumentOutOfRangeException(nameof(status), status, "Unsupported status.")
    };

    private static ContractPriority ToContractPriority(DomainPriority priority) => priority switch
    {
        DomainPriority.Low => ContractPriority.Low,
        DomainPriority.Medium => ContractPriority.Medium,
        DomainPriority.High => ContractPriority.High,
        _ => throw new ArgumentOutOfRangeException(nameof(priority), priority, "Unsupported priority.")
    };

    private static ContractStatus ToContractStatus(DomainStatus status) => status switch
    {
        DomainStatus.New => ContractStatus.New,
        DomainStatus.InProgress => ContractStatus.InProgress,
        DomainStatus.Blocked => ContractStatus.Blocked,
        DomainStatus.Completed => ContractStatus.Completed,
        _ => throw new ArgumentOutOfRangeException(nameof(status), status, "Unsupported status.")
    };
}
