namespace FlexGCCLLC.WorkRequestTracker.Api.Contracts.WorkRequests;

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
