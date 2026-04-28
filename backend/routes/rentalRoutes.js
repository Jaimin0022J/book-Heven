const express = require('express');
const router = express.Router();
const { createRental, getMyRentals } = require('../controllers/rentalController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRental);
router.get('/myrentals', protect, getMyRentals);

module.exports = router;
