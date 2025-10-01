-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_course_bitrix_id_fkey` FOREIGN KEY (`course_bitrix_id`) REFERENCES `Course`(`bitrixId`) ON DELETE RESTRICT ON UPDATE CASCADE;
