// routes/userRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all users
// This route will respond to GET requests at /api/users/
router.get('/', async (req, res) => {
  try {
    // IMPORTANT: Apne Prisma schema mein check karein ki User model ka naam 'user' hai ya kuch aur.
    const allUsers = await prisma.user.findMany({
      select: {
        bitrix_id: true,       // Ya user_bitrix_id, jo bhi aapka identifier hai
        name: true,     // Maan rahe hain ki 'name' field hai
        email: true    
      }
    });
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;