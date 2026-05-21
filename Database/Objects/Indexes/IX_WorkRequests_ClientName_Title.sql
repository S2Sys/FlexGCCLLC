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
