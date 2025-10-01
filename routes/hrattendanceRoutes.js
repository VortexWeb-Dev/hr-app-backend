// routes/hrAttendanceRoutes.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/today-logs',async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 

        const logs = await prisma.attendance_logs.findMany({
            where: {
                log_time: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            include: {
                user: { 
                    select: {
                        fullName: true,
                        role: true
                    }
                }
            },
            orderBy: {
                log_time: 'desc'
            }
        });
        res.json(logs);
    } catch (error) {
        console.error("Error fetching today's logs:", error);
        res.status(500).json({ message: "Failed to fetch today's logs." });
    }
});

router.get('/status/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID." });
    }

    try {
        const lastLog = await prisma.attendance_logs.findFirst({
            where: { user_id: userId },
            orderBy: { log_time: 'desc' },
            include: {
                user: {
                    select: {
                        fullName: true,
                        role: true
                    }
                }
            }
        });
        res.json(lastLog);
    } catch (error) {
        console.error("Error fetching employee status:", error);
        res.status(500).json({ message: "Failed to fetch status." });
    }
});


module.exports = router;