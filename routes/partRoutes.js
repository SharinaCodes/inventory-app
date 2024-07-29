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
const {
  partValidationRules,
} = require("../middleware/validators/partValidators");
const { logAction } = require("../middleware/logMiddleware");

router
  .route("/")
  .get(protect, getParts)
  .post(
    protect,
    partValidationRules,
    validate,
    logAction("CREATE_PART"),
    createPart
  );

router
  .route("/:id")
  .get(protect, getPartById)
  .put(
    protect,
    partValidationRules,
    validate,
    logAction("UPDATE_PART"),
    updatePart
  )
  .delete(protect, logAction("DELETE_PART"), deletePart);

module.exports = router;
