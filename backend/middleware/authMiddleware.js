const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log('Auth Check - DB Connected:', global.dbConnected);
      console.log('Auth Check - Decoded ID:', decoded.id);

      if (!global.dbConnected) {
        req.user = global.mockUsers.find(u => u._id === String(decoded.id));
        if (!req.user) {
          // Auto-restore mock user so dev server restarts don't break logged-in sessions
          req.user = { _id: String(decoded.id), name: 'Restored User', email: 'restored@example.com', role: 'customer', password: 'password123' };
          global.mockUsers.push(req.user);
        }
        console.log('Auth Check - Mock User Found/Restored:', !!req.user);
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
