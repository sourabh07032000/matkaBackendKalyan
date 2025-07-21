// firebase-config.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json'); // Your Firebase Admin SDK key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
