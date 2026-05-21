using FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests;

namespace FlexGCCLLC.WorkRequestTracker.Application.WorkRequests;

public interface IWorkRequestRepository
{
    IReadOnlyList<WorkRequest> GetAll();

    WorkRequest? GetById(int id);

    WorkRequest Add(WorkRequest request);

    WorkRequest Update(WorkRequest request);

    WorkRequestNote AddNote(int workRequestId, string noteText, DateTime createdDate);
}
