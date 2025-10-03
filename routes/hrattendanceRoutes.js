// routes/hrattendanceRoutes.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// This is a placeholder for getting the logged-in user's ID.
// In a real app, this would come from an authentication token (JWT).
const getAuthenticatedUserId = (req) => {
    // TODO: Replace this with your actual authentication logic.
    // We are hardcoding it to a test user's bitrix_id for now.
    return 2; // Example: user with bitrix_id 2
};

// ==========================================================
// NEW ROUTES FOR INDIVIDUAL EMPLOYEE ACTIONS
// ==========================================================

// POST /api/hr/attendance/check-in
router.post('/check-in', async (req, res) => {
    const userBitrixId = getAuthenticatedUserId(req);
    try {
        const lastLog = await prisma.AttendanceLog.findFirst({
            where: { user_bitrix_id: userBitrixId },
            orderBy: { log_time: 'desc' },
        });

        if (lastLog && lastLog.log_type === 'check_in') {
            return res.status(409).json({ message: "You are already checked in." });
        }

        const newLog = await prisma.AttendanceLog.create({
            data: { user_bitrix_id: userBitrixId, log_type: 'check_in' }
        });
        res.status(201).json(newLog);

    } catch (error) {
        console.error("Check-in error:", error);
        res.status(500).json({ message: "Failed to check in." });
    }
});

// POST /api/hr/attendance/check-out
router.post('/check-out', async (req, res) => {
    const userBitrixId = getAuthenticatedUserId(req);
    try {
        const lastLog = await prisma.AttendanceLog.findFirst({
            where: { user_bitrix_id: userBitrixId },
            orderBy: { log_time: 'desc' },
        });

        if (!lastLog || lastLog.log_type === 'check_out') {
            return res.status(409).json({ message: "You must be checked in to check out." });
        }

        const newLog = await prisma.AttendanceLog.create({
            data: { user_bitrix_id: userBitrixId, log_type: 'check_out' }
        });
        res.status(201).json(newLog);

    } catch (error) {
        console.error("Check-out error:", error);
        res.status(500).json({ message: "Failed to check out." });
    }
});

// GET /api/hr/attendance/status
router.get('/status', async (req, res) => {
    const userBitrixId = getAuthenticatedUserId(req);
    try {
        const lastLog = await prisma.AttendanceLog.findFirst({
            where: { user_bitrix_id: userBitrixId },
            orderBy: { log_time: 'desc' },
        });

        if (!lastLog || lastLog.log_type === 'check_out') {
            return res.json({ status: "Checked-Out", timeStart: null });
        }

        res.json({ status: "Checked-In", timeStart: lastLog.log_time });

    } catch(error) {
        console.error("Get status error:", error);
        res.status(500).json({ message: "Failed to get status." });
    }
});


// ==========================================================
// EXISTING ROUTES FOR HR MANAGER
// ==========================================================

// GET /api/hr/attendance/today-logs
router.get('/today-logs', async (req, res) => {
    // This code is already correct. No changes needed here.
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 

        const logs = await prisma.AttendanceLog.findMany({
            where: { log_time: { gte: today, lt: tomorrow } },
            orderBy: { log_time: 'desc' }
        });

        const userBitrixIds = [...new Set(logs.map(log => log.user_bitrix_id))];
        const users = await prisma.user.findMany({
            where: { bitrix_id: { in: userBitrixIds } },
            select: { bitrix_id: true, name: true }
        });

        const userMap = users.reduce((acc, user) => {
            acc[user.bitrix_id] = user.name;
            return acc;
        }, {});

        const logsWithUserNames = logs.map(log => ({
            ...log,
            user: { fullName: userMap[log.user_bitrix_id] || 'Unknown User' }
        }));

        res.json(logsWithUserNames);
    } catch (error) {
        console.error("Error fetching today's logs:", error);
        res.status(500).json({ message: "Failed to fetch today's logs." });
    }
});

// GET /api/hr/attendance/status/:userId
router.get('/status/:userId', async (req, res) => {
    // This code is also correct.
    const userBitrixId = parseInt(req.params.userId);
    if (isNaN(userBitrixId)) {
        return res.status(400).json({ message: "Invalid user ID." });
    }
    try {
        const lastLog = await prisma.AttendanceLog.findFirst({
            where: { user_bitrix_id: userBitrixId },
            orderBy: { log_time: 'desc' },
        });
        if (!lastLog) {
            return res.status(404).json({ message: "No logs found for this user." });
        }
        res.json(lastLog);
    } catch (error) {
        console.error("Error fetching employee status:", error);
        res.status(500).json({ message: "Failed to fetch status." });
    }
});

module.exports = router;