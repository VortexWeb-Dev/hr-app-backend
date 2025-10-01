/*
  Warnings:

  - You are about to drop the column `course_bitrix_id` on the `lesson` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `lesson` DROP FOREIGN KEY `Lesson_course_bitrix_id_fkey`;

-- DropIndex
DROP INDEX `Lesson_course_bitrix_id_fkey` ON `lesson`;

-- AlterTable
ALTER TABLE `lesson` DROP COLUMN `course_bitrix_id`,
    ADD COLUMN `courseId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
