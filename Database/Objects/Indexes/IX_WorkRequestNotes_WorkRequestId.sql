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
