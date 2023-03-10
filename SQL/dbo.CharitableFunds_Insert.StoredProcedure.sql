USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[CharitableFunds_Insert]    Script Date: 1/25/2023 7:29:53 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROC [dbo].[CharitableFunds_Insert]
			@Name nvarchar(50)
			,@Description nvarchar(1000)
			,@Url nvarchar(255)
			,@CreatedBy int
			,@Id int OUTPUT

/*

DECLARE @Id int = 0

DECLARE		@Name nvarchar(50) = 'USEF HELMET RESEARCH SAFETY FUND'
			,@Description nvarchar(1000) = 'The USEF Helmet Research Safety Fund is a fundraising effort to further the safety of equestrian athletes across all breeds and disciplines. The fund will support further research into U.S. helmet safety standards and create a rating system that gives individuals insight into how helmet models compare when looking at safety and protection. Partnering with the Virginia Tech Helmet Lab, 100% of funds raised will support the independent research in the development of this important rating system.    To date, the Virginia Tech Helmet Lab has developed safety ratings for sports including football, cycling, hockey, and baseball. Since 2011, Virginia Tech researchers have been providing unbiased helmet ratings that allow consumers to make informed decisions when purchasing helmets. The helmet ratings are the culmination of over 10 years of research on head impacts in sports and identify which helmets best reduce concussion risk.
'
			,@Url nvarchar(255) = 'https://www.usef.org/media/press-releases/helmet-safety-initiative-reaches-450000
'
			,@CreatedBy int = 145

EXECUTE dbo.CharitableFunds_Insert
			@Name
			,@Description
			,@Url
			,@CreatedBy
			,@Id OUTPUT

SELECT @Id

SELECT *
FROM dbo.CharitableFunds
WHERE Id = @Id

*/

AS

BEGIN

INSERT INTO [dbo].[CharitableFunds]
			([Name]
			,[Description]
			,[Url]
			,[CreatedBy])
		VALUES
			(@Name
			,@Description
			,@Url
			,@CreatedBy)

SET @Id = SCOPE_IDENTITY()

END
GO
