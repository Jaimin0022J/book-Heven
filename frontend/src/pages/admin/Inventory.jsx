import React, { useState, useEffect, useContext } from 'react';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

const Inventory = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '', author: '', genre: '', description: '', price: '', stockCount: '', imageURL: ''
  });

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/api/books');
      setBooks(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenModal = (book = null) => {
    if (book) {
      setFormData({ ...book });
      setIsEditing(true);
      setCurrentId(book._id);
    } else {
      setFormData({ title: '', author: '', genre: '', description: '', price: '', stockCount: '', imageURL: '' });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      if (isEditing) {
        await api.put(`/api/books/${currentId}`, formData, config);
      } else {
        await api.post('/api/books', formData, config);
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      alert('Error saving book');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      try {
        await api.delete(`/api/books/${id}`, config);
        fetchBooks();
      } catch (err) {
        alert('Error deleting book');
      }
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Inventory Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-primary-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Book
        </button>
      </div>

      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-white/5">
            <tr>
              <th className="px-8 py-6">Book</th>
              <th className="px-8 py-6">Genre</th>
              <th className="px-8 py-6">Price</th>
              <th className="px-8 py-6">Stock</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {books.map(book => (
              <tr key={book._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={book.imageURL} alt="" className="w-10 h-14 object-cover rounded shadow" />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                    {book.genre}
                  </span>
                </td>
                <td className="px-8 py-6 text-white font-bold">₹{book.price}</td>
                <td className="px-8 py-6">
                  <span className={book.stockCount < 10 ? 'text-red-400 font-bold' : 'text-gray-400'}>
                    {book.stockCount} left
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button onClick={() => handleOpenModal(book)} className="p-2 hover:bg-white/5 text-primary-400 rounded-lg transition-colors inline-block">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(book._id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors inline-block">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative glass-card w-full max-w-2xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <h2 className="text-3xl font-black text-white mb-8">{isEditing ? 'Edit Book' : 'Add New Book'}</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-full">
                <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Author</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Genre</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Stock Count</label>
                <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={formData.stockCount} onChange={e => setFormData({...formData, stockCount: e.target.value})} />
              </div>
              <div className="space-y-2 col-span-full">
                <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs" value={formData.imageURL} onChange={e => setFormData({...formData, imageURL: e.target.value})} />
              </div>
              <div className="space-y-2 col-span-full">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea required rows="3" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="col-span-full pt-4">
                <button type="submit" className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-600/30">
                  {isEditing ? 'Save Changes' : 'Create Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
