USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Donations_Select_ById]    Script Date: 12/13/2022 10:23:15 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Dong Yoong Kwak
-- Create date: November 29, 2022
-- Description: Proc for inserting donations to DB
-- Code Reviewer: Butchan Crawford

-- MODIFIED BY: Author
-- MODIFIED DATE: 12/9/2022
-- Code Reviewer: James L Harriss
-- Note:
-- =============================================


CREATE PROC [dbo].[Donations_Select_ById]
		@Id int		

/*

DECLARE @Id int = 1;

EXECUTE Donations_Select_ById @Id

SELECT *
FROM dbo.Donations

*/

AS

BEGIN

SELECT [Id]
		,[CharitableFundId]
		,[OrderId]
		,[UnitCost]
		,[CreatedBy]
		,[DateCreated]
  FROM	[dbo].[Donations]
 WHERE	Id = @Id

END
GO
