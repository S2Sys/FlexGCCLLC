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
