-- Packages schema
IF OBJECT_ID('dbo.PackageTest', 'U') IS NOT NULL DROP TABLE dbo.PackageTest;
IF OBJECT_ID('dbo.Package', 'U') IS NOT NULL DROP TABLE dbo.Package;
GO

CREATE TABLE dbo.Package (
  id NVARCHAR(50) NOT NULL PRIMARY KEY,
  code NVARCHAR(50) NOT NULL UNIQUE,
  name NVARCHAR(255) NOT NULL,
  category NVARCHAR(100) NOT NULL,
  description NVARCHAR(MAX) NULL,
  price FLOAT NOT NULL,
  originalPrice FLOAT NULL,
  imageUrl NVARCHAR(500) NULL,
  reportsTime NVARCHAR(50) NULL,
  fasting NVARCHAR(50) NULL,
  sampleType NVARCHAR(50) NULL,
  createdAt DATETIME2 NOT NULL CONSTRAINT DF_Package_created DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2 NOT NULL CONSTRAINT DF_Package_updated DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.PackageTest (
  id NVARCHAR(50) NOT NULL PRIMARY KEY,
  packageId NVARCHAR(50) NOT NULL,
  testId NVARCHAR(50) NULL,
  testName NVARCHAR(255) NOT NULL,
  sortOrder INT NOT NULL CONSTRAINT DF_PackageTest_sort DEFAULT 0,
  CONSTRAINT FK_PackageTest_Package FOREIGN KEY (packageId) REFERENCES dbo.Package(id) ON DELETE CASCADE,
  CONSTRAINT FK_PackageTest_Test FOREIGN KEY (testId) REFERENCES dbo.Test(id) ON DELETE SET NULL
);
GO

IF COL_LENGTH('dbo.Booking', 'packageId') IS NULL
BEGIN
  ALTER TABLE dbo.Booking ADD packageId NVARCHAR(50) NULL;
END
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Booking_Package'
)
BEGIN
  ALTER TABLE dbo.Booking
  ADD CONSTRAINT FK_Booking_Package FOREIGN KEY (packageId) REFERENCES dbo.Package(id);
END
GO

SELECT 'Package tables ready' AS status;
GO
