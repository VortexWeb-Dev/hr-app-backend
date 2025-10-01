// routes/trainingPathRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (Bitrix IDs only)
router.get('/users', async (req, res) => {
    // Optional: if you keep a table of synced users or just pass IDs from frontend
    res.status(200).json({ message: "Send Bitrix IDs from frontend" });
});

// Get training path for a user
router.get('/:user_bitrix_id', async (req, res) => {
    const user_bitrix_id = parseInt(req.params.user_bitrix_id);
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { user_bitrix_id },
            include: {
                course: true,
                progress: true
            }
        });

        const trainingPath = enrollments.map(enroll => {
            const totalLessons = enroll.course.lessons?.length || 0;
            const completedLessons = enroll.progress?.length || 0;
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return {
                courseId: enroll.course_bitrix_id,
                courseTitle: enroll.course.title,
                category: enroll.course.category,
                progress
            };
        });

        res.json(trainingPath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch training path" });
    }
});

module.exports = router;
