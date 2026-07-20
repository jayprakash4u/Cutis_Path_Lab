-- Junction: disease Category <-> Test (many-to-many)
IF OBJECT_ID('dbo.CategoryTest', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.CategoryTest (
    categoryId NVARCHAR(50) NOT NULL,
    testId NVARCHAR(50) NOT NULL,
    sortOrder INT NOT NULL CONSTRAINT DF_CategoryTest_sort DEFAULT 0,
    createdAt DATETIME2 NOT NULL CONSTRAINT DF_CategoryTest_created DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_CategoryTest PRIMARY KEY (categoryId, testId)
  );
END
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_CategoryTest_Category'
)
BEGIN
  ALTER TABLE dbo.CategoryTest
  ADD CONSTRAINT FK_CategoryTest_Category
  FOREIGN KEY (categoryId) REFERENCES dbo.Category(id) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_CategoryTest_Test'
)
BEGIN
  ALTER TABLE dbo.CategoryTest
  ADD CONSTRAINT FK_CategoryTest_Test
  FOREIGN KEY (testId) REFERENCES dbo.Test(id) ON DELETE CASCADE;
END
GO

SELECT 'CategoryTest ready' AS status;
GO
