const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { productValidationRules } = require("../middleware/validators/productValidators");

router
  .route("/")
  .get(protect, getProducts)
  .post(protect, productValidationRules, validate, createProduct);

router
  .route("/:id")
  .get(protect, getProductById)
  .put(protect, productValidationRules, validate, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
