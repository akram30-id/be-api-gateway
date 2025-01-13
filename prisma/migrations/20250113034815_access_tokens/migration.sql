/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/

-- CreateTable
CREATE TABLE `clients` (
    `client_id` VARCHAR(191) NOT NULL,
    `client_secret` VARCHAR(191) NOT NULL,
    `grant_type` VARCHAR(16) NOT NULL,
    `scope` VARCHAR(8) NOT NULL,

    UNIQUE INDEX `Clients_client_secret_key`(`client_secret`),
    PRIMARY KEY (`client_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `scope` VARCHAR(8) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `access_tokens` (
    `access_token` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `expired_in` DATETIME(3) NOT NULL,
    `scope` VARCHAR(8) NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `access_tokens_client_id_key`(`client_id`),
    PRIMARY KEY (`access_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `access_tokens` ADD CONSTRAINT `access_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `clients` RENAME INDEX `Clients_client_secret_key` TO `clients_client_secret_key`;
