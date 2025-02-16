const express = require("express");
const mongoose = require("mongoose");
const Bet = require("../models/Bet");
const User = require("../models/User"); // Import User model
const router = express.Router();

// ✅ 1. Place a Bet (Create and link to user)
router.post("/place-bet", async (req, res) => {
    try {
        const { user_id, betNo, market_id, betTime, matkaBetType, matkaBetNumber, betAmount } = req.body;

        // Check if the user exists
        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Create a new bet
        const newBet = new Bet({
            user_id,
            market_id,
            betNo,
            betTime,
            matkaBetType,
            matkaBetNumber,
            betAmount,
            status: "Pending"
        });

        await newBet.save();

        // Optionally, update the User document to link the bet
        user.betDetails.push(newBet._id);
        await user.save();

        res.status(201).json({ message: "Bet placed successfully", bet: newBet });
    } catch (error) {
        res.status(500).json({ message: "Error placing bet", error: error.message });
    }
});

// ✅ 2. Get All Bets of a User
router.get("/user-bets/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const bets = await Bet.find({ user_id: userId });

        res.status(200).json(bets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bets", error: error.message });
    }
});
// ✅ 2. Get All Bets of a User
router.get("/user-bets", async (req, res) => {
    try {
       
        const bets = await Bet.find( req.body ).populate("user_id", "username") // Fetch the username from the users collection

        res.status(200).json(bets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bets", error: error.message });
    }
});

// ✅ 3. Update Bet Status (For Processing Results)
router.patch("/update-bet/:betId", async (req, res) => {
  try {
    const { betId } = req.params;
    const { status, matchResult, matkaBetType } = req.body;

    // Find and update the bet
    const updatedBet = await Bet.findByIdAndUpdate(
      betId,
      {
        $set: { status, matchResult, matkaBetType },
      },
      { new: true } // Return updated document
    );

    if (!updatedBet) {
      return res.status(404).json({ error: "Bet not found" });
    }

    res.json(updatedBet);
  } catch (error) {
    console.error("Error updating bet:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ 4. Delete a Bet (Optional)
router.delete("/delete-bet/:betId", async (req, res) => {
    try {
        const betId = req.params.betId;
        const deletedBet = await Bet.findByIdAndDelete(betId);

        if (!deletedBet) return res.status(404).json({ message: "Bet not found" });

        res.status(200).json({ message: "Bet deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting bet", error: error.message });
    }
});


module.exports = router;
