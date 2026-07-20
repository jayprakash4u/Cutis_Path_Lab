-- Gallery images (public page + admin CRUD)
IF OBJECT_ID('dbo.GalleryImage', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.GalleryImage (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    title NVARCHAR(255) NULL,
    caption NVARCHAR(500) NULL,
    imageUrl NVARCHAR(500) NOT NULL,
    altText NVARCHAR(255) NULL,
    isActive BIT NOT NULL CONSTRAINT DF_GalleryImage_active DEFAULT 1,
    sortOrder INT NOT NULL CONSTRAINT DF_GalleryImage_sort DEFAULT 0,
    createdAt DATETIME2 NOT NULL CONSTRAINT DF_GalleryImage_created DEFAULT SYSUTCDATETIME(),
    updatedAt DATETIME2 NOT NULL CONSTRAINT DF_GalleryImage_updated DEFAULT SYSUTCDATETIME()
  );
END
GO

SELECT 'GalleryImage ready' AS status;
GO
