const express = require('express');
const SlabRate = require('../models/SlabRate');
const router = express.Router();

// Create a new slab rate
router.post('/', async (req, res) => {
  try {
    const { marketId, slabName, rates } = req.body;
    const slabRate = new SlabRate({ marketId, slabName, rates });
    await slabRate.save();
    res.status(201).json({ success: true, message: 'Slab rate created successfully', slabRate });
  } catch (error) {
    console.error('Error creating slab rate:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
