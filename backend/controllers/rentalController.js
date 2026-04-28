const Rental = require('../models/Rental');
const Book = require('../models/Book');

// @desc    Rent a book
// @route   POST /api/rentals
// @access  Private
const createRental = async (req, res) => {
  try {
    const { bookId, days } = req.body;

    if (!global.dbConnected) {
      const rental = {
        _id: Date.now().toString(),
        user: req.user._id,
        book: bookId,
        rentalPrice: 50 * (days || 7),
        dueDate: new Date(Date.now() + (days || 7) * 24 * 60 * 60 * 1000)
      };
      global.mockRentals.push(rental);
      return res.status(201).json(rental);
    }

    const book = await Book.findById(bookId);

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.stockCount === 0) return res.status(400).json({ message: 'Book out of stock' });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (days || 7));

    const rental = new Rental({
      user: req.user._id,
      book: bookId,
      rentalPrice: book.rentalPrice * (days || 7),
      dueDate: dueDate
    });

    const createdRental = await rental.save();
    
    // Decriment stock
    book.stockCount -= 1;
    await book.save();

    res.status(201).json(createdRental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user rentals
// @route   GET /api/rentals/myrentals
// @access  Private
const getMyRentals = async (req, res) => {
  try {
    if (!global.dbConnected) {
      return res.json(global.mockRentals.filter(r => r.user === req.user._id));
    }
    const rentals = await Rental.find({ user: req.user._id }).populate('book');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRental, getMyRentals };
