using FlexGCC.WRT.Domain.WorkRequests;

namespace FlexGCC.WRT.Application.WorkRequests;

public interface IWorkRequestRepository
{
    IReadOnlyList<WorkRequest> GetAll(
        WorkRequestStatus? status,
        string? search,
        int page,
        int pageSize);
    (IReadOnlyList<WorkRequest> Items, int TotalCount) GetPage(
        WorkRequestStatus? status,
        string? search,
        int page,
        int pageSize);

    WorkRequest? GetById(int id);

    WorkRequest Add(WorkRequest request);

    WorkRequest Update(WorkRequest request);

    WorkRequestNote AddNote(int workRequestId, string noteText, DateTime createdDate);
}

