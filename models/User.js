const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Define Bet Schema to Store Individual Bets
const BetSchema = new mongoose.Schema({
  bet_id: { type: String, unique: true, default: uuidv4 }, // ✅ Unique Bet ID
  betAmount: { type: Number, required: true },
  matkaBetNumber: { type: String, required: true },
  market_id: { type: String, required: true },
  betTime: { type: String, required: true },
  status: { type: String, default: "Pending" },
});

// Define Bank Details Schema
const BankDetailsSchema = new mongoose.Schema({
  accountNumber: String,
  ifscCode: String,
  accountHolderName: String,
  upiId: String,
  upiphoneNumber: String,
  isApproved: { type: Boolean, default: false }, // ✅ Use Boolean instead of String
});

// Define Main User Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      match: [/^[A-Za-z]+$/, "Username can only contain alphabetic characters"],
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mPin: {
      type: String,
      required: true,
    },
    transactionRequest: [
      {
        amount: Number,
        transactionType: { type: String, enum: ["Deposit", "Withdrawal"] },
        status: { type: String, enum: ["Pending", "Completed", "Rejected"], default: "Pending" },
        date: { type: Date, default: Date.now },
      },
    ],
    isDeposit: { type: Boolean, default: true },
    isWithdrawal: { type: Boolean, default: true },
    betDetails: [BetSchema], // ✅ Store bets properly
    bankDetails: BankDetailsSchema, // ✅ Separate bank details
    withdrawalRequest: [
      {
        amount: Number,
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
    wallet: { type: Number, default: 10 },
    assignedSlabDetails: [
      {
        slabType: String,
        benefits: mongoose.Schema.Types.Mixed, // ✅ Store slab object properly
      },
    ],
  },
  { timestamps: true }
);

// ✅ Add Index to Speed Up Queries
UserSchema.index({ mobileNumber: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ "betDetails.bet_id": 1 }, { unique: true });


module.exports = mongoose.model("User", UserSchema);
