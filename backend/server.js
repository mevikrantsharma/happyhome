const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Import middleware
const { protect } = require('./middleware/authMiddleware');

// Admin routes
app.use('/api/admin', require('./routes/authRoutes'));

// Set up contact routes with middleware
const contactRouter = express.Router();

// Public routes - no auth required
contactRouter.post('/', require('./controllers/contactController').createContact);

// Protected routes - only accessible to admins
contactRouter.get('/', protect, require('./controllers/contactController').getContacts);
contactRouter.put('/:id', protect, require('./controllers/contactController').updateContactStatus);
contactRouter.delete('/:id', protect, require('./controllers/contactController').deleteContact);

// Mount the contact router
app.use('/api/contacts', contactRouter);

// Mount image routes
app.use('/api/images', require('./routes/imageRoutes'));

// Mount user routes
app.use('/api/users', require('./routes/userRoutes'));

// Mount OTP routes
app.use('/api/otp', require('./routes/otpRoutes'));

// Mount wishlist routes
app.use('/api/wishlists', require('./routes/wishlistRoutes'));

// Mount review routes
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Mount admin user routes
app.use('/api/admin/users', require('./routes/adminUserRoutes'));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
