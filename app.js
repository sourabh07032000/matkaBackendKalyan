require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const cashfreeRoutes = require('./routes/cashfreeRoutes'); // Adjust path as necessary
// Adjust the path to your testRoutes file


const app = express();
// Middleware to handle CORS
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Routes
const userRoutes = require('./routes/user'); // Adjust the path as needed
const newOtpRoutes = require('./routes/otpRoutes');
const betRoutes = require('./routes/betRoutes');
const marketDataRoute = require('./routes/marketData');
const resultRoutes = require('./routes/resultUpdate')
const paymentDetailsRoutes = require('./routes/paymentDetails')




// const otpRoutes = require('./routes/otp');

// Use signup and OTP routes
app.use('/user', userRoutes);
app.use('/newOtp', newOtpRoutes)
app.use('/bet', betRoutes)
app.use('/resultUpdate', resultRoutes)
app.use('/api/market-data', marketDataRoute);
app.use('/api', paymentDetailsRoutes);



// app.use('/api', otpRoutes);
// app.use('/cashfree', cashfreeRoutes); // Cashfree routes ko `/cashfree` prefix ke saath mount kar rahe hain


// Connect to MongoDB using the correct URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Simple route to test if the server is running
app.get('/test', (req, res) => {
  res.status(200).send('Server is running');
});

// Define the port
const PORT = process.env.PORT || 5002;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});
