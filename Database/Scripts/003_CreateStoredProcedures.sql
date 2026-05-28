SET NOCOUNT ON;
GO

CREATE OR ALTER PROCEDURE dbo.usp_WorkRequests_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Title, ClientName, Description, Priority, Status, DueDate, CreatedDate, UpdatedDate
    FROM dbo.WorkRequests;

    SELECT Id, WorkRequestId, NoteText, CreatedDate
    FROM dbo.WorkRequestNotes
    ORDER BY CreatedDate, Id;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_WorkRequests_GetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Title, ClientName, Description, Priority, Status, DueDate, CreatedDate, UpdatedDate
    FROM dbo.WorkRequests
    WHERE Id = @Id;

    SELECT Id, WorkRequestId, NoteText, CreatedDate
    FROM dbo.WorkRequestNotes
    WHERE WorkRequestId = @Id
    ORDER BY CreatedDate, Id;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_WorkRequests_Create
    @Title NVARCHAR(200),
    @ClientName NVARCHAR(200),
    @Description NVARCHAR(MAX),
    @Priority NVARCHAR(20),
    @Status NVARCHAR(20),
    @DueDate DATETIME2,
    @CreatedDate DATETIME2,
    @UpdatedDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.WorkRequests
        (Title, ClientName, Description, Priority, Status, DueDate, CreatedDate, UpdatedDate)
    OUTPUT INSERTED.Id
    VALUES
        (@Title, @ClientName, @Description, @Priority, @Status, @DueDate, @CreatedDate, @UpdatedDate);
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_WorkRequests_Update
    @Id INT,
    @Title NVARCHAR(200),
    @ClientName NVARCHAR(200),
    @Description NVARCHAR(MAX),
    @Priority NVARCHAR(20),
    @Status NVARCHAR(20),
    @DueDate DATETIME2,
    @UpdatedDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.WorkRequests
    SET Title = @Title,
        ClientName = @ClientName,
        Description = @Description,
        Priority = @Priority,
        Status = @Status,
        DueDate = @DueDate,
        UpdatedDate = @UpdatedDate
    WHERE Id = @Id;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_WorkRequestNotes_Add
    @WorkRequestId INT,
    @NoteText NVARCHAR(MAX),
    @CreatedDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    INSERT INTO dbo.WorkRequestNotes (WorkRequestId, NoteText, CreatedDate)
    OUTPUT INSERTED.Id, INSERTED.WorkRequestId, INSERTED.NoteText, INSERTED.CreatedDate
    VALUES (@WorkRequestId, @NoteText, @CreatedDate);

    UPDATE dbo.WorkRequests
    SET UpdatedDate = @CreatedDate
    WHERE Id = @WorkRequestId;

    COMMIT TRANSACTION;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_OutboxMessages_Save
    @Id        UNIQUEIDENTIFIER,
    @EventType NVARCHAR(200),
    @Payload   NVARCHAR(MAX),
    @CreatedAt DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.OutboxMessages (Id, EventType, Payload, CreatedAt, IsProcessed)
    VALUES (@Id, @EventType, @Payload, @CreatedAt, 0);
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_OutboxMessages_GetPending
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, EventType, Payload, CreatedAt, IsProcessed
    FROM dbo.OutboxMessages
    WHERE IsProcessed = 0
    ORDER BY CreatedAt;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_OutboxMessages_MarkProcessed
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.OutboxMessages
    SET IsProcessed = 1
    WHERE Id = @Id;
END;
GO
