-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `brandName` VARCHAR(160) NOT NULL,
    `tagline` VARCHAR(255) NOT NULL,
    `email` VARCHAR(160) NOT NULL,
    `phone` VARCHAR(64) NOT NULL,
    `address` TEXT NOT NULL,
    `mainLogoLabel` VARCHAR(160) NOT NULL,
    `footerLogoLabel` VARCHAR(160) NOT NULL,
    `faviconLabel` VARCHAR(160) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeoSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `siteTitle` VARCHAR(255) NOT NULL,
    `defaultDescription` VARCHAR(500) NOT NULL,
    `ogImageLabel` VARCHAR(160) NOT NULL,
    `twitterHandle` VARCHAR(64) NOT NULL,
    `robotsIndex` BOOLEAN NOT NULL DEFAULT true,
    `canonicalBase` VARCHAR(255) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageSeo` (
    `id` VARCHAR(191) NOT NULL,
    `page` VARCHAR(80) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `ogImage` VARCHAR(255) NULL,
    `canonical` VARCHAR(255) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PageSeo_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomepageSection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(80) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HomepageSection_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HeroSlide` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(1000) NOT NULL,
    `imageAlt` VARCHAR(255) NOT NULL,
    `heading` VARCHAR(255) NOT NULL,
    `subheading` VARCHAR(255) NOT NULL,
    `text` TEXT NOT NULL,
    `ctaLabel` VARCHAR(80) NOT NULL,
    `ctaHref` VARCHAR(255) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `HeroSlide_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `category` VARCHAR(80) NOT NULL,
    `icon` ENUM('spark', 'building', 'home', 'window', 'carpet', 'sanitize') NOT NULL DEFAULT 'spark',
    `featuredImage` VARCHAR(1000) NOT NULL,
    `imageAlt` VARCHAR(255) NOT NULL,
    `shortDescription` VARCHAR(500) NOT NULL,
    `fullDescription` TEXT NOT NULL,
    `workScope` JSON NOT NULL,
    `outcomes` JSON NOT NULL,
    `features` JSON NOT NULL,
    `packageTags` JSON NOT NULL,
    `availability` TEXT NOT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `reviewCount` INTEGER NOT NULL DEFAULT 0,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `popular` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Service_slug_key`(`slug`),
    INDEX `Service_active_order_idx`(`active`, `order`),
    INDEX `Service_featured_idx`(`featured`),
    INDEX `Service_popular_idx`(`popular`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceReview` (
    `id` VARCHAR(191) NOT NULL,
    `serviceSlug` VARCHAR(160) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `approved` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ServiceReview_serviceSlug_idx`(`serviceSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Statistic` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(160) NOT NULL,
    `value` INTEGER NOT NULL,
    `suffix` VARCHAR(16) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Statistic_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testimonial` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `role` VARCHAR(160) NOT NULL,
    `quote` TEXT NOT NULL,
    `avatarSrc` VARCHAR(1000) NOT NULL,
    `avatarAlt` VARCHAR(255) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Testimonial_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `logoSrc` VARCHAR(1000) NOT NULL,
    `logoAlt` VARCHAR(255) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Client_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryImage` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `alt` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `src` VARCHAR(1000) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `GalleryImage_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryVideo` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `description` TEXT NOT NULL,
    `youtubeId` VARCHAR(64) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `GalleryVideo_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogCategory_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogPost` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `excerpt` VARCHAR(500) NOT NULL,
    `content` TEXT NOT NULL,
    `featuredImage` VARCHAR(1000) NOT NULL,
    `imageAlt` VARCHAR(255) NOT NULL,
    `author` VARCHAR(160) NOT NULL,
    `publishedAt` DATETIME(3) NOT NULL,
    `categorySlug` VARCHAR(160) NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `tags` JSON NOT NULL,
    `seoTitle` VARCHAR(255) NULL,
    `metaDescription` VARCHAR(500) NULL,
    `ogImage` VARCHAR(1000) NULL,
    `canonical` VARCHAR(255) NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    INDEX `BlogPost_categorySlug_idx`(`categorySlug`),
    INDEX `BlogPost_featured_idx`(`featured`),
    INDEX `BlogPost_published_publishedAt_idx`(`published`, `publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FaqItem` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(500) NOT NULL,
    `answer` TEXT NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FaqItem_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialLink` (
    `id` VARCHAR(191) NOT NULL,
    `platform` ENUM('facebook', 'instagram', 'youtube', 'linkedin', 'tiktok', 'whatsapp') NOT NULL,
    `label` VARCHAR(80) NOT NULL,
    `href` VARCHAR(1000) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SocialLink_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AboutContent` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `introduction` TEXT NOT NULL,
    `mission` TEXT NOT NULL,
    `vision` TEXT NOT NULL,
    `proprietorMessage` TEXT NOT NULL,
    `teamImage` VARCHAR(1000) NOT NULL,
    `teamImageAlt` VARCHAR(255) NOT NULL,
    `workspaceImage` VARCHAR(1000) NOT NULL,
    `workspaceImageAlt` VARCHAR(255) NOT NULL,
    `contactImage` VARCHAR(1000) NOT NULL,
    `contactImageAlt` VARCHAR(255) NOT NULL,
    `values` JSON NOT NULL,
    `whyChooseUs` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConcernContent` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(160) NOT NULL,
    `tagline` VARCHAR(255) NOT NULL,
    `introduction` TEXT NOT NULL,
    `brandingNote` TEXT NOT NULL,
    `image` VARCHAR(1000) NOT NULL,
    `imageAlt` VARCHAR(255) NOT NULL,
    `ctaLabel` VARCHAR(80) NOT NULL,
    `ctaHref` VARCHAR(255) NOT NULL,
    `features` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LegalPage` (
    `kind` ENUM('terms', 'privacy') NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `updated` DATETIME(3) NOT NULL,
    `sections` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`kind`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactMessage` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `email` VARCHAR(160) NOT NULL,
    `phone` VARCHAR(64) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('new', 'read', 'archived') NOT NULL DEFAULT 'new',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ContactMessage_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminUser` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `email` VARCHAR(160) NOT NULL,
    `role` ENUM('owner', 'editor') NOT NULL DEFAULT 'editor',
    `passwordHash` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
