// routes/eventsRoutes.js

const express = require('express');
const axios = require('axios'); 

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bitrixApiEndpoint = `${process.env.BITRIX_WEBHOOK_URL}/user.get`;
        const response = await axios.post(bitrixApiEndpoint, {
            FILTER: { "ACTIVE": "Y" } 
        });

        const bitrixUsers = response.data.result;
        if (!bitrixUsers) {
            return res.json({ upcomingBirthdays: [], workAnniversaries: [] });
        }

        const upcomingBirthdays = [];
        const workAnniversaries = [];
        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);

        bitrixUsers.forEach(bUser => {
            const user = {
                id: bUser.ID,
                fullName: `${bUser.NAME} ${bUser.LAST_NAME}`,
                email: bUser.EMAIL,
                phone_number: bUser.PERSONAL_MOBILE,
                date_of_birth: bUser.PERSONAL_BIRTHDAY,
                date_of_joining: bUser.DATE_REGISTER,
            };

            // --- Birthday Check ---
            if (user.date_of_birth) {
                const birthDate = new Date(user.date_of_birth);
                birthDate.setFullYear(today.getFullYear());
                if (birthDate < today) {
                    birthDate.setFullYear(today.getFullYear() + 1);
                }
                if (birthDate <= next30Days) {
                    upcomingBirthdays.push(user);
                }
            }

            // --- Work Anniversary Check ---
            if (user.date_of_joining) {
                const joiningDate = new Date(user.date_of_joining);
                const anniversaryDate = new Date(user.date_of_joining);
                anniversaryDate.setFullYear(today.getFullYear());
                if (anniversaryDate < today) {
                    anniversaryDate.setFullYear(today.getFullYear() + 1);
                }
                if (anniversaryDate <= next30Days) {
                    const yearsOfService = today.getFullYear() - joiningDate.getFullYear();
                    if (yearsOfService > 0) {
                        workAnniversaries.push({ ...user, yearsOfService });
                    }
                }
            }
        });

        res.json({ upcomingBirthdays, workAnniversaries });

    } catch (error) {
        console.error("Error fetching events from Bitrix:", error.message);
        res.status(500).json({ message: "Failed to fetch events from Bitrix." });
    }
});

module.exports = router;