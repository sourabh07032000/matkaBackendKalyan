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
    type: Number,
    required: true,
  },
  user: {
    type: String, 
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
