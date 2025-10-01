// routes/documentRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all documents
router.get('/', async (req, res) => {
    try {
        const documents = await prisma.companyDocument.findMany({
            orderBy: {
                created_at: 'desc'
            }
        });
        res.json(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: "Failed to fetch documents." });
    }
});

// Upload a new document
router.post('/upload', async (req, res) => {
    const { title, category, file_url, uploaded_by_bitrix_id } = req.body;

    if (!title || !category || !file_url || !uploaded_by_bitrix_id) {
        return res.status(400).json({ message: "Title, category, file URL, and uploaded_by_bitrix_id are required." });
    }

    try {
        const newDocument = await prisma.companyDocument.create({
            data: {
                title,
                category,
                file_url,
                uploaded_by_bitrix_id
            }
        });
        res.status(201).json(newDocument);
    } catch (error) {
        console.error("Error uploading document:", error);
        res.status(500).json({ message: "Failed to upload document." });
    }
});

module.exports = router;
