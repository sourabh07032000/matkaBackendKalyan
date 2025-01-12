const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-service-account-key.json'); // Replace with your key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
