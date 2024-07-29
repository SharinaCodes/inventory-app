const asyncHandler = require("express-async-handler");
const Part = require("../models/partModel");

// @desc    Create a part
// @route   POST /api/parts
// @access  Private
const createPart = asyncHandler(async (req, res) => {
  const { name, price, stock, min, max, type, machineId, companyName } =
    req.body;

  const part = new Part({
    name,
    price,
    stock,
    min,
    max,
    type,
    machineId: type === "InHouse" ? machineId : null,
    companyName: type === "Outsourced" ? companyName : null,
  });

  const createdPart = await part.save();
  res.status(201).json(createdPart);
});

// @desc    Update a part
// @route   PUT /api/parts/:id
// @access  Private
const updatePart = asyncHandler(async (req, res) => {
  const { name, price, stock, min, max, type, machineId, companyName } =
    req.body;

  const part = await Part.findById(req.params.id);

  if (part) {
    part.name = name;
    part.price = price;
    part.stock = stock;
    part.min = min;
    part.max = max;
    part.type = type;
    part.machineId = type === "InHouse" ? machineId : null;
    part.companyName = type === "Outsourced" ? companyName : null;

    const updatedPart = await part.save();
    res.status(200).json(updatedPart);
  } else {
    res.status(404);
    throw new Error("Part not found");
  }
});

// @desc    Get all parts or search by name
// @route   GET /api/parts
// @access  Private
const getParts = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const query = {};

  if (name) query.name = { $regex: name, $options: 'i' };

  const parts = await Part.find(query);
  res.json(parts);
});

// @desc    Get part by ID
// @route   GET /api/parts/:id
// @access  Private
const getPartById = asyncHandler(async (req, res) => {
  const part = await Part.findById(req.params.id);

  if (part) {
    res.json(part);
  } else {
    res.status(404);
    throw new Error("Part not found");
  }
});

// @desc    Delete a part
// @route   DELETE /api/parts/:id
// @access  Private
const deletePart = asyncHandler(async (req, res) => {
  const part = await Part.findById(req.params.id);

  if (part) {
    await part.deleteOne();
    res.json({ message: "Part removed" });
  } else {
    res.status(404);
    throw new Error("Part not found");
  }
});

module.exports = {
  createPart,
  updatePart,
  getParts,
  getPartById,
  deletePart,
};
