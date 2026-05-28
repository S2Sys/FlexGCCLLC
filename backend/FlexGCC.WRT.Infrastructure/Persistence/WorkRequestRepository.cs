using System.Data;
using Dapper;
using FlexGCC.WRT.Application.Common;
using FlexGCC.WRT.Application.WorkRequests;
using FlexGCC.WRT.Domain.WorkRequests;

namespace FlexGCC.WRT.Infrastructure.Persistence;

public sealed class WorkRequestRepository : IWorkRequestRepository
{
    private const string GetAllProcedure = "dbo.usp_WorkRequests_GetAll";
    private const string GetByIdProcedure = "dbo.usp_WorkRequests_GetById";
    private const string CreateProcedure = "dbo.usp_WorkRequests_Create";
    private const string UpdateProcedure = "dbo.usp_WorkRequests_Update";
    private const string AddNoteProcedure = "dbo.usp_WorkRequestNotes_Add";

    private readonly Func<IDbConnection> _connectionFactory;

    public WorkRequestRepository(Func<IDbConnection> connectionFactory)
    {
        _connectionFactory = Guard.NotNull(connectionFactory, nameof(connectionFactory));
    }

    public IReadOnlyList<WorkRequest> GetAll(
        WorkRequestStatus? status,
        string? search,
        int page,
        int pageSize)
    {
        return GetPage(status, search, page, pageSize).Items;
    }

    public (IReadOnlyList<WorkRequest> Items, int TotalCount) GetPage(
        WorkRequestStatus? status,
        string? search,
        int page,
        int pageSize)
    {
        using var connection = CreateConnection();
        using var grid = connection.QueryMultiple(
            GetAllProcedure,
            new
            {
                Status = status?.ToString(),
                Search = string.IsNullOrWhiteSpace(search) ? null : search.Trim(),
                Page = page,
                PageSize = pageSize
            },
            commandType: CommandType.StoredProcedure);

        var total = grid.Read<int>().Single();
        var rows = grid.Read<WorkRequestRow>().ToArray();
        var notes = grid.Read<WorkRequestNote>().ToArray();
        return (HydrateNotes(rows, notes), total);
    }

    public WorkRequest? GetById(int id)
    {
        using var connection = CreateConnection();
        using var grid = connection.QueryMultiple(
            GetByIdProcedure,
            new { Id = id },
            commandType: CommandType.StoredProcedure);

        var row = grid.Read<WorkRequestRow>().SingleOrDefault();
        var notes = grid.Read<WorkRequestNote>().ToArray();
        return row is null ? null : HydrateNotes([row], notes).Single();
    }

    public WorkRequest Add(WorkRequest request)
    {
        using var connection = CreateConnection();
        var id = connection.ExecuteScalar<int>(
            CreateProcedure,
            new
            {
                request.Title,
                request.ClientName,
                request.Description,
                Priority = request.Priority.ToString(),
                Status = request.Status.ToString(),
                request.DueDate,
                request.CreatedDate,
                request.UpdatedDate
            },
            commandType: CommandType.StoredProcedure);

        return GetById(id) ?? throw new WorkRequestPersistenceException("Created work request could not be loaded.");
    }

    public WorkRequest Update(WorkRequest request)
    {
        using var connection = CreateConnection();
        connection.Execute(
            UpdateProcedure,
            new
            {
                request.Id,
                request.Title,
                request.ClientName,
                request.Description,
                Priority = request.Priority.ToString(),
                Status = request.Status.ToString(),
                request.DueDate,
                request.UpdatedDate
            },
            commandType: CommandType.StoredProcedure);

        return GetById(request.Id) ?? throw new InvalidOperationException("Updated work request could not be loaded.");
    }

    public WorkRequestNote AddNote(int workRequestId, string noteText, DateTime createdDate)
    {
        using var connection = CreateConnection();
        var note = connection.QuerySingle<WorkRequestNote>(
            AddNoteProcedure,
            new { WorkRequestId = workRequestId, NoteText = noteText, CreatedDate = createdDate },
            commandType: CommandType.StoredProcedure);

        return note;
    }

    private IDbConnection CreateConnection() => _connectionFactory();

    private static IReadOnlyList<WorkRequest> HydrateNotes(
        IReadOnlyList<WorkRequestRow> rows,
        IReadOnlyList<WorkRequestNote> notes)
    {
        var notesByRequestId = notes
            .GroupBy(note => note.WorkRequestId)
            .ToDictionary(group => group.Key, group => group.ToArray());

        return rows.Select(row =>
        {
            var request = row.ToWorkRequest();
            if (notesByRequestId.TryGetValue(request.Id, out var requestNotes))
            {
                request.Notes.AddRange(requestNotes);
            }

            return request;
        }).ToArray();
    }

    private sealed record WorkRequestRow(
        int Id,
        string Title,
        string ClientName,
        string Description,
        string Priority,
        string Status,
        DateTime DueDate,
        DateTime CreatedDate,
        DateTime UpdatedDate)
    {
        public WorkRequest ToWorkRequest() =>
            new()
            {
                Id = Id,
                Title = Title,
                ClientName = ClientName,
                Description = Description,
                Priority = Enum.Parse<WorkRequestPriority>(Priority),
                Status = Enum.Parse<WorkRequestStatus>(Status),
                DueDate = DueDate,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate
            };
    }
}

