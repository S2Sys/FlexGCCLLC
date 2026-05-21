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
