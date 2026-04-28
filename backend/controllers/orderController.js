const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      if (!global.dbConnected) {
        const order = {
          _id: Date.now().toString(),
          orderItems,
          user: { _id: req.user._id, name: req.user.name },
          totalPrice,
          createdAt: new Date(),
        };
        global.mockOrders.push(order);
        return res.status(201).json(order);
      }

      const order = new Order({
        orderItems,
        user: req.user._id,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    if (!global.dbConnected) {
      const orders = global.mockOrders.filter(o => o.user._id === req.user._id);
      return res.json(orders);
    }
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    if (!global.dbConnected) return res.json(global.mockOrders);
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrders };
