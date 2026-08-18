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

-- ── Site content: contact page ──────────────────────────────────
-- Single-row settings table. The row is pinned to id = 'default' so
-- the app never has to guess which row is live.

CREATE TABLE IF NOT EXISTS `SiteContact` (
  `id`            VARCHAR(50)  NOT NULL DEFAULT 'default',
  `location`      VARCHAR(255) NULL,
  `phone`         VARCHAR(30)  NULL,
  `whatsapp`      VARCHAR(30)  NULL,
  `email`         VARCHAR(150) NULL,
  `hours`         VARCHAR(150) NULL,
  `emergencyNote` VARCHAR(255) NULL,
  `mapEmbedUrl`   VARCHAR(1000) NULL,
  `facebookUrl`   VARCHAR(500) NULL,
  `instagramUrl`  VARCHAR(500) NULL,
  `whatsappUrl`   VARCHAR(500) NULL,
  `xUrl`          VARCHAR(500) NULL,
  `linkedinUrl`   VARCHAR(500) NULL,
  `updatedAt`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `CK_SiteContact_email_format` CHECK (
    `email` IS NULL OR `email` = '' OR (
      CHAR_LENGTH(`email`) <= 150
      AND LOCATE('@', `email`) > 1
      AND LOCATE('.', `email`) > LOCATE('@', `email`)
    )
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed the live row with the values the contact page used to hard-code.
INSERT IGNORE INTO `SiteContact`
  (`id`, `location`, `phone`, `whatsapp`, `email`, `hours`, `emergencyNote`,
   `mapEmbedUrl`, `facebookUrl`, `instagramUrl`, `whatsappUrl`, `xUrl`, `linkedinUrl`)
VALUES (
  'default',
  'Mid-Baneshwor, Opposite to Ratna Rajya School',
  '+977 986-1848382',
  '9779861848382',
  'info@cutispathlab.com',
  'Sat - Thu 10:00 - 18:00',
  '24/7 emergency laboratory services',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.8907380419406!2d85.32390742346914!3d27.71922847096282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a3778e0001%3A0x1234567890!2sMid-Baneshwor!5e0!3m2!1sen!2snp!4v1234567890',
  'https://facebook.com',
  'https://instagram.com',
  'https://wa.me/9779861848382',
  'https://twitter.com',
  NULL
);

CREATE TABLE IF NOT EXISTS `ContactFaq` (
  `id`        VARCHAR(50)  NOT NULL,
  `question`  VARCHAR(500) NOT NULL,
  `answer`    TEXT         NOT NULL,
  `sortOrder` INT          NOT NULL DEFAULT 0,
  `isActive`  TINYINT(1)   NOT NULL DEFAULT 1,
  `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IX_ContactFaq_sort` (`sortOrder`),
  CONSTRAINT `CK_ContactFaq_question_len` CHECK (CHAR_LENGTH(TRIM(`question`)) >= 3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed the FAQ list the contact page used to hard-code. Fixed ids keep this
-- re-runnable without duplicating rows.
INSERT IGNORE INTO `ContactFaq` (`id`, `question`, `answer`, `sortOrder`, `isActive`) VALUES
('faq-hours', 'What are your laboratory operating hours?',
 'Our main laboratory is open Monday through Friday from 7:00 AM to 10:00 PM, and Saturday through Sunday from 8:00 AM to 8:00 PM. Emergency services are available 24/7.', 0, 1),
('faq-booking', 'How do I book an appointment?',
 'You can book an appointment through our online booking system, by calling our hotline, or by visiting our facility directly. We also offer home sample collection services.', 1, 1),
('faq-results', 'How long does it take to get test results?',
 'Most routine test results are available within 24-48 hours. Specialized tests may take 3-7 days. We provide results via email, patient portal, or in-person pickup.', 2, 1),
('faq-insurance', 'Do you accept insurance?',
 'We accept most major insurance plans. Please contact our billing department to verify your coverage before your visit.', 3, 1);

-- ── Site content: about page ────────────────────────────────────

CREATE TABLE IF NOT EXISTS `SiteAbout` (
  `id`             VARCHAR(50)  NOT NULL DEFAULT 'default',
  `heroTagline`    VARCHAR(500) NULL,
  `introHeading`   VARCHAR(150) NULL,
  `introLead`      TEXT         NULL,
  `introBody`      TEXT         NULL,
  `missionHeading` VARCHAR(150) NULL,
  `missionBody`    TEXT         NULL,
  `missionImage`   VARCHAR(500) NULL,
  `visionHeading`  VARCHAR(150) NULL,
  `visionBody`     TEXT         NULL,
  `visionImage`    VARCHAR(500) NULL,
  `statsHeading`   VARCHAR(150) NULL,
  `certsHeading`   VARCHAR(150) NULL,
  `certsIntro`     TEXT         NULL,
  `updatedAt`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `AboutStat` (
  `id`        VARCHAR(50)  NOT NULL,
  `value`     VARCHAR(50)  NOT NULL,
  `label`     VARCHAR(150) NOT NULL,
  `sortOrder` INT          NOT NULL DEFAULT 0,
  `isActive`  TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `IX_AboutStat_sort` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- `iconKey` selects one of the hand-drawn badges kept in the page component;
-- the artwork is code, the copy is data.
CREATE TABLE IF NOT EXISTS `AboutAccreditation` (
  `id`        VARCHAR(50)  NOT NULL,
  `title`     VARCHAR(150) NOT NULL,
  `body`      VARCHAR(500) NULL,
  `iconKey`   VARCHAR(30)  NOT NULL DEFAULT 'nabl',
  `sortOrder` INT          NOT NULL DEFAULT 0,
  `isActive`  TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `IX_AboutAccreditation_sort` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `SiteAbout`
  (`id`, `heroTagline`, `introHeading`, `introLead`, `introBody`,
   `missionHeading`, `missionBody`, `missionImage`,
   `visionHeading`, `visionBody`, `visionImage`,
   `statsHeading`, `certsHeading`, `certsIntro`)
VALUES (
  'default',
  'A premier diagnostic centre delivering accurate, reliable and timely medical testing.',
  'Who we are',
  'Cutis Path Lab is a diagnostic centre dedicated to accurate, reliable and timely medical testing. Over 15 years in pathology and diagnostics we have run more than 500,000 tests for patients and referring clinicians across Kathmandu.',
  'Our laboratory is equipped with advanced analysers and staffed by pathologists, technicians and support specialists who review every result before it is released.',
  'Our Mission',
  'To provide accurate, reliable and timely diagnostic services that let clinicians and patients make informed decisions about health. We deliver that through advanced technology and care at every step of the process.',
  '/images/mission-vision.png',
  'Our Vision',
  'To be the leading diagnostic laboratory in the region, recognised for quality, innovation and patient-centred care — making advanced diagnostics reachable for everyone without compromising accuracy.',
  '/images/vision-image.png',
  'By the numbers',
  'Accreditations',
  'Our methods and reporting are audited against national and international laboratory standards.'
);

INSERT IGNORE INTO `AboutStat` (`id`, `value`, `label`, `sortOrder`, `isActive`) VALUES
('stat-years',    '15+',   'Years of excellence',   0, 1),
('stat-tests',    '500K+', 'Tests performed',       1, 1),
('stat-experts',  '50+',   'Expert professionals',  2, 1),
('stat-accuracy', '99.9%', 'Accuracy rate',         3, 1);

INSERT IGNORE INTO `AboutAccreditation` (`id`, `title`, `body`, `iconKey`, `sortOrder`, `isActive`) VALUES
('acc-nabl', 'NABL Accredited', 'National Accreditation Board for Testing and Calibration Laboratories', 'nabl', 0, 1),
('acc-iso',  'ISO 15189:2012',  'Medical laboratories — requirements for quality and competence',        'iso',  1, 1),
('acc-cap',  'CAP Certified',   'College of American Pathologists accreditation for excellence',         'cap',  2, 1);

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `BlogPost` (
  `id`           VARCHAR(50)  NOT NULL,
  `slug`         VARCHAR(200) NOT NULL,
  `title`        VARCHAR(300) NOT NULL,
  `excerpt`      TEXT         NULL,
  `content`      LONGTEXT     NULL,
  `category`     VARCHAR(50)  NOT NULL DEFAULT 'Blog',
  `author`       VARCHAR(150) NULL,
  `imageUrl`     VARCHAR(500) NULL,
  `readMinutes`  INT          NOT NULL DEFAULT 4,
  `publishedAt`  DATE         NULL,
  `isActive`     TINYINT(1)   NOT NULL DEFAULT 1,
  `sortOrder`    INT          NOT NULL DEFAULT 0,
  `createdAt`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  -- The public page will look posts up by slug, so it must be unique.
  UNIQUE KEY `UQ_BlogPost_slug` (`slug`),
  KEY `IX_BlogPost_active` (`isActive`, `publishedAt`),
  KEY `IX_BlogPost_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
