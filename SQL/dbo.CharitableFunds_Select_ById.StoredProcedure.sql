USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[CharitableFunds_Select_ById]    Script Date: 1/25/2023 7:29:53 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROC [dbo].[CharitableFunds_Select_ById]
			@Id int

/*

DECLARE @Id int = 4;

EXECUTE CharitableFunds_Select_ById @Id

SELECT *
FROM dbo.CharitableFunds

*/

AS

BEGIN

SELECT	c.Id
		,c.Name
		,c.Description
		,c.Url
		,c.DateAdded
		,c.DateModified
		,c.CreatedBy
		,l.Id
		,l.LocationTypeId
		,l.LineOne
		,l.City
		,l.Zip
	   

 FROM	dbo.CharitableFunds AS c
		INNER JOIN dbo.Locations AS l
   ON	c.Id = l.Id
WHERE	c.Id = @Id

END
GO
