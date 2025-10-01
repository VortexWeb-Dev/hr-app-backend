// routes/leaveRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    const {
        leave_type,
        start_date,
        end_date,
        reason,
        assigned_to_bitrix_id
    } = req.body;

    const requester_bitrix_id = req.body.requester_bitrix_id; // from frontend / Bitrix

    if (!leave_type || !start_date || !end_date || !assigned_to_bitrix_id || !requester_bitrix_id) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newLeaveRequest = await prisma.leaveRequest.create({
            data: {
                leave_type,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                reason,
                requester_bitrix_id,
                assigned_to_bitrix_id,
                status: 'Manager Pending'
            }
        });
        res.status(201).json(newLeaveRequest);
    } catch (error) {
        console.error("Error creating leave request:", error);
        res.status(500).json({ message: "Failed to create leave request." });
    }
});

router.get('/my', async (req, res) => {
    const requester_bitrix_id = req.query.requester_bitrix_id; // pass as query param

    if (!requester_bitrix_id) return res.status(400).json({ message: "Bitrix ID required" });

    try {
        const leaves = await prisma.leaveRequest.findMany({
            where: { requester_bitrix_id: parseInt(requester_bitrix_id) }
        });
        res.json(leaves);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch leave requests" });
    }
});

module.exports = router;
