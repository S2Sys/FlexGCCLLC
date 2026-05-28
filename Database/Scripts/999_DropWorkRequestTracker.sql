DROP PROCEDURE IF EXISTS dbo.usp_OutboxMessages_MarkProcessed;
GO

DROP PROCEDURE IF EXISTS dbo.usp_OutboxMessages_GetPending;
GO

DROP PROCEDURE IF EXISTS dbo.usp_OutboxMessages_Save;
GO

DROP PROCEDURE IF EXISTS dbo.usp_WorkRequestNotes_Add;
GO

DROP PROCEDURE IF EXISTS dbo.usp_WorkRequests_Update;
GO

DROP PROCEDURE IF EXISTS dbo.usp_WorkRequests_Create;
GO

DROP PROCEDURE IF EXISTS dbo.usp_WorkRequests_GetById;
GO

DROP PROCEDURE IF EXISTS dbo.usp_WorkRequests_GetAll;
GO

IF OBJECT_ID(N'dbo.OutboxMessages', N'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.OutboxMessages;
END;
GO

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
