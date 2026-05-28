CREATE OR ALTER PROCEDURE dbo.usp_OutboxMessages_MarkProcessed
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.OutboxMessages
    SET IsProcessed = 1
    WHERE Id = @Id;
END;
GO
