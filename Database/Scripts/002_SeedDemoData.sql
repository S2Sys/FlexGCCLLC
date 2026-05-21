SET NOCOUNT ON;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.WorkRequests WHERE Title = N'Prepare client onboarding checklist')
BEGIN
    INSERT INTO dbo.WorkRequests
        (Title, ClientName, Description, Priority, Status, DueDate, CreatedDate, UpdatedDate)
    VALUES
        (
            N'Prepare client onboarding checklist',
            N'Northwind Advisory',
            N'Create a short checklist for the new operations handoff.',
            N'High',
            N'New',
            DATEADD(DAY, 1, SYSUTCDATETIME()),
            SYSUTCDATETIME(),
            SYSUTCDATETIME()
        );
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.WorkRequests WHERE Title = N'Fix monthly report export')
BEGIN
    INSERT INTO dbo.WorkRequests
        (Title, ClientName, Description, Priority, Status, DueDate, CreatedDate, UpdatedDate)
    VALUES
        (
            N'Fix monthly report export',
            N'BluePeak Finance',
            N'Investigate missing totals in the CSV export.',
            N'Medium',
            N'InProgress',
            DATEADD(DAY, 2, SYSUTCDATETIME()),
            SYSUTCDATETIME(),
            SYSUTCDATETIME()
        );
END;
GO

DECLARE @MonthlyReportId INT;

SELECT @MonthlyReportId = Id
FROM dbo.WorkRequests
WHERE Title = N'Fix monthly report export';

IF @MonthlyReportId IS NOT NULL
   AND NOT EXISTS (
       SELECT 1
       FROM dbo.WorkRequestNotes
       WHERE WorkRequestId = @MonthlyReportId
         AND NoteText = N'Issue reproduced with March sample data.'
   )
BEGIN
    INSERT INTO dbo.WorkRequestNotes (WorkRequestId, NoteText, CreatedDate)
    VALUES (@MonthlyReportId, N'Issue reproduced with March sample data.', SYSUTCDATETIME());
END;
GO
