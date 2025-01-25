require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jsonServer = require('json-server');
const path = require('path');

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: ["http://localhost:10000", "https://sratebackend-1.onrender.com"], // Add allowed origins
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

// MongoDB-based Routes
const userRoutes = require('./routes/user'); // Comment out the MongoDB-based user routes
const otpRoutes = require('./routes/otpRoutes');
const betRoutes = require('./routes/betRoutes');
const marketDataRoutes = require('./routes/marketData');
const resultRoutes = require('./routes/resultUpdate');
const paymentDetailsRoutes = require('./routes/paymentDetails');
const marketHistoryRoutes = require('./routes/marketHistory');
const notificationRoutes = require('./routes/notificationRoutes');
const slabRoutes = require('./routes/slabRoutes');

// Notification Service (Firebase Admin Initialization)
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'matka-app-b73f1',
});

// Add Firebase Admin to app locals for shared use across routes
app.locals.admin = admin;

// Use MongoDB-based Routes
app.use('/user', userRoutes); // Comment out the MongoDB-based user routes
app.use('/newOtp', otpRoutes);
app.use('/bet', betRoutes);
app.use('/resultUpdate', resultRoutes);
app.use('/api/market-data', marketDataRoutes);
app.use('/api/', paymentDetailsRoutes);
app.use('/api/marketHistory', marketHistoryRoutes);
app.use('/notifications', notificationRoutes);
app.use('/api/slabs', slabRoutes);

// JSON Server for User API
const jsonRouter = jsonServer.router(path.join(__dirname, 'db.json')); // Path to db.json
const jsonMiddlewares = jsonServer.defaults();
app.use(jsonServer.bodyParser);
app.use(jsonMiddlewares);

// Use JSON Server for user-related routes
// app.use('/user', jsonRouter); // Replace the MongoDB user route with JSON Server

// Connect to MongoDB (Keep for other routes)
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
console.log('Credential Path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
