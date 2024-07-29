const asyncHandler = require('express-async-handler');
const Log = require('../models/logModel');

// @desc    Get all logs
// @route   GET /api/logs
// @access  Private/Admin
const getLogs = asyncHandler(async (req, res) => {
  const logs = await Log.find().populate('user', 'name email');
  res.json(logs);
});

module.exports = { getLogs };
