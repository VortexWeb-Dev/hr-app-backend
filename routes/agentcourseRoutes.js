// routes/agentRoutes.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/academy/courses', async (req, res) => {
    try {
        const allCourses = await prisma.course.findMany({
            include: {
                _count: {
                    select: { lessons: true },
                },
            },
        });
        res.json(allCourses);
    } catch (error) {
        console.error("Error fetching courses for agent:", error);
        res.status(500).json({ message: "Failed to fetch courses." });
    }
});

router.get('/academy/courses/:id', async (req, res) => {
    const courseId = parseInt(req.params.id);

    if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID." });
    }

    try {
        const courseDetails = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                lessons: {
                    orderBy: {
                        sequence: 'asc', 
                    },
                },
            },
        });

        if (!courseDetails) {
            return res.status(404).json({ message: "Course not found." });
        }

        res.json(courseDetails);
    } catch (error) {
        console.error("Error fetching course details:", error);
        res.status(500).json({ message: "Failed to fetch course details." });
    }
});


module.exports = router;