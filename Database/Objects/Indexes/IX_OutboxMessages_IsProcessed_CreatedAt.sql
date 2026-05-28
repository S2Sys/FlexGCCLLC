IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_OutboxMessages_IsProcessed_CreatedAt'
      AND object_id = OBJECT_ID(N'dbo.OutboxMessages')
)
BEGIN
    CREATE INDEX IX_OutboxMessages_IsProcessed_CreatedAt
    ON dbo.OutboxMessages (IsProcessed, CreatedAt);
END;
GO
