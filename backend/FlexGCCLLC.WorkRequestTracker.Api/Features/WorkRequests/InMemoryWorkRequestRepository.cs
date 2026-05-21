using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Models;

namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests;

public sealed class InMemoryWorkRequestRepository : IWorkRequestRepository
{
    private readonly List<WorkRequest> _requests = [];
    private int _nextRequestId = 1;
    private int _nextNoteId = 1;

    public IReadOnlyList<WorkRequest> GetAll() => _requests;

    public WorkRequest? GetById(int id) => _requests.FirstOrDefault(request => request.Id == id);

    public WorkRequest Add(WorkRequest request)
    {
        request.Id = _nextRequestId++;
        _requests.Add(request);
        return request;
    }

    public WorkRequest Update(WorkRequest request) => request;

    public WorkRequestNote AddNote(int workRequestId, string noteText, DateTime createdDate)
    {
        var request = GetById(workRequestId) ?? throw new InvalidOperationException("Work request not found.");
        var note = new WorkRequestNote
        {
            Id = _nextNoteId++,
            WorkRequestId = workRequestId,
            NoteText = noteText,
            CreatedDate = createdDate
        };
        request.Notes.Add(note);
        request.UpdatedDate = createdDate;
        return note;
    }
}
