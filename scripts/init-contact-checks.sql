-- Database-level validation for ContactMessage
-- WITH NOCHECK where needed so existing rows don't block constraint creation;
-- new inserts/updates are still validated.

IF COL_LENGTH('dbo.ContactMessage', 'name') IS NOT NULL
BEGIN
  IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Contact_name_len')
    ALTER TABLE dbo.ContactMessage DROP CONSTRAINT CK_Contact_name_len;
  ALTER TABLE dbo.ContactMessage WITH NOCHECK ADD CONSTRAINT CK_Contact_name_len
    CHECK (LEN(LTRIM(RTRIM(name))) >= 2 AND LEN(name) <= 150);
END
GO

IF COL_LENGTH('dbo.ContactMessage', 'email') IS NOT NULL
BEGIN
  IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Contact_email_format')
    ALTER TABLE dbo.ContactMessage DROP CONSTRAINT CK_Contact_email_format;
  ALTER TABLE dbo.ContactMessage WITH NOCHECK ADD CONSTRAINT CK_Contact_email_format
    CHECK (
      LEN(email) BETWEEN 3 AND 150
      AND CHARINDEX('@', email) > 1
      AND CHARINDEX('.', email) > CHARINDEX('@', email)
    );
END
GO

IF COL_LENGTH('dbo.ContactMessage', 'message') IS NOT NULL
BEGIN
  IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Contact_message_len')
    ALTER TABLE dbo.ContactMessage DROP CONSTRAINT CK_Contact_message_len;
  ALTER TABLE dbo.ContactMessage WITH NOCHECK ADD CONSTRAINT CK_Contact_message_len
    CHECK (LEN(LTRIM(RTRIM(message))) >= 10);
END
GO

IF COL_LENGTH('dbo.ContactMessage', 'phone') IS NOT NULL
BEGIN
  IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Contact_phone_len')
    ALTER TABLE dbo.ContactMessage DROP CONSTRAINT CK_Contact_phone_len;
  ALTER TABLE dbo.ContactMessage WITH NOCHECK ADD CONSTRAINT CK_Contact_phone_len
    CHECK (phone IS NULL OR (LEN(phone) >= 7 AND LEN(phone) <= 30));
END
GO

SELECT name, is_disabled, is_not_trusted
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID('dbo.ContactMessage');
GO

SELECT 'ContactMessage CHECK constraints ready' AS status;
GO
