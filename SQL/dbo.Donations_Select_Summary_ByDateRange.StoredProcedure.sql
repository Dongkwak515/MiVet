USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Donations_Select_Summary_ByDateRange]    Script Date: 12/13/2022 10:23:15 AM ******/
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


CREATE PROC [dbo].[Donations_Select_Summary_ByDateRange]
				@DateStart datetime2(7)
				,@DateEnd datetime2(7)
				,@PageIndex int
				,@PageSize int

/*

DECLARE	@DateStart datetime2(7) = '2022-11-29' 
		,@DateEnd datetime2(7) =  '2022-11-30'
		,@pageIndex int = 0
		,@pageSize int = 10

EXECUTE dbo.Donations_Select_Summary_ByDateRange
				@DateStart
				,@DateEnd
				,@PageIndex
				,@PageSize

SELECT *
FROM dbo.Donations

*/

AS 

BEGIN

DECLARE @offset int = @PageIndex * @PageSize

SELECT [Id]
      ,[CharitableFundId]
	  ,[OrderId]
      ,[UnitCost]
      ,[CreatedBy]
      ,[DateCreated]
  FROM [dbo].[Donations]
 WHERE DateCreated >= @DateStart AND
	   DateCreated <= @DateEnd
 ORDER BY DateCreated

OFFSET @offset Rows
Fetch Next @PageSize Rows ONLY

END
GO
