-- DropForeignKey
ALTER TABLE `galleryimage` DROP FOREIGN KEY `GalleryImage_uploadedBy_fkey`;

-- DropIndex
DROP INDEX `GalleryImage_uploadedBy_fkey` ON `galleryimage`;

-- AlterTable
ALTER TABLE `galleryimage` MODIFY `uploadedBy` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `GalleryImage` ADD CONSTRAINT `GalleryImage_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
