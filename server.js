const express = require('express');
const connectDB = require('./config/db');

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
