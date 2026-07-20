-- Homepage content: Offer, Testimonial, Category
IF OBJECT_ID('dbo.Offer', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Offer (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    category NVARCHAR(100) NOT NULL,
    originalPrice FLOAT NOT NULL,
    discountedPrice FLOAT NOT NULL,
    discountPercent INT NOT NULL CONSTRAINT DF_Offer_discount DEFAULT 0,
    reportsTime NVARCHAR(50) NULL,
    fasting NVARCHAR(50) NULL,
    sampleType NVARCHAR(50) NULL,
    packageId NVARCHAR(50) NULL,
    testId NVARCHAR(50) NULL,
    isActive BIT NOT NULL CONSTRAINT DF_Offer_active DEFAULT 1,
    sortOrder INT NOT NULL CONSTRAINT DF_Offer_sort DEFAULT 0,
    createdAt DATETIME2 NOT NULL CONSTRAINT DF_Offer_created DEFAULT SYSUTCDATETIME(),
    updatedAt DATETIME2 NOT NULL CONSTRAINT DF_Offer_updated DEFAULT SYSUTCDATETIME()
  );
END
GO

IF OBJECT_ID('dbo.Testimonial', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Testimonial (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    role NVARCHAR(100) NULL,
    content NVARCHAR(MAX) NOT NULL,
    rating INT NOT NULL CONSTRAINT DF_Testimonial_rating DEFAULT 5,
    imageUrl NVARCHAR(500) NULL,
    featured BIT NOT NULL CONSTRAINT DF_Testimonial_featured DEFAULT 1,
    isActive BIT NOT NULL CONSTRAINT DF_Testimonial_active DEFAULT 1,
    sortOrder INT NOT NULL CONSTRAINT DF_Testimonial_sort DEFAULT 0,
    createdAt DATETIME2 NOT NULL CONSTRAINT DF_Testimonial_created DEFAULT SYSUTCDATETIME()
  );
END
GO

IF OBJECT_ID('dbo.Category', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Category (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    label NVARCHAR(100) NOT NULL,
    slug NVARCHAR(100) NOT NULL UNIQUE,
    imageUrl NVARCHAR(500) NULL,
    isActive BIT NOT NULL CONSTRAINT DF_Category_active DEFAULT 1,
    sortOrder INT NOT NULL CONSTRAINT DF_Category_sort DEFAULT 0,
    createdAt DATETIME2 NOT NULL CONSTRAINT DF_Category_created DEFAULT SYSUTCDATETIME()
  );
END
GO

SELECT 'Offer/Testimonial/Category ready' AS status;
GO

-- Disease category ↔ Test links (safe if Category/Test already exist)
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
