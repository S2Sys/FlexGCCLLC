SET NOCOUNT ON;
GO

IF OBJECT_ID(N'dbo.WorkRequests', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.WorkRequests (
        Id INT IDENTITY(1,1) NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        ClientName NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        Priority NVARCHAR(20) NOT NULL,
        Status NVARCHAR(20) NOT NULL,
        DueDate DATETIME2 NOT NULL,
        CreatedDate DATETIME2 NOT NULL,
        UpdatedDate DATETIME2 NOT NULL,
        CONSTRAINT PK_WorkRequests PRIMARY KEY CLUSTERED (Id),
        CONSTRAINT CK_WorkRequests_Priority CHECK (Priority IN (N'Low', N'Medium', N'High')),
        CONSTRAINT CK_WorkRequests_Status CHECK (Status IN (N'New', N'InProgress', N'Blocked', N'Completed'))
    );
END;
GO

IF OBJECT_ID(N'dbo.WorkRequestNotes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.WorkRequestNotes (
        Id INT IDENTITY(1,1) NOT NULL,
        WorkRequestId INT NOT NULL,
        NoteText NVARCHAR(MAX) NOT NULL,
        CreatedDate DATETIME2 NOT NULL,
        CONSTRAINT PK_WorkRequestNotes PRIMARY KEY CLUSTERED (Id),
        CONSTRAINT FK_WorkRequestNotes_WorkRequests
            FOREIGN KEY (WorkRequestId) REFERENCES dbo.WorkRequests(Id)
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_WorkRequests_Status_DueDate'
      AND object_id = OBJECT_ID(N'dbo.WorkRequests')
)
BEGIN
    CREATE INDEX IX_WorkRequests_Status_DueDate
    ON dbo.WorkRequests (Status, DueDate);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_WorkRequests_ClientName_Title'
      AND object_id = OBJECT_ID(N'dbo.WorkRequests')
)
BEGIN
    CREATE INDEX IX_WorkRequests_ClientName_Title
    ON dbo.WorkRequests (ClientName, Title);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_WorkRequestNotes_WorkRequestId'
      AND object_id = OBJECT_ID(N'dbo.WorkRequestNotes')
)
BEGIN
    CREATE INDEX IX_WorkRequestNotes_WorkRequestId
    ON dbo.WorkRequestNotes (WorkRequestId);
END;
GO
