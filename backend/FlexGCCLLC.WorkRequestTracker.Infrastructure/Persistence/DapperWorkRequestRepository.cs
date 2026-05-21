using System.Data;
using Dapper;
using FlexGCCLLC.WorkRequestTracker.Application.WorkRequests;
using FlexGCCLLC.WorkRequestTracker.Domain.WorkRequests;
using Microsoft.Data.SqlClient;

namespace FlexGCCLLC.WorkRequestTracker.Infrastructure.Persistence;

public sealed class DapperWorkRequestRepository : IWorkRequestRepository
{
    private const string GetAllProcedure = "dbo.usp_WorkRequests_GetAll";
    private const string GetByIdProcedure = "dbo.usp_WorkRequests_GetById";
    private const string CreateProcedure = "dbo.usp_WorkRequests_Create";
    private const string UpdateProcedure = "dbo.usp_WorkRequests_Update";
    private const string AddNoteProcedure = "dbo.usp_WorkRequestNotes_Add";

    private readonly string _connectionString;

    public DapperWorkRequestRepository(string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new ArgumentException("A SQL Server connection string is required.", nameof(connectionString));
        }

        _connectionString = connectionString;
    }

    public IReadOnlyList<WorkRequest> GetAll()
    {
        using var connection = CreateConnection();
        using var grid = connection.QueryMultiple(
            GetAllProcedure,
            commandType: CommandType.StoredProcedure);

        var rows = grid.Read<WorkRequestRow>().ToArray();
        var notes = grid.Read<WorkRequestNote>().ToArray();
        return HydrateNotes(rows, notes);
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

        return GetById(id) ?? throw new InvalidOperationException("Created work request could not be loaded.");
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

    private SqlConnection CreateConnection() => new(_connectionString);

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
