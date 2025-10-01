// routes/onboardingRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Add onboarding process for a joiner
router.post('/add-joiner', async (req, res) => {
    const { user_bitrix_id, start_date, end_date } = req.body;
    if (!user_bitrix_id) return res.status(400).json({ message: "Bitrix ID required" });

    try {
        const newProcess = await prisma.onboardingProcess.create({
            data: {
                user_bitrix_id,
                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date) : null
            }
        });
        res.status(201).json(newProcess);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add onboarding process" });
    }
});

// Get onboarding process tasks
router.get('/:user_bitrix_id/tasks', async (req, res) => {
    const user_bitrix_id = parseInt(req.params.user_bitrix_id);
    try {
        const process = await prisma.onboardingProcess.findUnique({
            where: { user_bitrix_id }
        });
        if (!process) return res.status(404).json({ message: "Onboarding process not found" });

        const tasks = await prisma.processTask.findMany({
            where: { process_id: process.id, process_type: "onboarding" }
        });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
});

// Update a task
router.put('/tasks/:taskId', async (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const { is_completed } = req.body;
    try {
        const updated = await prisma.processTask.update({
            where: { id: taskId },
            data: { 
                is_completed,
                completed_at: is_completed ? new Date() : null
            }
        });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update task" });
    }
});

// Orientation Sessions
router.post('/orientation', async (req, res) => {
    const { title, session_date, assigned_hr_bitrix_id } = req.body;
    try {
        const session = await prisma.orientationSession.create({
            data: {
                title,
                session_date: new Date(session_date),
                assigned_hr_bitrix_id
            }
        });
        res.status(201).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create session" });
    }
});

router.get('/orientation', async (req, res) => {
    try {
        const sessions = await prisma.orientationSession.findMany({
            where: { session_date: { gte: new Date() } },
            orderBy: { session_date: 'asc' }
        });
        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch sessions" });
    }
});

module.exports = router;
