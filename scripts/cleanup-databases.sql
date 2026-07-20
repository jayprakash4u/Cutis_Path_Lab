-- Keep CutisPathLab only; remove other user databases on SQLEXPRESS
SET NOCOUNT ON;

IF DB_ID(N'CutisPathLab') IS NOT NULL
BEGIN
  ALTER DATABASE CutisPathLab SET ONLINE;
END
GO

DECLARE @db SYSNAME;
DECLARE @sql NVARCHAR(4000);

DECLARE db_cursor CURSOR LOCAL FAST_FORWARD FOR
SELECT name
FROM sys.databases
WHERE name NOT IN (N'master', N'model', N'msdb', N'tempdb', N'CutisPathLab');

OPEN db_cursor;
FETCH NEXT FROM db_cursor INTO @db;

WHILE @@FETCH_STATUS = 0
BEGIN
  SET @sql = N'ALTER DATABASE [' + REPLACE(@db, ']', ']]') + N'] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;';
  EXEC (@sql);
  SET @sql = N'DROP DATABASE [' + REPLACE(@db, ']', ']]') + N'];';
  EXEC (@sql);
  PRINT N'Dropped: ' + @db;
  FETCH NEXT FROM db_cursor INTO @db;
END

CLOSE db_cursor;
DEALLOCATE db_cursor;
GO

EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'max server memory (MB)', 2048;
RECONFIGURE;
GO

SELECT name, state_desc FROM sys.databases ORDER BY name;
GO
