const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  registerValidationRules,
  loginValidationRules,
} = require("../middleware/validators/authValidators");

router.post("/", registerValidationRules, validate, registerUser);
router.post("/login", loginValidationRules, validate, loginUser);
router.get("/me", protect, getMe);
router.route("/").get(protect, admin, getUsers);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

module.exports = router;
