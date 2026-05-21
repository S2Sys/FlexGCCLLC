using Dapper;
using FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Models;
using Microsoft.Data.SqlClient;

namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests;

public sealed class DapperWorkRequestRepository : IWorkRequestRepository
{
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
        var rows = connection.Query<WorkRequestRow>(
            """
            SELECT Id, Title, ClientName, Description, Priority, Status, DueDate, CreatedDate, UpdatedDate
            FROM dbo.WorkRequests;
            """).ToArray();

        return HydrateNotes(connection, rows);
    }

    public WorkRequest? GetById(int id)
    {
        using var connection = CreateConnection();
        var row = connection.QuerySingleOrDefault<WorkRequestRow>(
            """
            SELECT Id, Title, ClientName, Description, Priority, Status, DueDate, CreatedDate, UpdatedDate
            FROM dbo.WorkRequests
            WHERE Id = @Id;
            """,
            new { Id = id });

        return row is null ? null : HydrateNotes(connection, [row]).Single();
    }

    public WorkRequest Add(WorkRequest request)
    {
        using var connection = CreateConnection();
        var id = connection.ExecuteScalar<int>(
            """
            INSERT INTO dbo.WorkRequests
                (Title, ClientName, Description, Priority, Status, DueDate, CreatedDate, UpdatedDate)
            OUTPUT INSERTED.Id
            VALUES
                (@Title, @ClientName, @Description, @Priority, @Status, @DueDate, @CreatedDate, @UpdatedDate);
            """,
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
            });

        return GetById(id) ?? throw new InvalidOperationException("Created work request could not be loaded.");
    }

    public WorkRequest Update(WorkRequest request)
    {
        using var connection = CreateConnection();
        connection.Execute(
            """
            UPDATE dbo.WorkRequests
            SET Title = @Title,
                ClientName = @ClientName,
                Description = @Description,
                Priority = @Priority,
                Status = @Status,
                DueDate = @DueDate,
                UpdatedDate = @UpdatedDate
            WHERE Id = @Id;
            """,
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
            });

        return GetById(request.Id) ?? throw new InvalidOperationException("Updated work request could not be loaded.");
    }

    public WorkRequestNote AddNote(int workRequestId, string noteText, DateTime createdDate)
    {
        using var connection = CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        var noteId = connection.ExecuteScalar<int>(
            """
            INSERT INTO dbo.WorkRequestNotes (WorkRequestId, NoteText, CreatedDate)
            OUTPUT INSERTED.Id
            VALUES (@WorkRequestId, @NoteText, @CreatedDate);
            """,
            new { WorkRequestId = workRequestId, NoteText = noteText, CreatedDate = createdDate },
            transaction);

        connection.Execute(
            """
            UPDATE dbo.WorkRequests
            SET UpdatedDate = @UpdatedDate
            WHERE Id = @WorkRequestId;
            """,
            new { WorkRequestId = workRequestId, UpdatedDate = createdDate },
            transaction);

        transaction.Commit();

        return new WorkRequestNote
        {
            Id = noteId,
            WorkRequestId = workRequestId,
            NoteText = noteText,
            CreatedDate = createdDate
        };
    }

    private SqlConnection CreateConnection() => new(_connectionString);

    private static IReadOnlyList<WorkRequest> HydrateNotes(SqlConnection connection, IReadOnlyList<WorkRequestRow> rows)
    {
        if (rows.Count == 0)
        {
            return [];
        }

        var notes = connection.Query<WorkRequestNote>(
            """
            SELECT Id, WorkRequestId, NoteText, CreatedDate
            FROM dbo.WorkRequestNotes
            WHERE WorkRequestId IN @Ids
            ORDER BY CreatedDate, Id;
            """,
            new { Ids = rows.Select(row => row.Id).ToArray() });

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
