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
// Get slabs for a specific market
router.get('/:marketId', async (req, res) => {
  try {
    const { marketId } = req.params;
    const slabs = await SlabRate.find({ marketId });
    res.status(200).json({ success: true, slabs });
  } catch (error) {
    console.error('Error fetching slabs:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


module.exports = router;
