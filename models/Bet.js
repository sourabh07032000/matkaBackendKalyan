const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  betAmount: {
    type: String,
    required: true,
  },
  matkaBetType: {
    type: Object,
    required: true,
  },
  matkaBetNumber: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a User model
    ref: 'User',
    required: true,
  },
  betPlacedTiming: {
    type: Date,
    default: Date.now,
  },
  market_id: {
    type: String,
    required: true,
  },
  betTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Bet', betSchema);
