-- CreateTable
CREATE TABLE `User` (
    `bitrix_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,

    PRIMARY KEY (`bitrix_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LeaveRequest` ADD CONSTRAINT `LeaveRequest_requester_bitrix_id_fkey` FOREIGN KEY (`requester_bitrix_id`) REFERENCES `User`(`bitrix_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
