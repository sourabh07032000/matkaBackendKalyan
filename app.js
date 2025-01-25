require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jsonServer = require('json-server');
const { createProxyMiddleware } = require('http-proxy-middleware'); // For proxying JSON Server requests

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5002', 'https://sratebackend-1.onrender.com'], // Add your allowed origins here
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

// JSON Server Setup
const jsonRouter = jsonServer.router(path.join(__dirname, 'db.json')); // Path to db.json
const jsonMiddlewares = jsonServer.defaults();
app.use(jsonServer.bodyParser);
app.use(jsonMiddlewares);

// Proxy configuration for JSON Server
app.use(
  '/users', // Proxy route for JSON Server
  createProxyMiddleware({
    target: 'http://localhost:5002', // Replace with JSON Server's URL
    changeOrigin: true,
    pathRewrite: { '^/users': '' }, // Rewrite '/users' to '/'
  })
);

// Use JSON Server for `/users` routes
app.use('/users', jsonRouter);

// Routes for other services
const otpRoutes = require('./routes/otpRoutes');
const betRoutes = require('./routes/betRoutes');
const marketDataRoutes = require('./routes/marketData');
const resultRoutes = require('./routes/resultUpdate');
const paymentDetailsRoutes = require('./routes/paymentDetails');
const marketHistoryRoutes = require('./routes/marketHistory');
const notificationRoutes = require('./routes/notificationRoutes'); // Notification route
const slabRoutes = require('./routes/slabRoutes');

// Firebase Admin Setup
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'matka-app-b73f1',
});

// Add Firebase Admin to app locals for shared use across routes
app.locals.admin = admin;

// Use Express Routes
app.use('/newOtp', otpRoutes);
app.use('/bet', betRoutes);
app.use('/resultUpdate', resultRoutes);
app.use('/api', jsonRouter);
app.use('/api/', paymentDetailsRoutes);
app.use('/api/marketHistory', marketHistoryRoutes);
app.use('/notifications', notificationRoutes);
app.use('/api/slabs', slabRoutes);

// MongoDB Connection
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

// Global Error Handling Middleware
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
