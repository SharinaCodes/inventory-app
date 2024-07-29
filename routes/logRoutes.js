const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getLogs } = require('../controllers/logController');

// Route to get all logs (admin only)
router.route('/').get(protect, admin, getLogs);

module.exports = router;
