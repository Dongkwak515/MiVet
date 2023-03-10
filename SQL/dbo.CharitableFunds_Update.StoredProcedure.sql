USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[CharitableFunds_Update]    Script Date: 1/25/2023 7:29:53 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROC [dbo].[CharitableFunds_Update]
			@Id int
			,@Name nvarchar(50)
			,@Description nvarchar(1000)
			,@Url nvarchar(255)
			,@CreatedBy int

/*

DECLARE		@Id int = 12
			,@Name nvarchar(50) = 'ENDURANCE YOUNG RIDER PROGRAM'
			,@Description nvarchar(1000)= 'Help build the future of equestrian sport by donating to the Endurance Young Rider Program.

											Your support offsets the expenses of fielding a team to represent the United States in international competition. Some of these expenses include team travel, accommodations, training sessions, and other related expenses.

											Your generous support not only ensures the success of the Young Rider Program, but also helps to put endurance in the spotlight.

											Thank you for your generosity and support!'
			,@Url nvarchar(255) = 'https://www.usequestrian.org/compete/disciplines/endurance/endurance-standings---year-end-awards'
			,@CreatedBy int = 145

SELECT *
FROM dbo.CharitableFunds
WHERE Id = @Id

EXECUTE dbo.CharitableFunds_Update
			@Id
			,@Name
			,@Description
			,@Url
			,@CreatedBy

SELECT *
FROM dbo.CharitableFunds
WHERE Id = @Id

*/

AS

BEGIN

UPDATE	[dbo].[CharitableFunds]
   SET	[Name] = @Name
		,[Description] = @Description
		,[Url] = @Url
		,[DateModified] = GETUTCDATE()
		,[CreatedBy] = @CreatedBy
 WHERE [Id] = @Id

END
GO
