-- Database-level validation for Booking (safety net)
-- Safe to re-run: drops/recreates named CHECK constraints if present.

IF COL_LENGTH('dbo.Booking', 'name') IS NOT NULL
BEGIN
  IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Booking_name_len')
    ALTER TABLE dbo.Booking DROP CONSTRAINT CK_Booking_name_len;
  ALTER TABLE dbo.Booking ADD CONSTRAINT CK_Booking_name_len
    CHECK (LEN(LTRIM(RTRIM(name))) >= 2 AND LEN(name) <= 150);
END
GO

IF COL_LENGTH('dbo.Booking', 'phone') IS NOT NULL
BEGIN
  IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Booking_phone_len')
    ALTER TABLE dbo.Booking DROP CONSTRAINT CK_Booking_phone_len;
  ALTER TABLE dbo.Booking ADD CONSTRAINT CK_Booking_phone_len
    CHECK (LEN(LTRIM(RTRIM(phone))) >= 7 AND LEN(phone) <= 30);
END
GO

IF COL_LENGTH('dbo.Booking', 'email') IS NOT NULL
BEGIN
  IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Booking_email_format')
    ALTER TABLE dbo.Booking DROP CONSTRAINT CK_Booking_email_format;
  ALTER TABLE dbo.Booking ADD CONSTRAINT CK_Booking_email_format
    CHECK (
      email IS NULL
      OR (
        LEN(email) <= 150
        AND CHARINDEX('@', email) > 1
        AND CHARINDEX('.', email) > CHARINDEX('@', email)
      )
    );
END
GO

IF COL_LENGTH('dbo.Booking', 'status') IS NOT NULL
BEGIN
  IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Booking_status')
    ALTER TABLE dbo.Booking DROP CONSTRAINT CK_Booking_status;
  ALTER TABLE dbo.Booking ADD CONSTRAINT CK_Booking_status
    CHECK (status IN (N'pending', N'confirmed', N'done', N'cancelled'));
END
GO

IF COL_LENGTH('dbo.Booking', 'address') IS NOT NULL
BEGIN
  IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Booking_address_len')
    ALTER TABLE dbo.Booking DROP CONSTRAINT CK_Booking_address_len;
  ALTER TABLE dbo.Booking ADD CONSTRAINT CK_Booking_address_len
    CHECK (address IS NULL OR LEN(address) <= 500);
END
GO

SELECT 'Booking CHECK constraints ready' AS status;
GO
