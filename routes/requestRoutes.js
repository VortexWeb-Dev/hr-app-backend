// routes/requestRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Create a new request
router.post('/', async (req, res) => {
    const {
        request_type,
        requester_bitrix_id,
        assigned_to_bitrix_id,
        address_to,
        purpose,
        country,
        noc_reason,
        leave_type,
        start_date,
        end_date
    } = req.body;

    if (!request_type || !requester_bitrix_id || !assigned_to_bitrix_id) {
        return res.status(400).json({ message: "Request type, requester, and assigned person required." });
    }

    try {
        const newRequest = await prisma.request.create({
            data: {
                request_type,
                requester_bitrix_id,
                assigned_to_bitrix_id,
                address_to,
                purpose,
                country,
                noc_reason,
                leave_type,
                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date) : null,
                status: "Manager Pending"
            }
        });
        res.status(201).json(newRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create request" });
    }
});

// Get all requests created by a user
router.get('/my', async (req, res) => {
    const requester_bitrix_id = parseInt(req.query.requester_bitrix_id);
    if (!requester_bitrix_id) return res.status(400).json({ message: "Requester Bitrix ID required" });

    try {
        const requests = await prisma.request.findMany({
            where: { requester_bitrix_id }
        });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch requests" });
    }
});

// Get all requests assigned to a user (e.g., manager)
router.get('/assigned', async (req, res) => {
    const assigned_to_bitrix_id = parseInt(req.query.assigned_to_bitrix_id);
    if (!assigned_to_bitrix_id) return res.status(400).json({ message: "Assigned Bitrix ID required" });

    try {
        const requests = await prisma.request.findMany({
            where: { assigned_to_bitrix_id }
        });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch assigned requests" });
    }
});

// Update request status
router.put('/:requestId', async (req, res) => {
    const requestId = parseInt(req.params.requestId);
    const { status } = req.body;

    try {
        const updated = await prisma.request.update({
            where: { id: requestId },
            data: { status }
        });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update request" });
    }
});

module.exports = router;
