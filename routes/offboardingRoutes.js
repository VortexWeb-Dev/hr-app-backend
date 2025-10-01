// routes/offboardingRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Add offboarding process for a user
router.post('/add-offboard', async (req, res) => {
    const { user_bitrix_id, last_working_day, status } = req.body;

    if (!user_bitrix_id || !last_working_day || !status) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newProcess = await prisma.offboardingProcess.create({
            data: {
                user_bitrix_id,
                last_working_day: new Date(last_working_day),
                status,
                progress: 0
            }
        });
        res.status(201).json(newProcess);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add offboarding process" });
    }
});

// Get offboarding process of a user
router.get('/:user_bitrix_id', async (req, res) => {
    const user_bitrix_id = parseInt(req.params.user_bitrix_id);

    try {
        const process = await prisma.offboardingProcess.findUnique({
            where: { user_bitrix_id }
        });

        if (!process) return res.status(404).json({ message: "Offboarding process not found" });

        res.json(process);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch offboarding process" });
    }
});

// // Update offboarding progress/status
// router.put('/:user_bitrix_id', async (req, res) => {
//     const user_bitrix_id = parseInt(req.params.user_bitrix_id);
//     const { status, progress, last_working_day } = req.body;

//     try {
//         const updatedProcess = await prisma.offboardingProcess.update({
//             where: { user_bitrix_id },
//             data: {
//                 status,
//                 progress,
//                 last_working_day: last_working_day ? new Date(last_working_day) : undefined
//             }
//         });
//         res.json(updatedProcess);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to update offboarding process" });
//     }
// });

module.exports = router;
