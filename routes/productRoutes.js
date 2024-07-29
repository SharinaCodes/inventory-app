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
const {
  productValidationRules,
} = require("../middleware/validators/productValidators");
const { logAction } = require("../middleware/logMiddleware");

router
  .route("/")
  .get(protect, getProducts)
  .post(
    protect,
    productValidationRules,
    validate,
    logAction("CREATE_PRODUCT"),
    createProduct
  );

router
  .route("/:id")
  .get(protect, getProductById)
  .put(
    protect,
    productValidationRules,
    validate,
    logAction("UPDATE_PRODUCT"),
    updateProduct
  )
  .delete(protect, logAction("DELETE_PRODUCT"), deleteProduct);

module.exports = router;
