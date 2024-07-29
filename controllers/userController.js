const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Function to log actions
const logAction = async (user, action, details) => {
  try {
    const log = new Log({
      user,
      action,
      details,
    });
    await log.save();
  } catch (error) {
    console.error(`Logging error: ${error.message}`);
  }
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public (Private for admin adding admin)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin = false } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // If isAdmin is true, verify the requester is an admin
  if (isAdmin) {
    if (!req.user || !req.user.isAdmin) {
      res.status(401);
      throw new Error("Not authorized to add an admin");
    }
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin,
  });

  if (user) {
    await logAction(
      user._id,
      isAdmin ? 'CREATE_ADMIN' : 'CREATE_USER',
      `Created user with ID: ${user._id}`
    );

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    await logAction(
      user._id,
      'LOGIN_USER',
      `User logged in with ID: ${user._id}`
    );
    
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };

  res.status(200).json(user);
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    req.logData = {
      user: req.user._id,
      action: 'DELETE_USER',
      details: `Deleted user with ID: ${user._id}`,
    };
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    const updatedUser = await user.save();
    req.logData = {
      user: req.user._id,
      action: 'UPDATE_USER',
      details: `Updated user with ID: ${updatedUser._id}`,
    };
    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  deleteUser,
  updateUser,
};
