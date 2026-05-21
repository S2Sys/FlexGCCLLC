using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Models;

namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Dtos;

public sealed record WorkRequestDto(
    int Id,
    string Title,
    string ClientName,
    string Description,
    WorkRequestPriority Priority,
    WorkRequestStatus Status,
    DateTime DueDate,
    DateTime CreatedDate,
    DateTime UpdatedDate,
    IReadOnlyList<WorkRequestNoteDto> Notes);

public sealed record WorkRequestNoteDto(int Id, int WorkRequestId, string NoteText, DateTime CreatedDate);
