USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Donations_Insert]    Script Date: 12/13/2022 10:23:15 AM ******/
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


CREATE PROC [dbo].[Donations_Insert]
				@CharitableFundId int
				,@OrderId nvarchar(100)
				,@UnitCost int
				,@CreatedBy int
				,@Id int OUTPUT
/*

DECLARE @Id int = 0

DECLARE		@CharitableFundId int = 1
			,@OrderId nvarchar(100) = '
			,@UnitCost int = 100
			,@CreatedBy int = 145

EXECUTE	dbo.Donations_Insert
			@CharitableFundId
			,@OrderId
			,@UnitCost
			,@CreatedBy
			,@Id OUTPUT

SELECT @Id

SELECT *
FROM dbo.Donations
WHERE Id = @Id

*/

AS

BEGIN

INSERT INTO [dbo].[Donations]
			([CharitableFundId]
			,[OrderId]
			,[UnitCost]
			,[CreatedBy])

	  VALUES
			(@CharitableFundId
			,@OrderId
			,@UnitCost
			,@CreatedBy)

SET @Id = SCOPE_IDENTITY()

END
GO
