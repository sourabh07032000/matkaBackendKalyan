const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // FormData for the external API request
        let data = new FormData();
        data.append('username', '8889223659');
        data.append('API_token', 'NY3ni3VQS82tEmdp');
        data.append('markte_name', ''); // Corrected field spelling
        data.append('date', '2024-12-27');

        // Axios configuration
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://matkawebhook.matka-api.online/market-data',
            headers: { 
                'Cookie': 'ci_session=pv0avqseb6d2u7eaoug27o2100k1hpk6', 
                ...data.getHeaders()
            },
            data: data
        };

        // Make request to the external API
        const response = await axios.request(config);
        res.json(response.data); // Send the API response back to the frontend
    } catch (error) {
        console.error('Error fetching market data:', error.message);
        res.status(500).json({ error: 'Failed to fetch market data' });
    }
});

module.exports = router;
