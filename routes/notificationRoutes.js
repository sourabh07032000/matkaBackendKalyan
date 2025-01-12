const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model
const admin = require('../firebaseAdmin'); // Import Firebase Admin

// Save FCM token for a user
router.post('/save-token', async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({ message: 'User ID and FCM token are required' });
    }

    // Save or update the token in the user's record
    const user = await User.findByIdAndUpdate(
      userId,
      { fcmToken },
      { new: true, upsert: true }
    );

    return res.status(200).json({ message: 'FCM token saved successfully', user });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Send notification to a specific user
router.post('/api/send-notification', async (req, res) => {
    const { title, body } = req.body;
  
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required.' });
    }
  
    try {
      // Fetch all FCM tokens from the database
      const tokens = await Token.find();
      const fcmTokens = tokens.map((token) => token.fcmToken);
  
      if (fcmTokens.length === 0) {
        return res.status(404).json({ message: 'No tokens found.' });
      }
  
      // Create the notification payload
      const message = {
        notification: {
          title,
          body,
        },
        tokens: fcmTokens,
      };
  
      // Send the notification to all users
      const response = await admin.messaging().sendMulticast(message);
      return res.status(200).json({ message: 'Notification sent successfully.', response });
    } catch (error) {
      console.error('Error sending notification:', error);
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  });
  

module.exports = router;
