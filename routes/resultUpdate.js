const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');


// PUT: Update user information
router.put('/:id', async (req, res) => {
  const { username, mobileNumber, password, mPin, wallet, transactionRequest, betDetails, withdrawalRequest } = req.body;
  try {
    // Find user by ID and update details
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, mobileNumber, password, mPin, wallet, transactionRequest, betDetails, withdrawalRequest },
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
