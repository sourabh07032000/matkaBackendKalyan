// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/test-topic', async (req, res) => {
  const message = {
    notification: {
      title: 'Market is Open',
      body: 'Start playing now!',
    },
    topic: 'dailyMarketUpdate',
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent:', response);
    res.status(200).json({ message: 'Notification sent to topic.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to send notification.' });
  }
});

module.exports = router;
