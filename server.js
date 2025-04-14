const express = require('express');
const cors = require('cors');
const path = require('path');
const mapProxy = require('./src/proxy/mapProxy');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Map proxy routes
app.use('/api/map', mapProxy);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 