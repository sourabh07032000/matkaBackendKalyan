const cron = require('node-cron');
const admin = require('./routes/firebase-config'); // adjust path

cron.schedule('0 9 * * *', async () => {
  const message = {
    notification: {
      title: '📣 Market is Open!',
      body: 'Start playing now.',
    },
    topic: 'dailyMarketUpdate',
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Daily Notification sent:', response);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
});
