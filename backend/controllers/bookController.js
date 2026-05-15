const Book = require('../models/Book');

let mockBooks = [
  { _id: '1', title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fiction', price: 899, rentalPrice: 49, stockCount: 15, imageURL: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800', listingType: 'Both', seller: null, rating: 4.5, numReviews: 12, reviews: [] },
  { _id: '2', title: 'Atomic Habits', author: 'James Clear', genre: 'Tech', price: 449, rentalPrice: 29, stockCount: 20, imageURL: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800', listingType: 'Sale', seller: null, rating: 4.8, numReviews: 25, reviews: [] },
  { _id: '3', title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Sci-Fi', price: 699, rentalPrice: 59, stockCount: 12, imageURL: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800', listingType: 'Both', seller: null, rating: 4.9, numReviews: 18, reviews: [] },
  { _id: '4', title: 'Deep Work', author: 'Cal Newport', genre: 'Tech', price: 399, rentalPrice: 19, stockCount: 8, imageURL: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800', listingType: 'Sale', seller: null, rating: 4.7, numReviews: 15, reviews: [] },
  { _id: '5', title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', price: 299, rentalPrice: 15, stockCount: 30, imageURL: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800', listingType: 'Both', seller: null, rating: 4.6, numReviews: 30, reviews: [] },
  { _id: '6', title: 'Steve Jobs', author: 'Walter Isaacson', genre: 'Biography', price: 1299, rentalPrice: 99, stockCount: 5, imageURL: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800', listingType: 'Sale', seller: null, rating: 4.4, numReviews: 10, reviews: [] },
  { _id: '7', title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Science', price: 499, rentalPrice: 39, stockCount: 10, imageURL: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', listingType: 'Rental', seller: null, rating: 4.8, numReviews: 22, reviews: [] },
  { _id: '8', title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', price: 549, rentalPrice: 45, stockCount: 25, imageURL: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800', listingType: 'Both', seller: null, rating: 4.9, numReviews: 40, reviews: [] },
  { _id: '9', title: 'Principles', author: 'Ray Dalio', genre: 'Business', price: 1499, rentalPrice: 120, stockCount: 7, imageURL: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800', listingType: 'Sale', seller: null, rating: 4.7, numReviews: 14, reviews: [] },
  { _id: '10', title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', price: 449, rentalPrice: 35, stockCount: 18, imageURL: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800', listingType: 'Both', seller: null, rating: 4.8, numReviews: 35, reviews: [] },
  { _id: '11', title: 'Clean Code', author: 'Robert C. Martin', genre: 'Tech', price: 2999, rentalPrice: 199, stockCount: 14, imageURL: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', listingType: 'Sale', seller: null, rating: 4.9, numReviews: 28, reviews: [] },
  { _id: '12', title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', price: 349, rentalPrice: 25, stockCount: 22, imageURL: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&q=80&w=800', listingType: 'Both', seller: null, rating: 4.3, numReviews: 50, reviews: [] },
  { _id: '13', title: 'Educated', author: 'Tara Westover', genre: 'Biography', price: 499, rentalPrice: 35, stockCount: 11, imageURL: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=800', listingType: 'Sale', seller: null, rating: 4.7, numReviews: 19, reviews: [] },
  { _id: '14', title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Finance', price: 399, rentalPrice: 29, stockCount: 15, imageURL: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800', listingType: 'Both', seller: null, rating: 4.8, numReviews: 32, reviews: [] },
  { _id: '15', title: '1984', author: 'George Orwell', genre: 'Fiction', price: 249, rentalPrice: 15, stockCount: 40, imageURL: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800', listingType: 'Both', seller: null, rating: 4.9, numReviews: 100, reviews: [] },
  { _id: '16', title: 'Homo Deus', author: 'Yuval Noah Harari', genre: 'History', price: 549, rentalPrice: 45, stockCount: 9, imageURL: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800', listingType: 'Sale', seller: null, rating: 4.6, numReviews: 14, reviews: [] },
  { _id: '17', title: 'The 4-Hour Workweek', author: 'Tim Ferriss', genre: 'Business', price: 449, rentalPrice: 30, stockCount: 13, imageURL: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800', listingType: 'Both', seller: null, rating: 4.5, numReviews: 26, reviews: [] },
  { _id: '18', title: 'Man Search for Meaning', author: 'Viktor Frankl', genre: 'Biography', price: 299, rentalPrice: 19, stockCount: 16, imageURL: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800', listingType: 'Sale', seller: null, rating: 4.9, numReviews: 38, reviews: [] },
  { _id: '19', title: 'Neuromancer', author: 'William Gibson', genre: 'Sci-Fi', price: 349, rentalPrice: 25, stockCount: 20, imageURL: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', listingType: 'Both', seller: null, rating: 4.4, numReviews: 21, reviews: [] },
  { _id: '20', title: 'Elon Musk', author: 'Ashlee Vance', genre: 'Biography', price: 1199, rentalPrice: 89, stockCount: 4, imageURL: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', listingType: 'Sale', seller: null, rating: 4.6, numReviews: 13, reviews: [] }
];

const getBooks = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { author: { $regex: req.query.keyword, $options: 'i' } },
            { genre: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    if (!global.dbConnected) {
      if (!req.query.keyword) return res.json(mockBooks);
      const search = req.query.keyword.toLowerCase();
      const filteredBooks = mockBooks.filter(book => 
        book.title.toLowerCase().includes(search) || 
        book.author.toLowerCase().includes(search) || 
        book.genre.toLowerCase().includes(search)
      );
      return res.json(filteredBooks);
    }

    const books = await Book.find({ ...keyword }).populate('seller', 'name');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    if (!global.dbConnected) {
      const book = mockBooks.find(b => b._id === req.params.id);
      return book ? res.json(book) : res.status(404).json({ message: 'Book not found' });
    }
    const book = await Book.findById(req.params.id).populate('seller', 'name email');
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const newBook = { ...req.body, _id: Date.now().toString(), seller: req.user.role === 'admin' ? null : req.user, rating: 0, numReviews: 0, reviews: [] };
    if (!global.dbConnected) {
      mockBooks.push(newBook);
      return res.status(201).json(newBook);
    }
    const book = new Book({ ...req.body, seller: req.user.role === 'admin' ? null : req.user._id });
    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    if (!global.dbConnected) {
       mockBooks = mockBooks.map(b => b._id === req.params.id ? { ...b, ...req.body } : b);
       return res.json({ message: 'Updated (Mock)' });
    }
    const book = await Book.findById(req.params.id);
    if (book) {
      Object.assign(book, req.body);
      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    if (!global.dbConnected) {
      mockBooks = mockBooks.filter(b => b._id !== req.params.id);
      return res.json({ message: 'Removed (Mock)' });
    }
    const book = await Book.findById(req.params.id);
    if (book) {
      await book.deleteOne();
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBookReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    if (!global.dbConnected) {
      const book = mockBooks.find(b => b._id === req.params.id);
      if (book) {
        const alreadyReviewed = book.reviews.find(r => r.user === req.user._id);
        if (alreadyReviewed) return res.status(400).json({ message: 'Book already reviewed (Mock Mode)' });

        const review = {
          name: req.user.name,
          rating: Number(rating),
          comment,
          user: req.user._id,
          createdAt: new Date()
        };

        book.reviews.push(review);
        book.numReviews = book.reviews.length;
        book.rating = book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length;

        return res.status(201).json({ message: 'Review added (Mock Mode)' });
      } else {
        return res.status(404).json({ message: 'Book not found' });
      }
    }

    const book = await Book.findById(req.params.id);

    if (book) {
      const alreadyReviewed = book.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: 'Book already reviewed' });
        return;
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      book.reviews.push(review);
      book.numReviews = book.reviews.length;
      book.rating =
        book.reviews.reduce((acc, item) => item.rating + acc, 0) /
        book.reviews.length;

      await book.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    if (!global.dbConnected) {
      const book = mockBooks.find(b => b._id === req.params.id);
      if (book) {
        const review = book.reviews.find(r => r.user === req.user._id);
        if (!review) return res.status(404).json({ message: 'Review not found (Mock Mode)' });

        review.rating = Number(rating);
        review.comment = comment;
        review.updatedAt = new Date();

        book.rating = book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length;
        return res.json({ message: 'Review updated (Mock Mode)' });
      } else {
        return res.status(404).json({ message: 'Book not found' });
      }
    }

    const book = await Book.findById(req.params.id);
    if (book) {
      const review = book.reviews.find(r => r.user.toString() === req.user._id.toString());
      if (!review) return res.status(404).json({ message: 'Review not found' });

      review.rating = Number(rating);
      review.comment = comment;

      book.rating = book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length;
      await book.save();
      res.json({ message: 'Review updated' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBookReview = async (req, res) => {
  try {
    if (!global.dbConnected) {
      const book = mockBooks.find(b => b._id === req.params.id);
      if (book) {
        const reviewIndex = book.reviews.findIndex(r => String(r.user) === String(req.user._id));
        
        if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found (Mock Mode)' });

        book.reviews.splice(reviewIndex, 1);
        book.numReviews = book.reviews.length;
        book.rating = book.reviews.length > 0 
          ? book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length 
          : 0;

        return res.json({ message: 'Review deleted (Mock Mode)' });
      } else {
        return res.status(404).json({ message: 'Book not found' });
      }
    }

    const book = await Book.findById(req.params.id);
    if (book) {
      const reviewIndex = book.reviews.findIndex(r => r.user.toString() === req.user._id.toString());
      if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found' });

      book.reviews.splice(reviewIndex, 1);
      book.numReviews = book.reviews.length;
      book.rating = book.reviews.length > 0 
        ? book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length 
        : 0;

      await book.save();
      res.json({ message: 'Review deleted' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook, createBookReview, updateBookReview, deleteBookReview, getMockBooks: () => mockBooks };
