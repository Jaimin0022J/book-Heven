require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Initialize Mock Data and Connection State
global.dbConnected = false;
global.mockUsers = [
  { _id: '1', name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
  { _id: '2', name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'customer' }
];
global.mockOrders = [
  { _id: '1', user: { _id: '2', name: 'John Doe' }, orderItems: [{ title: 'Atomic Habits', price: 449 }], totalPrice: 449, createdAt: new Date() },
  { _id: '2', user: { _id: '2', name: 'John Doe' }, orderItems: [{ title: 'Deep Work', price: 399 }], totalPrice: 399, createdAt: new Date() }
];
global.mockRentals = [];

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Port Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
