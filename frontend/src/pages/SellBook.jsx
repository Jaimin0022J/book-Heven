import React, { useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen, DollarSign, Tag, Archive, FileText, LayoutList } from 'lucide-react';

const SellBook = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', author: '', genre: '', description: '', price: '', rentalPrice: '', stockCount: '1', imageURL: '', listingType: 'Sale'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      await api.post('/api/books', formData, config);
      alert('Book listed successfully!');
      navigate('/profile');
    } catch (err) {
      alert('Error listing book');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="glass-card rounded-[2.5rem] p-10 md:p-14 border border-white/10 shadow-2xl space-y-10">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary-600/30">
            <Upload className="text-primary-400 w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-white">List Your Book</h1>
          <p className="text-gray-400">Share your stories with the community and earn.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 col-span-full">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Book Title
            </label>
            <input 
              required 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary-500/50 transition-all outline-none" 
              placeholder="The Midnight Library"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Tag className="w-4 h-4" /> Author
            </label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <LayoutList className="w-4 h-4" /> Genre
            </label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Sale Price ($)
            </label>
            <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Archive className="w-4 h-4" /> Rental Price (Daily)
            </label>
            <input type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" value={formData.rentalPrice} onChange={e => setFormData({...formData, rentalPrice: e.target.value})} />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Listing Type</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none appearance-none"
              value={formData.listingType}
              onChange={e => setFormData({...formData, listingType: e.target.value})}
            >
              <option value="Sale" className="bg-slate-900">Sale Only</option>
              <option value="Rental" className="bg-slate-900">Rental Only</option>
              <option value="Both" className="bg-slate-900">Both Sale & Rental</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" placeholder="https://..." value={formData.imageURL} onChange={e => setFormData({...formData, imageURL: e.target.value})} />
          </div>

          <div className="space-y-3 col-span-full">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea required rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="col-span-full pt-6">
            <button type="submit" className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-[1.5rem] font-bold text-xl transition-all shadow-2xl shadow-primary-600/30 active:scale-[0.98]">
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellBook;
