const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

// POST: User route (Create)
router.post('/', async (req, res) => {
  const { username, mobileNumber, password, mPin } = req.body;

  // Validation
  if (!username || !mobileNumber || !password || !mPin) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({  username, mobileNumber, password, mPin });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } 
  
  catch (error) {
    console.error('User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Retrieve all users (Read)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Retrieve a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE: Remove a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update user information
router.put('/:id', async (req, res) => {
  const { username, mobileNumber, password, mPin } = req.body;
  try {
    // Find user by ID and update details
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, mobileNumber, password, mPin },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update user's transactionRequest array
router.put('/:id/transactionRequest', async (req, res) => {
  const { transactionRequest } = req.body;

  if (!Array.isArray(transactionRequest)) {
    return res.status(400).json({ message: 'transactionRequest must be an array' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the transactionRequest array (replace or merge, depending on requirements)
    user.transactionRequest = transactionRequest;
    await user.save();

    res.status(200).json({ message: 'Transaction requests updated successfully', user });
  } catch (error) {
    console.error('Error updating transaction requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
