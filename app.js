require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware to handle CORS
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Routes
const userRoutes = require('./routes/user'); // Adjust the path as needed
const otpRoutes = require('./routes/otpRoutes');
const betRoutes = require('./routes/betRoutes');
const marketDataRoutes = require('./routes/marketData');
const resultRoutes = require('./routes/resultUpdate');
const paymentDetailsRoutes = require('./routes/paymentDetails');
const marketHistoryRoutes = require('./routes/marketHistory');

// Notification Service (Firebase Admin Initialization)
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Replace with your Firebase service account key path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Add Firebase Admin to app locals for shared use across routes
app.locals.admin = admin;

// Use Routes
app.use('/user', userRoutes);
app.use('/newOtp', otpRoutes);
app.use('/bet', betRoutes);
app.use('/resultUpdate', resultRoutes);
app.use('/api/market-data', marketDataRoutes);
app.use('/api/paymentDetails', paymentDetailsRoutes);
app.use('/api/marketHistory', marketHistoryRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Test Route
app.get('/test', (req, res) => {
  res.status(200).send('Server is running');
});

// Handle Errors Globally
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error', error: err.message });
});

// Define the port
const PORT = process.env.PORT || 5002;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
