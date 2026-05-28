using FlexGCC.WRT.Application.WorkRequests;
using FlexGCC.WRT.Domain.WorkRequests;

namespace FlexGCC.WRT.Infrastructure.Persistence;

public sealed class InMemoryWorkRequestRepository : IWorkRequestRepository
{
    private readonly List<WorkRequest> _requests = [];
    private int _nextRequestId = 1;
    private int _nextNoteId = 1;

    public IReadOnlyList<WorkRequest> GetAll(
        WorkRequestStatus? status,
        string? search,
        int page,
        int pageSize) => GetPage(status, search, page, pageSize).Items;

    public (IReadOnlyList<WorkRequest> Items, int TotalCount) GetPage(
        WorkRequestStatus? status,
        string? search,
        int page,
        int pageSize)
    {
        var query = _requests.AsEnumerable();
        if (status is not null) query = query.Where(request => request.Status == status.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(request =>
                request.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                request.ClientName.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        var total = query.Count();
        var items = query
            .OrderByDescending(request => request.UpdatedDate)
            .ThenByDescending(request => request.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToArray();

        return (items, total);
    }

    public WorkRequest? GetById(int id) => _requests.FirstOrDefault(request => request.Id == id);

    public WorkRequest Add(WorkRequest request)
    {
        request.Id = _nextRequestId++;
        _requests.Add(request);
        return request;
    }

    public WorkRequest Update(WorkRequest request)
    {
        var index = _requests.FindIndex(r => r.Id == request.Id);
        if (index >= 0) _requests[index] = request;
        return request;
    }

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

