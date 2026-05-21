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
