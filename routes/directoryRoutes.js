// routes/directoryRoutes.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/',  async (req, res) => {
    try {
        const employees = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                role: true,
                date_of_joining: true,
                team: { select: { name: true } },
                sensitiveInfo: { select: { hr_notes: true } }
            },
            orderBy: { fullName: 'asc' }
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch directory." });
    }
});

router.get('/:userId/details',  async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const userDetails = await prisma.user.findUnique({
            where: { id: userId },
            include: { sensitiveInfo: true, department: true }
        });
        if (!userDetails) return res.status(404).json({ message: "User not found." });
        res.json(userDetails);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user details." });
    }
});

router.put('/:userId/details',async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { user_data, sensitive_data } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...user_data, 
                sensitiveInfo: {
                    upsert: { 
                        create: { ...sensitive_data },
                        update: { ...sensitive_data },
                    }
                }
            },
            include: { sensitiveInfo: true }
        });
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user details." });
    }
});

module.exports = router;
