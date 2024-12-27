const express = require('express');
const router = express.Router();
const Bet = require('../models/Bet');

// @route   POST /api/bets
// @desc    Place a new bet
// @access  Public
router.post('/', async (req, res) => {
  const { betAmount, matkaBetType, matkaBetNumber, user, market_id, betTime } = req.body;

  if (!betAmount || !matkaBetType || !matkaBetNumber || !user || !market_id || !betTime) {
    return res.status(400).json({ error: betAmount });
  }

  try {
    const newBet = new Bet({
      betAmount,
      matkaBetType,
      matkaBetNumber,
      user,
      market_id,
      betTime,
    });

    const savedBet = await newBet.save();
    res.status(201).json(savedBet);
  } catch (error) {
    console.error('Error saving bet:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// @route   GET /api/bets
// @desc    Get all bets
// @access  Public
router.get('/', async (req, res) => {
  try {
    const bets = await Bet.find().populate('user'); // Populate user details if referenced
    res.status(200).json(bets);
  } catch (error) {
    console.error('Error fetching bets:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// @route   GET /api/bets/:id
// @desc    Get a single bet by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id).populate('user');
    if (!bet) return res.status(404).json({ error: 'Bet not found.' });
    res.status(200).json(bet);
  } catch (error) {
    console.error('Error fetching bet:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// @route   DELETE /api/bets/:id
// @desc    Delete a bet by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const deletedBet = await Bet.findByIdAndDelete(req.params.id);
    if (!deletedBet) return res.status(404).json({ error: 'Bet not found.' });
    res.status(200).json({ message: 'Bet deleted successfully.', deletedBet });
  } catch (error) {
    console.error('Error deleting bet:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;
