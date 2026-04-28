require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Book.deleteMany();
    await User.deleteMany();

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        description: 'A story of wealth, love, and the American Dream in the 1920s.',
        price: 15.99,
        stockCount: 50,
        imageURL: 'https://images.unsplash.com/photo-1543005128-d1433f7c32bf?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        genre: 'Tech',
        description: 'An easy & proven way to build good habits and break bad ones.',
        price: 24.50,
        stockCount: 100,
        imageURL: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'The Lean Startup',
        author: 'Eric Ries',
        genre: 'Tech',
        description: 'How constant innovation creates radically successful businesses.',
        price: 30.00,
        stockCount: 35,
        imageURL: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        genre: 'Tech',
        description: 'Explores the two systems that drive the way we think.',
        price: 18.20,
        stockCount: 12,
        imageURL: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800'
      }
    ];

    await Book.insertMany(books);

    console.log('Data Seeded Successfully!');
    console.log('Admin Email: admin@example.com');
    console.log('Admin Password: password123');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
