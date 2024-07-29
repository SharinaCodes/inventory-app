const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, stock, min, max, associatedParts } = req.body;

  const product = new Product({
    name,
    price,
    stock,
    min,
    max,
    associatedParts,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, stock, min, max, associatedParts } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.stock = stock;
    product.min = min;
    product.max = max;
    product.associatedParts = associatedParts;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get all products or search by name
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const query = {};

  if (name) query.name = { $regex: name, $options: 'i' };

  const products = await Product.find(query);
  res.json(products);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product && product.associatedParts.length === 0) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else if (product.associatedParts.length > 0) {
    res.status(400);
    throw new Error("Cannot delete product with associated parts");
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
};
