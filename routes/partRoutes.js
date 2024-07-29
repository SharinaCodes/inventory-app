const express = require("express");
const router = express.Router();
const {
  getParts,
  createPart,
  getPartById,
  updatePart,
  deletePart,
} = require("../controllers/partController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { partValidationRules } = require("../middleware/validators/partValidators");

router
  .route("/")
  .get(protect, getParts)
  .post(protect, partValidationRules, validate, createPart);

router
  .route("/:id")
  .get(protect, getPartById)
  .put(protect, partValidationRules, validate, updatePart)
  .delete(protect, deletePart);

module.exports = router;
