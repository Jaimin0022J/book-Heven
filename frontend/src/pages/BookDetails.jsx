import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, ShoppingCart, Star, CheckCircle2, Truck, ShieldCheck, Key, User, Pencil, Trash2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rentDays, setRentDays] = useState(7);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchBook = async () => {
    try {
      const { data } = await api.get(`/api/books/${id}`);
      setBook(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book details', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book, qty);
    navigate('/cart');
  };

  const handleRent = async () => {
    if (!user) {
      navigate(`/login?redirect=book/${id}`);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post('/api/rentals', { bookId: id, days: rentDays }, config);
      alert('Book rented successfully!');
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Rental failed');
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (isEditing) {
        await api.put(`/api/books/${id}/reviews`, { rating, comment }, config);
        alert('Review updated successfully!');
      } else {
        await api.post(`/api/books/${id}/reviews`, { rating, comment }, config);
        alert('Review submitted successfully!');
      }
      setComment('');
      setRating(0);
      setIsEditing(false);
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review');
    }
    setSubmitting(false);
  };

  const deleteReviewHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.delete(`/api/books/${id}/reviews`, config);
      alert('Review deleted successfully!');
      setIsEditing(false);
      setRating(0);
      setComment('');
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting review');
    }
  };

  const handleEditClick = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setIsEditing(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!book) return <div className="text-center py-20"><p className="text-2xl font-bold text-white">Book not found</p></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Library
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary-600/20 blur-3xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-1000"></div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <img src={book.imageURL} alt={book.title} className="w-full aspect-[3/4] object-cover" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <span className="px-3 py-1 bg-primary-600/10 text-primary-400 text-xs font-bold rounded-full uppercase tracking-widest border border-primary-600/20">{book.genre}</span>
               <div className="flex items-center gap-1 text-amber-500 font-black">
                 <Star className="w-4 h-4 fill-amber-500" />
                 <span>{book.rating.toFixed(1)}</span>
                 <span className="text-gray-500 text-sm font-bold">({book.numReviews})</span>
               </div>
               {book.seller && (
                 <div className="flex items-center gap-2 text-xs text-gray-400 font-bold bg-white/5 px-3 py-1 rounded-full">
                    <User className="w-3 h-3" />
                    <span>Seller: {book.seller.name}</span>
                 </div>
               )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">{book.title}</h1>
            <p className="text-xl text-gray-400">by {book.author}</p>
          </div>

          <div className="flex items-center gap-8">
            {book.listingType !== 'Rental' && (
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase">Buy Now</p>
                <p className="text-4xl font-black text-white">₹{book.price}</p>
              </div>
            )}
            {book.listingType !== 'Sale' && (
              <div className="space-y-1 border-l border-white/10 pl-8">
                <p className="text-xs font-bold text-gray-500 uppercase">Rent (Daily)</p>
                <p className="text-4xl font-black text-primary-400">₹{book.rentalPrice}</p>
              </div>
            )}
          </div>

          <p className="text-lg text-gray-300 leading-relaxed max-w-lg">{book.description}</p>

          <div className="space-y-6">
            {book.listingType !== 'Rental' && (
              <div className="p-6 glass-card rounded-3xl border border-white/5 space-y-4">
                <h3 className="font-bold text-white flex items-center gap-2 pr-4"><ShoppingCart className="w-5 h-5 text-primary-400" /> Purchase this book</h3>
                <div className="flex gap-4">
                  <div className="flex items-center bg-white/5 rounded-xl border border-white/10 pr-2">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 text-white">-</button>
                    <span className="w-10 text-center font-bold">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-10 h-10 text-white">+</button>
                  </div>
                  <button onClick={handleAddToCart} className="flex-grow py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-600/20">Add to Cart</button>
                </div>
              </div>
            )}

            {book.listingType !== 'Sale' && (
              <div className="p-6 glass-card rounded-3xl border border-white/5 space-y-4">
                <h3 className="font-bold text-white flex items-center gap-2"><Key className="w-5 h-5 text-primary-400" /> Rent for a while</h3>
                <div className="flex gap-4">
                  <select 
                    value={rentDays} 
                    onChange={(e) => setRentDays(parseInt(e.target.value))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none"
                  >
                    <option value="7" className="bg-slate-900">7 Days</option>
                    <option value="14" className="bg-slate-900">14 Days</option>
                    <option value="30" className="bg-slate-900">30 Days</option>
                  </select>
                  <button onClick={handleRent} className="flex-grow py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all">Rent for ₹{(book.rentalPrice * rentDays).toFixed(2)}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-12 border-t border-white/5">
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-white">Customer Reviews</h2>
          {book.reviews.length === 0 ? (
            <p className="text-gray-500 font-medium">No reviews yet. Be the first to review this book!</p>
          ) : (
            <div className="space-y-6">
              {book.reviews.map((review) => (
                <div key={review._id} className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-white">{review.name}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-500' : 'text-gray-700'}`} />
                        ))}
                      </div>
                      {user && String(user._id) === String(review.user) && (
                        <div className="flex gap-2">
                           <button onClick={() => handleEditClick(review)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"><Pencil className="w-4 h-4" /></button>
                           <button onClick={deleteReviewHandler} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{review.comment}</p>
                  <p className="text-xs text-gray-600 font-bold">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-black text-white">{isEditing ? 'Edit Your Review' : 'Write a Review'}</h2>
          {user ? (
            <form onSubmit={submitReviewHandler} className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-400 uppercase">Your Rating</label>
                 <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`p-2 rounded-lg transition-all ${rating >= num ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-gray-600'}`}
                      >
                        <Star className={`w-6 h-6 ${rating >= num ? 'fill-amber-500' : ''}`} />
                      </button>
                    ))}
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-400 uppercase">Review Comment</label>
                 <textarea
                   rows="4"
                   value={comment}
                   onChange={(e) => setComment(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary-500 transition-colors resize-none shadow-inner"
                   placeholder="Share your thoughts about this book..."
                   required
                 ></textarea>
               </div>
               <div className="flex gap-4">
                 {isEditing && (
                   <button
                    type="button"
                    onClick={() => { setIsEditing(false); setRating(0); setComment(''); }}
                    className="flex-grow py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10"
                   >
                    Cancel
                   </button>
                 )}
                 <button
                   type="submit"
                   disabled={submitting}
                   className="flex-grow py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50"
                 >
                   {submitting ? 'Processing...' : (isEditing ? 'Update Review' : 'Post Review')}
                 </button>
               </div>
            </form>
          ) : (
            <div className="glass-card p-8 rounded-3xl border border-white/5 text-center space-y-4">
               <p className="text-gray-400 font-medium">You need to be logged in to write a review.</p>
               <Link to={`/login?redirect=book/${id}`} className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all">Log In to Review</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
