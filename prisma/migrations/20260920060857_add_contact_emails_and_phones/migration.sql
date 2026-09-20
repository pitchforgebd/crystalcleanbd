-- Adds repeatable email/phone lists for the footer and contact page (the
-- header/nav/CTA buttons keep using SiteSettings.email/phone as the single
-- compact number/address). Seeds each new table with the current
-- SiteSettings value as the first entry so nothing visually disappears
-- before an admin adds more.

-- CreateTable
CREATE TABLE `ContactEmail` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(80) NOT NULL,
    `email` VARCHAR(160) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContactEmail_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactPhone` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(80) NOT NULL,
    `phone` VARCHAR(64) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContactPhone_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed: current SiteSettings.email/phone become the first list entry.
INSERT INTO `ContactEmail` (`id`, `label`, `email`, `order`, `active`, `updatedAt`)
SELECT UUID(), 'Primary', s.email, 0, TRUE, NOW(3)
FROM `SiteSettings` s WHERE s.id = 1 AND s.email <> '';

INSERT INTO `ContactPhone` (`id`, `label`, `phone`, `order`, `active`, `updatedAt`)
SELECT UUID(), 'Primary', s.phone, 0, TRUE, NOW(3)
FROM `SiteSettings` s WHERE s.id = 1 AND s.phone <> '';
