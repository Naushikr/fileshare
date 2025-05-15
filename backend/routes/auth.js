const express = require('express');
const router = express.Router();
const User = require('../models/User');
const logger = require('../logger');  // Import your logger

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  logger.info('Signup attempt: %o', { email, name, role });

  try {
    // Basic duplicate email check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Signup failed: Email already registered - %s', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    logger.info('User registered successfully: %s', newUser._id);
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    logger.error('Server error during signup: %o', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  logger.info('Signin attempt for email: %s', email);

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      logger.warn('Signin failed: Invalid email or password for %s', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    logger.info('Signin successful for user: %s', user._id);

    res.status(200).json({
      message: 'Sign in successful',
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    logger.error('Server error during signin: %o', err);
    res.status(500).json({ message: 'Server error during signin' });
  }
});

module.exports = router;
