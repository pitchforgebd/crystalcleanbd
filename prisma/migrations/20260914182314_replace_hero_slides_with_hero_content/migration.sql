-- Replace the multi-row `HeroSlide` "slider" model with a single-row
-- `HeroContent` singleton: the homepage hero is one static section (no
-- carousel), so a list of independently-editable slides never matched what
-- was actually rendered. This migrates existing data into the new shape
-- before dropping the old table, so no content or uploaded images are lost.

-- CreateTable
CREATE TABLE `HeroContent` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `heading` VARCHAR(255) NOT NULL,
    `subheading` VARCHAR(255) NOT NULL,
    `text` TEXT NOT NULL,
    `ctaLabel` VARCHAR(80) NOT NULL,
    `ctaHref` VARCHAR(255) NOT NULL,
    `image1` VARCHAR(1000) NOT NULL,
    `image1Alt` VARCHAR(255) NOT NULL,
    `image2` VARCHAR(1000) NOT NULL,
    `image2Alt` VARCHAR(255) NOT NULL,
    `image3` VARCHAR(1000) NOT NULL,
    `image3Alt` VARCHAR(255) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Migrate data: the lead slide (active, lowest order) becomes the single
-- heading/subheading/text/CTA; the first three slides by order (regardless
-- of active flag, since an inactive slide's image was still a real upload)
-- become the three fixed photo slots. Defaults cover a table with fewer
-- than 3 rows so exactly one HeroContent row always exists afterward.
INSERT INTO `HeroContent`
  (`id`, `heading`, `subheading`, `text`, `ctaLabel`, `ctaHref`,
   `image1`, `image1Alt`, `image2`, `image2Alt`, `image3`, `image3Alt`, `updatedAt`)
SELECT
  1,
  COALESCE(ld.heading, 'Professional cleaning services'),
  COALESCE(ld.subheading, 'Commercial & residential cleaning'),
  COALESCE(ld.text, ''),
  COALESCE(ld.ctaLabel, 'Learn more'),
  COALESCE(ld.ctaHref, '/services'),
  COALESCE(img1.image, ''), COALESCE(img1.imageAlt, ''),
  COALESCE(img2.image, ''), COALESCE(img2.imageAlt, ''),
  COALESCE(img3.image, ''), COALESCE(img3.imageAlt, ''),
  NOW(3)
FROM (SELECT 1 AS dummy) d
LEFT JOIN (SELECT heading, subheading, text, ctaLabel, ctaHref FROM `HeroSlide` WHERE active = 1 ORDER BY `order` ASC LIMIT 1) AS ld ON 1=1
LEFT JOIN (SELECT image, imageAlt FROM `HeroSlide` ORDER BY `order` ASC LIMIT 1 OFFSET 0) AS img1 ON 1=1
LEFT JOIN (SELECT image, imageAlt FROM `HeroSlide` ORDER BY `order` ASC LIMIT 1 OFFSET 1) AS img2 ON 1=1
LEFT JOIN (SELECT image, imageAlt FROM `HeroSlide` ORDER BY `order` ASC LIMIT 1 OFFSET 2) AS img3 ON 1=1;

-- DropTable
DROP TABLE `HeroSlide`;
