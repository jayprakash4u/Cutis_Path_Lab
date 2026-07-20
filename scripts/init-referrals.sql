IF OBJECT_ID('dbo.ReferralDoctor', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.ReferralDoctor (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    specialization NVARCHAR(150) NOT NULL,
    hospital NVARCHAR(255) NULL,
    quote NVARCHAR(MAX) NOT NULL,
    imageUrl NVARCHAR(500) NULL,
    isActive BIT NOT NULL CONSTRAINT DF_ReferralDoctor_active DEFAULT 1,
    sortOrder INT NOT NULL CONSTRAINT DF_ReferralDoctor_sort DEFAULT 0,
    createdAt DATETIME2 NOT NULL CONSTRAINT DF_ReferralDoctor_created DEFAULT SYSUTCDATETIME(),
    updatedAt DATETIME2 NOT NULL CONSTRAINT DF_ReferralDoctor_updated DEFAULT SYSUTCDATETIME()
  );
END;
GO

SELECT 'ReferralDoctor ready' AS status;
