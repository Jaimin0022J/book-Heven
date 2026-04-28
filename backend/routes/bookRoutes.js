const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook, createBookReview, updateBookReview, deleteBookReview } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', protect, admin, createBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);
router.post('/:id/reviews', protect, createBookReview);
router.put('/:id/reviews', protect, updateBookReview);
router.delete('/:id/reviews', protect, deleteBookReview);

module.exports = router;
