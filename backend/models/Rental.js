const mongoose = require('mongoose');

const rentalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book',
    },
    rentalPrice: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    dueDate: { 
      type: Date, 
      required: true,
      default: () => new Date(+new Date() + 7*24*60*60*1000) // Default 7 days
    },
    status: {
      type: String,
      enum: ['Active', 'Returned', 'Overdue'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rental', rentalSchema);
