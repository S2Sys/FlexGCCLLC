using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Models;

namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests;

public interface IWorkRequestRepository
{
    IReadOnlyList<WorkRequest> GetAll();

    WorkRequest? GetById(int id);

    WorkRequest Add(WorkRequest request);

    WorkRequest Update(WorkRequest request);

    WorkRequestNote AddNote(int workRequestId, string noteText, DateTime createdDate);
}
