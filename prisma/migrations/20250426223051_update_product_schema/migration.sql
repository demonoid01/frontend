/*
  Warnings:

  - You are about to drop the column `assignedToId` on the `SupportTicket` table. All the data in the column will be lost.
  - Added the required column `submitterMobile` to the `SupportTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submitterName` to the `SupportTicket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `SupportTicket` DROP FOREIGN KEY `SupportTicket_assignedToId_fkey`;

-- DropForeignKey
ALTER TABLE `SupportTicket` DROP FOREIGN KEY `SupportTicket_userId_fkey`;

-- DropIndex
DROP INDEX `SupportTicket_assignedToId_fkey` ON `SupportTicket`;

-- DropIndex
DROP INDEX `SupportTicket_userId_fkey` ON `SupportTicket`;

-- AlterTable
ALTER TABLE `Installation` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'default-category',
    ADD COLUMN `city` VARCHAR(191) NOT NULL DEFAULT 'default-city',
    ADD COLUMN `pincode` VARCHAR(191) NOT NULL DEFAULT '000000',
    ADD COLUMN `productSlugs` JSON NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL DEFAULT 'default-state',
    ADD COLUMN `status` ENUM('REQUESTED', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'REQUESTED';

-- AlterTable
ALTER TABLE `SupportTicket` DROP COLUMN `assignedToId`,
    ADD COLUMN `dateOfPurchase` DATETIME(3) NULL,
    ADD COLUMN `orderId` VARCHAR(191) NULL,
    ADD COLUMN `submitterMobile` VARCHAR(191) NOT NULL,
    ADD COLUMN `submitterName` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` ENUM('GENERAL', 'WARRANTY', 'TECHNICAL') NOT NULL DEFAULT 'GENERAL',
    MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SupportTicket` ADD CONSTRAINT `SupportTicket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
