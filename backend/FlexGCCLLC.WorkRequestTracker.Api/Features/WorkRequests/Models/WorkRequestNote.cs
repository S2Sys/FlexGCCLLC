namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Models;

public sealed class WorkRequestNote
{
    public int Id { get; set; }

    public int WorkRequestId { get; set; }

    public string NoteText { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }
}
