IF OBJECT_ID(N'dbo.OutboxMessages', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.OutboxMessages (
        Id          UNIQUEIDENTIFIER NOT NULL,
        EventType   NVARCHAR(200)    NOT NULL,
        Payload     NVARCHAR(MAX)    NOT NULL,
        CreatedAt   DATETIME2        NOT NULL,
        IsProcessed BIT              NOT NULL CONSTRAINT DF_OutboxMessages_IsProcessed DEFAULT 0,
        CONSTRAINT PK_OutboxMessages PRIMARY KEY CLUSTERED (Id)
    );
END;
GO
