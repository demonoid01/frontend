/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,variantId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `CartItem` DROP FOREIGN KEY `CartItem_userId_fkey`;

-- DropIndex
DROP INDEX `CartItem_userId_productId_key` ON `CartItem`;

-- AlterTable
ALTER TABLE `CartItem` ADD COLUMN `variantId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `CartItem_variantId_idx` ON `CartItem`(`variantId`);

-- CreateIndex
CREATE UNIQUE INDEX `CartItem_userId_productId_variantId_key` ON `CartItem`(`userId`, `productId`, `variantId`);

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
