// routes/courseRoutes.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all courses with their lessons
router.get('/', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: { lessons: true },
        });
        res.json(courses);
    } catch (error) {
        console.log("issue error", error);
        res.status(500).json({ message: "Error fetching courses" });
    }
});

router.post('/', async (req, res) => {
    const { title, description, category, created_by_bitrix_id, lessons } = req.body;
    const createdById = 1;

    if (!title) return res.status(400).json({ message: "Title is required" });

    try {
        const newCourse = await prisma.course.create({
            data: {
                title,
                description,
                category,
                created_by_bitrix_id,
                lessons: {
                    create: lessons.map(lesson => ({
                        title: lesson.title,
                        video_url: lesson.video_url, 
                        content: lesson.content,   
                    })) || [],
                }
            },
            include: { lessons: true }
        });
        res.status(201).json(newCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating course" });
    }
});

// router.post('/:courseId/lessons', async (req, res) => {
//     const courseId = parseInt(req.params.courseId);
//     const { lessons } = req.body; 

//     if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
//         return res.status(400).json({ message: "Lessons array is required" });
//     }

//     try {
//         // Check if course exists
//         const course = await prisma.course.findUnique({ where: { id: courseId } });
//         if (!course) return res.status(404).json({ message: "Course not found" });

//         // Create multiple lessons
//         const createdLessons = await prisma.lesson.createMany({
//             data: lessons.map(lesson => ({
//                 title: lesson.title,
//                 video_url: lesson.video_url,
//                 description: lesson.description,
//                 created_by_bitrix_id,
//                 courseId: courseId,
//             })),
//         });

//         res.status(201).json({ message: `${lessons.length} lesson(s) added successfully` });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error creating lessons" });
//     }
// });



module.exports = router;