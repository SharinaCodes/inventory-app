const Log = require("../models/logModel");

const logAction = (action) => {
  return async (req, res, next) => {
    console.log(`Logging action: ${action}`);
    try {
      if (!req.user) {
        throw new Error("User information is missing");
      }

      const user = req.user._id;
      const details = `Action: ${action}, URL: ${req.originalUrl}, Method: ${
        req.method
      }, Body: ${JSON.stringify(req.body)}`;

      console.log(`User: ${user}, Action: ${action}, Details: ${details}`);

      const log = new Log({
        user,
        action,
        details,
      });

      await log.save();
      console.log('Log saved successfully');
      next();
    } catch (error) {
      console.error(`Logging error: ${error.message}`);
      next(error);
    }
  };
};

module.exports = { logAction };
