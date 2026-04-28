import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Key } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const BookCard = ({ book }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group">
      <Link to={`/book/${book._id}`} className="relative h-64 overflow-hidden">
        <img 
          src={book.imageURL || 'https://images.unsplash.com/photo-1543005128-d1433f7c32bf?auto=format&fit=crop&q=80&w=800'} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-primary-400 uppercase tracking-widest border border-white/5">
          {book.genre}
        </div>
        {book.listingType === 'Rental' && (
          <div className="absolute top-4 right-4 p-2 bg-primary-600 rounded-lg shadow-lg">
            <Key className="w-4 h-4 text-white" />
          </div>
        )}
      </Link>
      
      <div className="p-5 flex flex-col flex-grow bg-slate-900/40">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/book/${book._id}`}>
            <h3 className="text-lg font-bold text-white hover:text-primary-400 transition-colors line-clamp-1">{book.title}</h3>
          </Link>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3 h-3 fill-amber-500" />
            <span className="text-xs font-bold">{book.rating ? book.rating.toFixed(1) : '0.0'}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-400 mb-4 font-medium italic">by {book.author}</p>
        
        {book.seller && (
          <p className="text-[10px] font-bold text-gray-500 mb-4 flex items-center gap-1 uppercase tracking-tighter">
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span> Listing by {book.seller.name}
          </p>
        )}
        
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-white">₹{book.listingType === 'Rental' ? book.rentalPrice : book.price}</span>
            {book.listingType === 'Rental' && <span className="text-xs text-gray-500 ml-1">/day</span>}
          </div>
          {book.listingType !== 'Rental' && (
            <button 
              onClick={() => addToCart(book, 1)}
              className="p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
