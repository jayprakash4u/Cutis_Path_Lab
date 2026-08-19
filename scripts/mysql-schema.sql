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

-- Services are the diagnostic disciplines listed on /services. They are
-- catalog copy rather than priced items, so no code/price columns here.
-- `iconKey` picks one of the hand-drawn icons in src/lib/serviceIcons.jsx;
-- `category` drives the filter chips on the services page.
CREATE TABLE IF NOT EXISTS `Service` (
  `id`              VARCHAR(50)  NOT NULL,
  `name`            VARCHAR(255) NOT NULL,
  `description`     TEXT         NULL,
  `longDescription` TEXT         NULL,
  `category`        VARCHAR(50)  NOT NULL DEFAULT 'health',
  `iconKey`         VARCHAR(50)  NULL,
  `imageUrl`        VARCHAR(500) NULL,
  `isActive`        TINYINT(1)   NOT NULL DEFAULT 1,
  `sortOrder`       INT          NOT NULL DEFAULT 0,
  `createdAt`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IX_Service_active` (`isActive`, `sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed the list the services page used to hard-code. Fixed ids keep the
-- existing /services/<id> links working and make this re-runnable.
INSERT IGNORE INTO `Service` (`id`, `name`, `description`, `category`, `iconKey`, `isActive`, `sortOrder`) VALUES
('1', 'Cytogenetics', 'We offer advanced cytogenetic testing to analyze chromosomes and detect genetic abnormalities that may lead to inherited disorders, cancers, and other conditions.', 'genetics', 'dna', 1, 0),
('2', 'Maternal Screening', 'Maternal screening tests are crucial for assessing the risk of chromosomal abnormalities and certain fetal conditions during pregnancy.', 'genetics', 'baby', 1, 1),
('3', 'Molecular Biology', 'Molecular biology has revolutionized diagnostic medicine, enabling precise detection of genetic and infectious diseases.', 'genetics', 'testTube', 1, 2),
('4', 'Molecular Genetics', 'Molecular genetics is a branch of biology that studies genes at a molecular level, focusing on how genetic variations influence health and disease.', 'genetics', 'dna', 1, 3),
('5', 'Newborn Screening', 'At Cutis Path Lab, we offer advanced newborn screening to ensure early detection of serious yet treatable genetic, metabolic, and endocrine disorders.', 'genetics', 'baby', 1, 4),
('6', 'Immunoflowcytometry', 'Immunoflow Cytometry is a powerful diagnostic technique used to analyze blood and bone marrow samples at the cellular level.', 'pathology', 'microscope', 1, 5),
('7', 'Immunohistochemistry', 'We offer advanced Immunohistochemistry (IHC) testing with over 80 markers to provide precise and accurate diagnosis of various cancers and diseases.', 'pathology', 'ribbon', 1, 6),
('8', 'Immunofluorescence', 'We offer advanced Immunofluorescence (IF) testing used for diagnosing vesiculobullous (blistering) diseases of skin, kidney diseases and autoimmune diseases respectively.', 'pathology', 'search', 1, 7),
('9', 'Routine Pathology', 'Our routine pathology services encompass a wide range of diagnostic specialties by integrating cutting-edge technology and fully automated systems.', 'pathology', 'clipboard', 1, 8),
('10', 'Microarray', 'We utilize advanced microarray-based multiplex testing for the rapid and comprehensive detection of respiratory, gastrointestinal, and central nervous system (CNS) infections.', 'genetics', 'petriDish', 1, 9),
('11', 'Therapeutic Drug Monitoring (TDM)', 'Therapeutic Drug Monitoring (TDM) is an advanced service designed to optimize drug therapy, prevent toxicity, and ensure medication efficacy.', 'health', 'pill', 1, 10),
('12', 'Histopathology', 'Our histopathology services include examination of tissue samples under microscope to diagnose diseases including cancer, inflammatory conditions, and infections.', 'pathology', 'microscope', 1, 11),
('13', 'Cytopathology', 'Cytopathology involves examining cells from various body sites to diagnose conditions including infections, inflammatory diseases, and cancers.', 'pathology', 'microscope', 1, 12),
('14', 'Clinical Microbiology', 'Our clinical microbiology services detect and identify pathogenic microorganisms causing infections and determine appropriate treatment options.', 'pathology', 'microbe', 1, 13),
('15', 'Serology & Immunology', 'Serology testing detects antibodies and antigens in blood to diagnose infections, autoimmune diseases, and immune deficiencies.', 'pathology', 'blood', 1, 14),
('16', 'Coagulation Studies', 'Coagulation testing evaluates blood clotting function to diagnose bleeding disorders, monitor anticoagulant therapy, and assess surgical risks.', 'pathology', 'heart', 1, 15),
('17', 'Flow Cytometry', 'Flow cytometry is used for immunophenotyping, leukemia/lymphoma diagnosis, and CD4/CD8 cell counting for HIV management.', 'pathology', 'chart', 1, 16),
('18', 'Clinical Chemistry', 'Clinical chemistry tests measure chemical substances in body fluids to evaluate organ function and detect metabolic disorders.', 'pathology', 'testTube', 1, 17),
('19', 'Electrolyte Analysis', 'Electrolyte testing measures sodium, potassium, chloride, and bicarbonate levels to assess kidney function, hydration status, and acid-base balance.', 'pathology', 'lightning', 1, 18),
('20', 'Drug Abuse Screening', 'Our drug screening services detect presence of illicit substances and prescription medications in urine, blood, or saliva samples.', 'health', 'testTube', 1, 19),
('21', 'Infertility Testing', 'We offer comprehensive infertility testing for both men and women including hormone analysis, semen analysis, and ovulatory function tests.', 'health', 'baby', 1, 20),
('22', 'Cancer Markers', 'Tumor marker testing helps in early detection, diagnosis, and monitoring of various cancers including breast, prostate, liver, and colon cancers.', 'pathology', 'ribbon', 1, 21),
('23', 'Allergy Testing', 'Allergy tests identify specific allergens causing allergic reactions including food, environmental, and drug allergies.', 'pathology', 'allergy', 1, 22),
('24', 'Bone Marrow Aspiration', 'Bone marrow testing is used to diagnose blood disorders, leukemias, lymphomas, and assess bone marrow function.', 'pathology', 'stethoscope', 1, 23);



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


-- ── Site chrome: header strip and footer ────────────────────────
-- Separate single-row tables, edited on their own admin screens, so the blue
-- strip above the menu and the footer can carry different numbers from each
-- other and from the contact page. Both are pinned to id = 'default'.

CREATE TABLE IF NOT EXISTS `SiteHeader` (
  `id`            VARCHAR(50)  NOT NULL DEFAULT 'default',
  `brandName`     VARCHAR(150) NULL,
  `region`        VARCHAR(150) NULL,
  `phone`         VARCHAR(30)  NULL,
  `email`         VARCHAR(150) NULL,
  `facebookUrl`   VARCHAR(500) NULL,
  `instagramUrl`  VARCHAR(500) NULL,
  `xUrl`          VARCHAR(500) NULL,
  `whatsappUrl`   VARCHAR(500) NULL,
  -- Hides the whole strip without clearing what is saved in it.
  `isActive`      TINYINT(1)   NOT NULL DEFAULT 1,
  `updatedAt`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `SiteHeader`
  (`id`, `brandName`, `region`, `phone`, `email`,
   `facebookUrl`, `instagramUrl`, `xUrl`, `whatsappUrl`, `isActive`)
VALUES (
  'default',
  'Cutis Path Lab',
  'Kathmandu, Bagmati, Nepal',
  '+977 986-1848382',
  'info@cutispathlab.com',
  'https://facebook.com',
  'https://instagram.com',
  'https://twitter.com',
  'https://wa.me/9779861848382',
  1
);

CREATE TABLE IF NOT EXISTS `SiteFooter` (
  `id`           VARCHAR(50)  NOT NULL DEFAULT 'default',
  `brandName`    VARCHAR(150) NULL,
  `tagline`      VARCHAR(500) NULL,
  `address`      VARCHAR(255) NULL,
  `phone`        VARCHAR(30)  NULL,
  `email`        VARCHAR(150) NULL,
  `hours`        VARCHAR(150) NULL,
  `note`         VARCHAR(150) NULL,
  `facebookUrl`  VARCHAR(500) NULL,
  `instagramUrl` VARCHAR(500) NULL,
  `whatsappUrl`  VARCHAR(500) NULL,
  `updatedAt`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `SiteFooter`
  (`id`, `brandName`, `tagline`, `address`, `phone`, `email`, `hours`, `note`,
   `facebookUrl`, `instagramUrl`, `whatsappUrl`)
VALUES (
  'default',
  'Cutis Path Lab',
  'Accurate diagnostics, clear reports, and reliable pathology services for patients and partner clinicians across Kathmandu.',
  'Mid-Baneshwor, Opposite to Ratna Rajya School, Kathmandu',
  '+977 986-1848382',
  'info@cutispathlab.com',
  'Sat – Thu · 10:00 – 18:00',
  'Pathology lab · Kathmandu, Nepal',
  'https://facebook.com',
  'https://instagram.com',
  'https://wa.me/9779861848382'
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

-- ── Home page ───────────────────────────────────────────────────
-- The landing page is assembled from these rows: one per section, in
-- `sortOrder`, skipping anything with `isActive = 0`. `sectionKey` maps to a
-- component in src/lib/homeSections.js — the copy is data, the layout is code.
-- Sections whose cards come from the catalog (offers, popular, referrals,
-- testimonials, ...) only use the heading fields.

CREATE TABLE IF NOT EXISTS `HomeSection` (
  `sectionKey` VARCHAR(50)  NOT NULL,
  `label`      VARCHAR(100) NOT NULL,
  `title`      VARCHAR(255) NULL,
  `highlight`  VARCHAR(100) NULL,
  `subtitle`   TEXT         NULL,
  `ctaLabel`   VARCHAR(100) NULL,
  `ctaHref`    VARCHAR(500) NULL,
  `isActive`   TINYINT(1)   NOT NULL DEFAULT 1,
  `sortOrder`  INT          NOT NULL DEFAULT 0,
  `updatedAt`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sectionKey`),
  KEY `IX_HomeSection_order` (`isActive`, `sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One generic card table for every section that lists cards. Not every column
-- applies to every section: `badge`/`note` are the small labels on the stats
-- and technology cards, `description` doubles as a bullet list (one per line)
-- for the technology cards, and `imageUrl`/`linkUrl` carry the category chips.
CREATE TABLE IF NOT EXISTS `HomeSectionItem` (
  `id`          VARCHAR(50)  NOT NULL,
  `sectionKey`  VARCHAR(50)  NOT NULL,
  `title`       VARCHAR(255) NULL,
  `description` TEXT         NULL,
  `badge`       VARCHAR(100) NULL,
  `note`        VARCHAR(100) NULL,
  `iconKey`     VARCHAR(50)  NULL,
  `imageUrl`    VARCHAR(500) NULL,
  -- Hero slides ship a phone-sized companion image; other sections leave it null.
  `mobileImageUrl` VARCHAR(500) NULL,
  `linkUrl`     VARCHAR(500) NULL,
  `isActive`    TINYINT(1)   NOT NULL DEFAULT 1,
  `sortOrder`   INT          NOT NULL DEFAULT 0,
  `createdAt`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IX_HomeSectionItem_section` (`sectionKey`, `isActive`, `sortOrder`),
  CONSTRAINT `FK_HomeSectionItem_Section` FOREIGN KEY (`sectionKey`)
    REFERENCES `HomeSection` (`sectionKey`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed the copy the landing components used to hard-code. Fixed ids keep this
-- re-runnable; the components still fall back to their own defaults if a
-- section has no rows, so an empty table cannot blank the page.
INSERT IGNORE INTO `HomeSection`
  (`sectionKey`, `label`, `title`, `highlight`, `subtitle`, `ctaLabel`, `ctaHref`, `isActive`, `sortOrder`)
VALUES
('hero', 'Hero banner', 'Your Trusted Partner in Health', 'Health', 'Accurate diagnostics delivered with speed & precision', 'Book Test Now', '/book', 1, 0),
('quickActions', 'Quick actions', NULL, NULL, NULL, NULL, NULL, 1, 1),
('offers', 'Tests in offers', 'Flat 25–33% off on lab tests', NULL, 'Free home sample collection on every booking.', NULL, NULL, 1, 2),
('stats', 'Why choose us', 'Why patients choose Cutis Path Lab', NULL, 'Accredited processes, experienced people, and results you can act on.', NULL, NULL, 1, 3),
('diseaseCategories', 'Disease categories', 'Find the right test for your condition', NULL, 'Browse our most requested diagnostic panels by health concern.', NULL, NULL, 1, 4),
('bookTest', 'Book a test', 'Book your test today', NULL, 'Get accurate pathology results from the comfort of your home. Our expert team will collect your sample and deliver results digitally.', NULL, NULL, 1, 5),
('popular', 'Popular tests & packages', 'Most booked tests and packages', NULL, 'Frequently chosen tests and health packages, with transparent pricing.', NULL, NULL, 1, 6),
('healthTips', 'Health tips', 'How to prepare for your health checkup', NULL, 'Follow these guidelines before your visit so your results are as accurate as possible.', NULL, NULL, 1, 7),
('labTechnology', 'Lab technology', 'Precision instruments, trusted science', NULL, 'Modern diagnostics powered by digital workflows and accredited laboratory practice.', NULL, NULL, 1, 8),
('about', 'About the lab', 'Advanced technology, trusted professionals', NULL, 'We combine modern diagnostic technology with a team of dedicated specialists to deliver accurate, reliable and timely results. Your health is our priority, and excellence is our commitment.', 'Learn More About Us', '/about', 1, 9),
('referrals', 'Referral network', 'Trusted by specialists across the city', NULL, 'Consultants who partner with Cutis Path Lab for accurate diagnostics and patient care.', NULL, NULL, 1, 10),
('testimonials', 'Patient testimonials', 'What our patients say', NULL, 'Patients, physicians, and partners who trust our laboratory every day.', NULL, NULL, 1, 11),
('team', 'Our team', 'Meet the team behind your reports', NULL, 'Pathologists, technologists and support staff who review every sample that comes through the lab.', NULL, NULL, 1, 12);

INSERT IGNORE INTO `HomeSectionItem`
  (`id`, `sectionKey`, `title`, `description`, `badge`, `note`, `iconKey`, `imageUrl`, `linkUrl`, `isActive`, `sortOrder`)
VALUES
('quickActions-1', 'quickActions', 'Download Your Reports', 'Your health records are available with us — click here to download.', NULL, NULL, 'reports', NULL, '/contact', 1, 0),
('quickActions-2', 'quickActions', 'Book Home Sample Collection', 'We''re at your doorstep within the time frame, with aseptic precautions.', NULL, NULL, 'collection', NULL, '#book-test', 1, 1),
('quickActions-3', 'quickActions', 'Request A Call Back', 'Our customer support team will get in touch with you soon.', NULL, NULL, 'callback', NULL, '/contact', 1, 2),
('quickActions-4', 'quickActions', 'Find Nearest Lab', 'We''re available at your nearest location — click here to find us.', NULL, NULL, 'lab', NULL, '/contact', 1, 3),
('stats-1', 'stats', 'Expert Team', 'Our team consists of highly skilled & experienced pathologists', '01', NULL, 'team', NULL, NULL, 1, 0),
('stats-2', 'stats', 'Accurate Reports', 'We provide accurate and reliable test reports', '02', NULL, 'report', NULL, NULL, 1, 1),
('stats-3', 'stats', '24/7 Support', 'We are available 24/7 for your support', '03', NULL, 'support', NULL, NULL, 1, 2),
('stats-4', 'stats', 'Quality Assurance', 'International quality standards with NABL accreditation', '04', NULL, 'quality', NULL, NULL, 1, 3),
('diseaseCategories-1', 'diseaseCategories', 'Anemia', NULL, NULL, NULL, NULL, '/images/disease-categories/anemia.jpg', '/tests?category=anemia', 1, 0),
('diseaseCategories-2', 'diseaseCategories', 'Diabetes', NULL, NULL, NULL, NULL, '/images/disease-categories/diabetes.jpg', '/tests?category=diabetes', 1, 1),
('diseaseCategories-3', 'diseaseCategories', 'Heart', NULL, NULL, NULL, NULL, '/images/disease-categories/heart.jpg', '/tests?category=heart', 1, 2),
('diseaseCategories-4', 'diseaseCategories', 'Thyroid', NULL, NULL, NULL, NULL, '/images/disease-categories/thyroid.jpg', '/tests?category=thyroid', 1, 3),
('diseaseCategories-5', 'diseaseCategories', 'Kidney', NULL, NULL, NULL, NULL, '/images/disease-categories/kidney.jpg', '/tests?category=kidney', 1, 4),
('diseaseCategories-6', 'diseaseCategories', 'Liver', NULL, NULL, NULL, NULL, '/images/disease-categories/liver.jpg', '/tests?category=liver', 1, 5),
('diseaseCategories-7', 'diseaseCategories', 'Bone', NULL, NULL, NULL, NULL, '/images/disease-categories/bone.jpg', '/tests?category=bone', 1, 6),
('diseaseCategories-8', 'diseaseCategories', 'Fever', NULL, NULL, NULL, NULL, '/images/disease-categories/fever.jpg', '/tests?category=fever', 1, 7),
('diseaseCategories-9', 'diseaseCategories', 'Cancer', NULL, NULL, NULL, NULL, '/images/disease-categories/cancer.jpg', '/tests?category=cancer', 1, 8),
('diseaseCategories-10', 'diseaseCategories', 'Gut Health', NULL, NULL, NULL, NULL, '/images/disease-categories/gut-health.jpg', '/tests?category=gut-health', 1, 9),
('healthTips-1', 'healthTips', 'FASTING', 'Fast for 8-12 hours before blood tests. Only water is allowed during fasting period.', NULL, NULL, 'fasting', NULL, NULL, 1, 0),
('healthTips-2', 'healthTips', 'HYDRATION', 'Drink plenty of water before your test to make blood draw easier.', NULL, NULL, 'hydration', NULL, NULL, 1, 1),
('healthTips-3', 'healthTips', 'NO ALCOHOL', 'Refrain from alcohol consumption 24 hours before your health checkup.', NULL, NULL, 'alcohol', NULL, NULL, 1, 2),
('labTechnology-1', 'labTechnology', 'AI Diagnostics', 'Pattern recognition
Priority flagging
Review assist
Fewer missed findings
Faster second opinions', 'Smarter review', 'Consistent reads', 'ai', NULL, NULL, 1, 0),
('labTechnology-2', 'labTechnology', 'Digital Pathology', 'Whole-slide scanning
Remote review
Case sharing
Secure digital archive
Easy retrieval', 'Slide imaging', 'HD clarity', 'digital', NULL, NULL, 1, 1),
('labTechnology-3', 'labTechnology', 'Molecular Testing', 'DNA/RNA panels
Infectious targets
Oncology markers
Clinician-ready results
Actionable insights', 'Genetic depth', 'Targeted assays', 'molecular', NULL, NULL, 1, 2),
('labTechnology-4', 'labTechnology', 'Lab Automation', 'Automated aliquoting
Barcode tracking
Queue management
Reduced handling time
Stable throughput', 'Faster flow', 'Less manual error', 'automation', NULL, NULL, 1, 3),
('labTechnology-5', 'labTechnology', 'PCR Technology', 'Real-time PCR
Pathogen ID
Viral load support
Infection workups
Outbreak response', 'Quick detection', 'High sensitivity', 'pcr', NULL, NULL, 1, 4),
('labTechnology-6', 'labTechnology', 'Smart Sample Tracking', 'Barcode scan points
Status updates
Location history
Transparent progress
Fewer lost samples', 'Full visibility', 'Collection to report', 'tracking', NULL, NULL, 1, 5),
('about-1', 'about', 'Advanced Technology', 'Modern equipment and digital workflows for precise, reliable results.', NULL, NULL, 'tech', NULL, NULL, 1, 0),
('about-2', 'about', 'Expert Professionals', 'Qualified pathologists and technicians with years of hands-on experience.', NULL, NULL, 'people', NULL, NULL, 1, 1),
('about-3', 'about', 'Quality Assurance', 'NABL accredited and ISO 15189:2012 compliant to maintain the highest testing standards.', NULL, NULL, 'quality', NULL, NULL, 1, 2),
('about-4', 'about', 'Timely & Reliable', 'Quick turnaround without compromising accuracy, because every result matters.', NULL, NULL, 'timely', NULL, NULL, 1, 3);

-- Databases created before hero slides moved into this table get the column
-- here. MySQL has no ADD COLUMN IF NOT EXISTS, so it is guarded by a lookup and
-- run through a prepared statement — re-running this file is a no-op.
SET @ddl := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HomeSectionItem'
      AND COLUMN_NAME = 'mobileImageUrl') = 0,
  'ALTER TABLE `HomeSectionItem` ADD COLUMN `mobileImageUrl` VARCHAR(500) NULL AFTER `imageUrl`',
  'DO 0');
PREPARE addMobileImage FROM @ddl;
EXECUTE addMobileImage;
DEALLOCATE PREPARE addMobileImage;

-- The hero carousel: the banner files already in public/images, now as rows an
-- admin can reorder, replace or add to. With no rows the component falls back
-- to scanning that folder, which is what it did before.
INSERT IGNORE INTO `HomeSectionItem`
  (`id`, `sectionKey`, `title`, `imageUrl`, `mobileImageUrl`, `isActive`, `sortOrder`)
VALUES
('hero-1', 'hero', 'Special care and dedicated doctors — your health, our priority',
 '/images/banners/herohomepagebanner/1.png', '/images/banners/mobile/homepageheromobile1.jpg', 1, 0),
('hero-2', 'hero', 'Cutis Path Lab banner 2',
 '/images/banners/herohomepagebanner/2.png', '/images/banners/mobile/homepageheromobile2.jpg', 1, 1),
('hero-3', 'hero', 'Cutis Path Lab banner 3',
 '/images/banners/herohomepagebanner/3.png', '/images/banners/mobile/homepageheromobile3.jpg', 1, 2),
('hero-4', 'hero', 'Precision in every test, care in every result — Cutis Path Lab',
 '/images/banners/herohomepagebanner/4.png', '/images/banners/mobile/homepageheromobile4.jpg', 1, 3),
('hero-5', 'hero', 'Cutis Path Lab banner 5',
 '/images/banners/herohomepagebanner/5.png', '/images/banners/mobile/homepageheromobile5.jpg', 1, 4);

-- Placeholder team, so the band is populated out of the box. Names, bios and
-- portraits are stand-ins — replace them with the real staff in
-- Admin → Home page → Our team.
INSERT IGNORE INTO `HomeSectionItem`
  (`id`, `sectionKey`, `title`, `description`, `badge`, `note`, `iconKey`, `imageUrl`, `linkUrl`, `isActive`, `sortOrder`)
VALUES
('team-1', 'team', 'Dr. Anjana Shrestha',
 'Leads histopathology and cytology reporting, and signs off the lab''s complex biopsy cases.',
 'Consultant Pathologist', 'MD Pathology', NULL,
 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=750&fit=crop', NULL, 1, 0),
('team-2', 'team', 'Dr. Bikash Adhikari',
 'Oversees culture, sensitivity and infectious-disease testing across the microbiology bench.',
 'Consultant Microbiologist', 'MD Microbiology', NULL,
 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&h=750&fit=crop', NULL, 1, 1),
('team-3', 'team', 'Dr. Sunita Maharjan',
 'Runs clinical chemistry and validates every hormone, metabolic and cardiac panel before release.',
 'Consultant Biochemist', 'MD Biochemistry', NULL,
 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=750&fit=crop', NULL, 1, 2),
('team-4', 'team', 'Rajan Karki',
 'Manages sample flow from collection to analysis, along with instrument calibration and maintenance.',
 'Chief Laboratory Technologist', 'BMLT', NULL,
 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=600&h=750&fit=crop', NULL, 1, 3),
('team-5', 'team', 'Sabina Tamang',
 'Maintains ISO 15189 documentation and runs the internal quality-control programme.',
 'Quality & Accreditation Officer', 'MSc Medical Microbiology', NULL,
 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=600&h=750&fit=crop', NULL, 1, 4);

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
