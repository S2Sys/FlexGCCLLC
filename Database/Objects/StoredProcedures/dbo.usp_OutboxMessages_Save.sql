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
