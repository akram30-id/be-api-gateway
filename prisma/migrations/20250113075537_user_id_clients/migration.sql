/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clients` ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `clients_user_id_key` ON `clients`(`user_id`);

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
