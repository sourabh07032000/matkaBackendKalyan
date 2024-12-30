
const express = require('express');
const router = express.Router();
const Market = require('../models/Market'); // Adjust the path as per your project structure

// POST: Create a new market entry
router.post('/', async (req, res) => {
  try {
    const market = new Market(req.body);
    const savedMarket = await market.save();
    res.status(201).json(savedMarket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: Fetch all market entries
router.get('/', async (req, res) => {
  try {
    const markets = await Market.find();
    res.status(200).json(markets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Fetch a market entry by ID
router.get('/:id', async (req, res) => {
  try {
    const market = await Market.findById(req.params.id);
    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }
    res.status(200).json(market);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Update a market entry by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedMarket = await Market.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMarket) {
      return res.status(404).json({ message: 'Market not found' });
    }
    res.status(200).json(updatedMarket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete a market entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedMarket = await Market.findByIdAndDelete(req.params.id);
    if (!deletedMarket) {
      return res.status(404).json({ message: 'Market not found' });
    }
    res.status(200).json({ message: 'Market deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;