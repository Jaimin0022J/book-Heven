const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!global.dbConnected) {
      if (global.mockUsers.find(u => u.email === email)) return res.status(400).json({ message: 'User already exists (Mock Mode)' });
      const newUser = { _id: Date.now().toString(), name, email, password, role: 'customer' };
      global.mockUsers.push(newUser);
      return res.status(201).json({ ...newUser, token: generateToken(newUser._id) });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!global.dbConnected) {
      const user = global.mockUsers.find(u => u.email === email);
      // In mock mode we use simple string comparison
      if (user && (password === user.password)) {
        return res.json({ ...user, token: generateToken(user._id) });
      }
      return res.status(401).json({ message: 'Invalid credentials (Mock Mode)' });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    if (!global.dbConnected) return res.json(global.mockUsers);
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, getUsers };
