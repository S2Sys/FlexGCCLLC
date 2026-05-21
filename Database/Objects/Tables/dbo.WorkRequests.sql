IF OBJECT_ID(N'dbo.WorkRequests', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.WorkRequests (
        Id INT IDENTITY(1,1) NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        ClientName NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        Priority NVARCHAR(20) NOT NULL,
        Status NVARCHAR(20) NOT NULL,
        DueDate DATETIME2 NOT NULL,
        CreatedDate DATETIME2 NOT NULL,
        UpdatedDate DATETIME2 NOT NULL,
        CONSTRAINT PK_WorkRequests PRIMARY KEY CLUSTERED (Id),
        CONSTRAINT CK_WorkRequests_Priority CHECK (Priority IN (N'Low', N'Medium', N'High')),
        CONSTRAINT CK_WorkRequests_Status CHECK (Status IN (N'New', N'InProgress', N'Blocked', N'Completed'))
    );
END;
GO
