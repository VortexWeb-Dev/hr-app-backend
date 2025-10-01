const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all pending approvals for a manager
router.get('/', async (req, res) => {
    const managerId = parseInt(req.query.managerId); // Manager Bitrix ID ko query param se bhejna
    if (!managerId) {
        return res.status(400).json({ message: "Manager Bitrix ID required" });
    }

    try {
        const pendingApprovals = await prisma.request.findMany({
            where: {
                assigned_to_bitrix_id: managerId,
                status: {
                    contains: 'Pending',
                },
            },
            include: {
                requester: {
                    select: {
                        name: true, // fullName nahi hai, schema me sirf "name" hai
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        res.json(pendingApprovals);
    } catch (error) {
        console.error("Error fetching approvals:", error);
        res.status(500).json({ message: "Failed to fetch approvals." });
    }
});

// Approve a request
router.put('/:id/approve', async (req, res) => {
    const requestId = parseInt(req.params.id);

    try {
        const approvedRequest = await prisma.request.update({
            where: { id: requestId },
            data: { status: 'Final Approved' },
        });
        res.json({ message: 'Request approved successfully', request: approvedRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to approve request." });
    }
});

// Reject a request
router.put('/:id/reject', async (req, res) => {
    const requestId = parseInt(req.params.id);

    try {
        const rejectedRequest = await prisma.request.update({
            where: { id: requestId },
            data: { status: 'Rejected' },
        });
        res.json({ message: 'Request rejected successfully', request: rejectedRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to reject request." });
    }
});

module.exports = router;
