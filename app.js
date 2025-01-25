require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jsonServer = require('json-server');

const app = express();

// const jsonRouter = jsonServer.router(path.join(__dirname, 'db.json')); // Path to db.json
// const jsonMiddlewares = jsonServer.defaults();
// app.use(jsonServer.bodyParser);
// app.use(jsonMiddlewares);

// // Use JSON Server for user-related routes
// app.use('/', jsonRouter); // Replace the MongoDB user route with JSON Server


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
const notificationRoutes = require('./routes/notificationRoutes'); // New notification route
const slabRoutes = require('./routes/slabRoutes'); 


// Notification Service (Firebase Admin Initialization)
const admin = require('firebase-admin'); // Replace with your Firebase service account key path

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'matka-app-b73f1', // Add your project ID here

});

// Add Firebase Admin to app locals for shared use across routes
app.locals.admin = admin;

// Use Routes
app.use('/user', userRoutes);
app.use('/newOtp', otpRoutes);
app.use('/bet', betRoutes);
app.use('/resultUpdate', resultRoutes);
app.use('/api/market-data', marketDataRoutes);
app.use('/api/', paymentDetailsRoutes);
app.use('/api/marketHistory', marketHistoryRoutes);
app.use('/notifications', notificationRoutes); // Add the notification route
app.use('/api/slabs', slabRoutes); // Add the slab route


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
console.log('Credential Path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});  
