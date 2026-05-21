IF OBJECT_ID(N'dbo.WorkRequestNotes', N'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.WorkRequestNotes;
END;
GO

IF OBJECT_ID(N'dbo.WorkRequests', N'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.WorkRequests;
END;
GO
