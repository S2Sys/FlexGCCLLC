using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Contracts;
using FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Infrastructure.Persistence;
using ContractPriority = FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Contracts.WorkRequestPriority;
using ContractStatus = FlexGCCLLC.WorkRequestTracker.Application.WorkRequests.Contracts.WorkRequestStatus;

namespace FlexGCCLLC.WorkRequestTracker.Tests;

public class WorkRequestServiceTests
{
    [Fact]
    public void Create_rejects_missing_title()
    {
        var service = new WorkRequestService(new InMemoryWorkRequestRepository());

        var result = service.Create(new CreateWorkRequestRequest(
            "",
            "Acme",
            "Need a tracker",
            ContractPriority.High,
            ContractStatus.New,
            DateTime.UtcNow.AddDays(1)));

        Assert.False(result.IsSuccess);
        Assert.Equal("ValidationError", result.Error?.Code);
    }

    [Fact]
    public void Update_status_changes_status_and_updated_date()
    {
        var service = new WorkRequestService(new InMemoryWorkRequestRepository());
        var created = service.Create(new CreateWorkRequestRequest(
            "Build tracker",
            "Acme",
            "Need a tracker",
            ContractPriority.Medium,
            ContractStatus.New,
            DateTime.UtcNow.AddDays(1))).Value!;

        var result = service.UpdateStatus(created.Id, new UpdateWorkRequestStatusRequest(ContractStatus.InProgress));

        Assert.True(result.IsSuccess);
        Assert.Equal(ContractStatus.InProgress, result.Value!.Status);
        Assert.True(result.Value.UpdatedDate >= created.UpdatedDate);
    }

    [Fact]
    public void List_rejects_invalid_status_filter()
    {
        var service = new WorkRequestService(new InMemoryWorkRequestRepository());

        var result = service.List((ContractStatus)999, null, 1, 20);

        Assert.False(result.IsSuccess);
        Assert.Equal("InvalidStatus", result.Error?.Code);
    }

    [Fact]
    public void Add_note_rejects_empty_text()
    {
        var service = new WorkRequestService(new InMemoryWorkRequestRepository());
        var created = CreateSampleRequest(service);

        var result = service.AddNote(created.Id, new AddWorkRequestNoteRequest("   "));

        Assert.False(result.IsSuccess);
        Assert.Equal("ValidationError", result.Error?.Code);
        Assert.Contains("Note text is required.", result.Error?.Details ?? []);
    }

    [Fact]
    public void Add_note_rejects_null_text()
    {
        var service = new WorkRequestService(new InMemoryWorkRequestRepository());
        var created = CreateSampleRequest(service);

        var result = service.AddNote(created.Id, new AddWorkRequestNoteRequest(null!));

        Assert.False(result.IsSuccess);
        Assert.Equal("ValidationError", result.Error?.Code);
        Assert.Contains("Note text is required.", result.Error?.Details ?? []);
    }

    [Fact]
    public void Add_note_returns_not_found_for_missing_request()
    {
        var service = new WorkRequestService(new InMemoryWorkRequestRepository());

        var result = service.AddNote(999, new AddWorkRequestNoteRequest("Follow up with client."));

        Assert.False(result.IsSuccess);
        Assert.Equal("NotFound", result.Error?.Code);
    }

    [Fact]
    public void Add_note_does_not_call_repository_when_request_is_missing()
    {
        var repository = new RecordingWorkRequestRepository();
        var service = new WorkRequestService(repository);

        var result = service.AddNote(999, new AddWorkRequestNoteRequest("Follow up with client."));

        Assert.False(result.IsSuccess);
        Assert.False(repository.AddNoteWasCalled);
    }

    [Fact]
    public void Add_note_trims_text_and_updates_parent_request()
    {
        var service = new WorkRequestService(new InMemoryWorkRequestRepository());
        var created = CreateSampleRequest(service);

        var result = service.AddNote(created.Id, new AddWorkRequestNoteRequest("  Follow up with client.  "));
        var refreshed = service.GetById(created.Id).Value!;

        Assert.True(result.IsSuccess);
        Assert.Equal(created.Id, result.Value!.WorkRequestId);
        Assert.Equal("Follow up with client.", result.Value.NoteText);
        Assert.Contains(refreshed.Notes, note => note.NoteText == "Follow up with client.");
        Assert.True(refreshed.UpdatedDate >= created.UpdatedDate);
    }

    [Fact]
    public void Add_note_returns_note_identity_and_created_date()
    {
        var service = new WorkRequestService(new InMemoryWorkRequestRepository());
        var created = CreateSampleRequest(service);

        var result = service.AddNote(created.Id, new AddWorkRequestNoteRequest("Follow up with client."));

        Assert.True(result.IsSuccess);
        Assert.True(result.Value!.Id > 0);
        Assert.Equal(created.Id, result.Value.WorkRequestId);
        Assert.True(result.Value.CreatedDate <= DateTime.UtcNow);
    }

    [Fact]
    public void Dapper_repository_implements_work_request_repository_contract()
    {
        IWorkRequestRepository repository = new WorkRequestRepository(
            () => throw new InvalidOperationException("Connection factory is not used by this contract test."));

        Assert.IsType<WorkRequestRepository>(repository);
    }

    private static WorkRequestDto CreateSampleRequest(WorkRequestService service) =>
        service.Create(new CreateWorkRequestRequest(
            "Build tracker",
            "Acme",
            "Need a tracker",
            ContractPriority.Medium,
            ContractStatus.New,
            DateTime.UtcNow.AddDays(1))).Value!;

    private sealed class RecordingWorkRequestRepository : IWorkRequestRepository
    {
        public bool AddNoteWasCalled { get; private set; }

        public IReadOnlyList<WorkRequest> GetAll() => [];

        public WorkRequest? GetById(int id) => null;

        public WorkRequest Add(WorkRequest request) => request;

        public WorkRequest Update(WorkRequest request) => request;

        public WorkRequestNote AddNote(int workRequestId, string noteText, DateTime createdDate)
        {
            AddNoteWasCalled = true;
            return new WorkRequestNote
            {
                Id = 1,
                WorkRequestId = workRequestId,
                NoteText = noteText,
                CreatedDate = createdDate
            };
        }
    }
}
