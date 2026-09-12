const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getRequiredXP, getPlayerTitle } = require('../utils/progression');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'lifequest_dark_fantasy_jwt_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user / adventurer
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please enter all required fields: name, email, password');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long');
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400);
      throw new Error('An adventurer with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      level: 1,
      xp: 0,
      gold: 100,
      attributes: {
        strength: 10,
        intellect: 10,
        vitality: 10,
        discipline: 10,
        wisdom: 10
      },
      streak: {
        current: 0,
        longest: 0,
        lastCompletedDate: null
      }
    });

    if (user) {
      const token = generateToken(user._id);
      const userObj = user.toObject();
      delete userObj.password;
      userObj.requiredXP = getRequiredXP(user.level);
      userObj.title = getPlayerTitle(user.level);

      return res.status(201).json({
        success: true,
        data: {
          user: userObj,
          token
        }
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data received');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & return JWT token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      const userObj = user.toObject();
      delete userObj.password;
      userObj.requiredXP = getRequiredXP(user.level);
      userObj.title = getPlayerTitle(user.level);

      return res.json({
        success: true,
        data: {
          user: userObj,
          token
        }
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password credentials');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User profile not found');
    }

    const userObj = user.toObject();
    userObj.requiredXP = getRequiredXP(user.level);
    userObj.title = getPlayerTitle(user.level);

    return res.json({
      success: true,
      data: userObj
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
