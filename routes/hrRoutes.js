// routes/hrRoutes.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET: Employees on leave today
router.get('/on-leave', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // ignore time

        const employeesOnLeave = await prisma.leaveRequest.findMany({
            where: {
                AND: [
                    { request_type: 'Leave Application' },
                    { status: 'Final Approved' },
                    { start_date: { lte: today } },
                    { end_date: { gte: today } },
                ]
            },
            include: {
                requester: true // ensure User relation exists in Prisma schema
            }
        });

        res.json(employeesOnLeave);
    } catch (error) {
        console.error("Error fetching employees on leave:", error);
        res.status(500).json({ message: "Failed to fetch data." });
    }
});

module.exports = router;
