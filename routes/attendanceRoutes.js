// routes/attendanceRoutes.js

const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/checkin', async (req, res) => {
    const userId = req.user_bitrix_id; 
    try {
        const response = await axios.post(`${process.env.BITRIX_WEBHOOK_URL}/timeman.open`, { user_bitrix_id: userId });
        console.log("response",response);
        res.json({ message: 'Checked in successfully on Bitrix', details: response.data.result });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Failed to check-in on Bitrix." });
    }
});

router.post('/checkout', async (req, res) => {
    const userId = req.user_bitrix_id; 
    try {
        const response = await axios.post(`${process.env.BITRIX_WEBHOOK_URL}/timeman.close`, { user_bitrix_id: userId });
        res.json({ message: 'Checked out successfully on Bitrix', details: response.data.result });
    } catch (error) {
        res.status(500).json({ message: "Failed to check-out on Bitrix." });
    }
});

router.get('/status', async (req, res) => {
    const userId = req.user_bitrix_id; // Get user ID from token
    try {
        const response = await axios.post(`${process.env.BITRIX_WEBHOOK_URL}/timeman.status`, {user_bitrix_id: userId });
        const bitrixStatus = response.data.result;

        if (bitrixStatus) {
            res.json({
                status: bitrixStatus.STATUS, 
                timeStart: bitrixStatus.TIME_START,
                timeFinish: bitrixStatus.TIME_FINISH,
                duration: bitrixStatus.DURATION,
            });
        } else {
            res.status(404).json({ message: "No active workday found in Bitrix." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch status from Bitrix." });
    }
});

module.exports = router;