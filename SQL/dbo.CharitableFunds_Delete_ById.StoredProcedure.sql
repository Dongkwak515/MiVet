USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[CharitableFunds_Delete_ById]    Script Date: 1/25/2023 7:29:53 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROC [dbo].[CharitableFunds_Delete_ById]
			@Id int

AS

/*

DECLARE @Id int = 3

SELECT *
FROM dbo.CharitableFunds
WHERE [Id] = @Id

EXECUTE dbo.CharitableFunds_Delete_ById
			@Id

SELECT *
FROM dbo.CharitableFunds
WHERE [Id] = @Id

*/


BEGIN

DELETE FROM dbo.CharitableFunds
	  WHERE	[Id] = @Id

END
GO
