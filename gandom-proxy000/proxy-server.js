const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Proxy endpoint
app.get('/proxy/check-store', async (req, res) => {
    try {
        const storeCode = req.query.storeCode;
        if (!storeCode) {
            return res.status(400).json({ error: 'Store code is required' });
        }

        // Forward request to the original API
        const response = await axios.get(`http://10.131.3.85/check-store?storeCode=${storeCode}`);
        res.json(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Proxy server running at http://localhost:${port}`);
}); 