-- ---------------------------------------------------------------
-- Cutis Path Lab — MySQL 8 schema
-- Ported from the original SQL Server DDL (scripts/init-*.sql).
-- Safe to re-run: every object is created IF NOT EXISTS.
--   npm run db:init
-- ---------------------------------------------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

-- ── Catalog ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `Test` (
  `id`              VARCHAR(50)   NOT NULL,
  `code`            VARCHAR(50)   NOT NULL,
  `name`            VARCHAR(255)  NOT NULL,
  `category`        VARCHAR(100)  NOT NULL,
  `price`           DECIMAL(10,2) NOT NULL,
  `originalPrice`   DECIMAL(10,2) NULL,
  `description`     TEXT          NULL,
  `sampleType`      VARCHAR(50)   NULL,
  `fastingRequired` TINYINT(1)    NOT NULL DEFAULT 0,
  `reportTime`      VARCHAR(50)   NULL,
  `parameters`      INT           NULL,
  `popular`         TINYINT(1)    NOT NULL DEFAULT 0,
  `iconUrl`         VARCHAR(500)  NULL,
  `createdAt`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_Test_code` (`code`),
  KEY `IX_Test_category` (`category`),
  KEY `IX_Test_popular` (`popular`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Package` (
  `id`            VARCHAR(50)   NOT NULL,
  `code`          VARCHAR(50)   NOT NULL,
  `name`          VARCHAR(255)  NOT NULL,
  `category`      VARCHAR(100)  NOT NULL,
  `description`   TEXT          NULL,
  `price`         DECIMAL(10,2) NOT NULL,
  `originalPrice` DECIMAL(10,2) NULL,
  `imageUrl`      VARCHAR(500)  NULL,
  `reportsTime`   VARCHAR(50)   NULL,
  `fasting`       VARCHAR(50)   NULL,
  `sampleType`    VARCHAR(50)   NULL,
  `createdAt`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_Package_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PackageTest` (
  `id`        VARCHAR(50)  NOT NULL,
  `packageId` VARCHAR(50)  NOT NULL,
  `testId`    VARCHAR(50)  NULL,
  `testName`  VARCHAR(255) NOT NULL,
  `sortOrder` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `IX_PackageTest_package` (`packageId`),
  KEY `IX_PackageTest_test` (`testId`),
  CONSTRAINT `FK_PackageTest_Package` FOREIGN KEY (`packageId`) REFERENCES `Package` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_PackageTest_Test`    FOREIGN KEY (`testId`)    REFERENCES `Test` (`id`)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Category` (
  `id`        VARCHAR(50)  NOT NULL,
  `label`     VARCHAR(100) NOT NULL,
  `slug`      VARCHAR(100) NOT NULL,
  `imageUrl`  VARCHAR(500) NULL,
  `isActive`  TINYINT(1)   NOT NULL DEFAULT 1,
  `sortOrder` INT          NOT NULL DEFAULT 0,
  `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_Category_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CategoryTest` (
  `categoryId` VARCHAR(50) NOT NULL,
  `testId`     VARCHAR(50) NOT NULL,
  `sortOrder`  INT         NOT NULL DEFAULT 0,
  `createdAt`  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoryId`, `testId`),
  KEY `IX_CategoryTest_test` (`testId`),
  CONSTRAINT `FK_CategoryTest_Category` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_CategoryTest_Test`     FOREIGN KEY (`testId`)     REFERENCES `Test` (`id`)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Offer` (
  `id`              VARCHAR(50)   NOT NULL,
  `name`            VARCHAR(255)  NOT NULL,
  `category`        VARCHAR(100)  NOT NULL,
  `originalPrice`   DECIMAL(10,2) NOT NULL,
  `discountedPrice` DECIMAL(10,2) NOT NULL,
  `discountPercent` INT           NOT NULL DEFAULT 0,
  `reportsTime`     VARCHAR(50)   NULL,
  `fasting`         VARCHAR(50)   NULL,
  `sampleType`      VARCHAR(50)   NULL,
  `packageId`       VARCHAR(50)   NULL,
  `testId`          VARCHAR(50)   NULL,
  `isActive`        TINYINT(1)    NOT NULL DEFAULT 1,
  `sortOrder`       INT           NOT NULL DEFAULT 0,
  `createdAt`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IX_Offer_active` (`isActive`),
  KEY `IX_Offer_package` (`packageId`),
  KEY `IX_Offer_test` (`testId`),
  CONSTRAINT `FK_Offer_Package` FOREIGN KEY (`packageId`) REFERENCES `Package` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_Offer_Test`    FOREIGN KEY (`testId`)    REFERENCES `Test` (`id`)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Site content ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `Testimonial` (
  `id`        VARCHAR(50)  NOT NULL,
  `name`      VARCHAR(150) NOT NULL,
  `role`      VARCHAR(100) NULL,
  `content`   TEXT         NOT NULL,
  `rating`    INT          NOT NULL DEFAULT 5,
  `imageUrl`  VARCHAR(500) NULL,
  `featured`  TINYINT(1)   NOT NULL DEFAULT 1,
  `isActive`  TINYINT(1)   NOT NULL DEFAULT 1,
  `sortOrder` INT          NOT NULL DEFAULT 0,
  `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IX_Testimonial_active` (`isActive`, `featured`),
  CONSTRAINT `CK_Testimonial_rating` CHECK (`rating` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ReferralDoctor` (
  `id`             VARCHAR(50)  NOT NULL,
  `name`           VARCHAR(150) NOT NULL,
  `specialization` VARCHAR(150) NOT NULL,
  `hospital`       VARCHAR(255) NULL,
  `quote`          TEXT         NOT NULL,
  `imageUrl`       VARCHAR(500) NULL,
  `isActive`       TINYINT(1)   NOT NULL DEFAULT 1,
  `sortOrder`      INT          NOT NULL DEFAULT 0,
  `createdAt`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IX_ReferralDoctor_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `GalleryImage` (
  `id`        VARCHAR(50)  NOT NULL,
  `title`     VARCHAR(255) NULL,
  `caption`   VARCHAR(500) NULL,
  `imageUrl`  VARCHAR(500) NOT NULL,
  `altText`   VARCHAR(255) NULL,
  `isActive`  TINYINT(1)   NOT NULL DEFAULT 1,
  `sortOrder` INT          NOT NULL DEFAULT 0,
  `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IX_GalleryImage_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Submissions ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `Booking` (
  `id`            VARCHAR(50)  NOT NULL,
  `name`          VARCHAR(150) NOT NULL,
  `phone`         VARCHAR(30)  NOT NULL,
  `email`         VARCHAR(150) NULL,
  `address`       VARCHAR(500) NULL,
  `preferredDate` VARCHAR(50)  NULL,
  `preferredTime` VARCHAR(50)  NULL,
  `notes`         TEXT         NULL,
  `status`        VARCHAR(30)  NOT NULL DEFAULT 'pending',
  `testId`        VARCHAR(50)  NULL,
  `packageId`     VARCHAR(50)  NULL,
  `offerId`       VARCHAR(50)  NULL,
  `createdAt`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IX_Booking_created` (`createdAt`),
  KEY `IX_Booking_test` (`testId`),
  KEY `IX_Booking_package` (`packageId`),
  KEY `IX_Booking_offer` (`offerId`),
  CONSTRAINT `FK_Booking_Test`    FOREIGN KEY (`testId`)    REFERENCES `Test` (`id`)    ON DELETE SET NULL,
  CONSTRAINT `FK_Booking_Package` FOREIGN KEY (`packageId`) REFERENCES `Package` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_Booking_Offer`   FOREIGN KEY (`offerId`)   REFERENCES `Offer` (`id`)   ON DELETE SET NULL,
  CONSTRAINT `CK_Booking_name_len`  CHECK (CHAR_LENGTH(TRIM(`name`)) >= 2 AND CHAR_LENGTH(`name`) <= 150),
  CONSTRAINT `CK_Booking_phone_len` CHECK (CHAR_LENGTH(TRIM(`phone`)) >= 7 AND CHAR_LENGTH(`phone`) <= 30),
  CONSTRAINT `CK_Booking_status`    CHECK (`status` IN ('pending', 'confirmed', 'done', 'cancelled')),
  CONSTRAINT `CK_Booking_email_format` CHECK (
    `email` IS NULL OR `email` = '' OR (
      CHAR_LENGTH(`email`) <= 150
      AND LOCATE('@', `email`) > 1
      AND LOCATE('.', `email`) > LOCATE('@', `email`)
    )
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ContactMessage` (
  `id`        VARCHAR(50)  NOT NULL,
  `name`      VARCHAR(150) NOT NULL,
  `email`     VARCHAR(150) NOT NULL,
  `phone`     VARCHAR(30)  NULL,
  `subject`   VARCHAR(255) NULL,
  `message`   TEXT         NOT NULL,
  `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IX_Contact_created` (`createdAt`),
  CONSTRAINT `CK_Contact_name_len`  CHECK (CHAR_LENGTH(TRIM(`name`)) >= 2 AND CHAR_LENGTH(`name`) <= 150),
  CONSTRAINT `CK_Contact_phone_len` CHECK (`phone` IS NULL OR `phone` = '' OR (CHAR_LENGTH(`phone`) >= 7 AND CHAR_LENGTH(`phone`) <= 30)),
  CONSTRAINT `CK_Contact_email_format` CHECK (
    CHAR_LENGTH(`email`) BETWEEN 3 AND 150
    AND LOCATE('@', `email`) > 1
    AND LOCATE('.', `email`) > LOCATE('@', `email`)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
