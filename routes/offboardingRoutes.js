// routes/offboardingRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// In routes/offboardingRoutes.js

router.post('/add-offboard', async (req, res) => {
    const { user_bitrix_id, last_working_day, status } = req.body;

    // ... your validation code ...

    try {
        const newProcess = await prisma.offboardingProcess.create({
            data: {
                user_bitrix_id,
                last_working_day: new Date(last_working_day), 
                status,
                progress: 10 // ✅ SET A DEFAULT PROGRESS VALUE HERE (e.g., 10%)
            }
        });
        res.status(201).json(newProcess);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add offboarding process" });
    }
});
// Add this new route to your offboardingRoutes.js file

// Get ALL offboarding processes
// GET ALL offboarding processes
router.get('/', async (req, res) => {
  try {
    const allProcesses = await prisma.offboardingProcess.findMany({
      // ✅ Add this 'select' block to choose which data to send
      select: {
        id: true,
        user_bitrix_id: true,
        last_working_day: true, // This will now be included
        status: true,
        progress: true         // This will also now be included
      },
      orderBy: {
        created_at: 'desc' 
      }
    });
    res.json(allProcesses);
  } catch (error) {
    console.error("Error fetching all offboarding processes:", error);
    res.status(500).json({ message: "Failed to fetch offboarding processes" });
  }
});

// This route will respond to GET requests at /api/users/
router.get('/', async (req, res) => {
  try {
    // Assuming your Prisma model for users is named 'user'. 
    // If it's different (e.g., 'users', 'User'), change it here.
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,       // Or user_bitrix_id, whichever is your primary identifier
        name: true,     // Assuming you have a 'name' field
        email: true    // Add any other fields you want to send to the frontend
      }
    });
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
