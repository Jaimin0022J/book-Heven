import React, { useState, useEffect } from 'react';
import api from '../api';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await api.get(`/api/books?keyword=${keyword}`);
        setBooks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books', error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [keyword]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-80 md:h-[400px] rounded-3xl overflow-hidden flex items-center px-8 md:px-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
            alt="Library" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Discover Your Next <span className="text-primary-500">Great Adventure</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-lg">
            Explore thousands of books from world-renowned authors. From thrillers to tech, we have it all.
          </p>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by title, author or genre..." 
              className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-500"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Featured Books</h2>
          <div className="flex gap-2">
            {['All', 'Fiction', 'Tech', 'History'].map(genre => (
              <button 
                key={genre}
                onClick={() => setKeyword(genre === 'All' ? '' : genre)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border border-white/5 transition-all ${
                  (keyword.toLowerCase() === genre.toLowerCase() || (genre === 'All' && keyword === '')) 
                    ? 'bg-primary-500 text-white border-primary-500' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.length > 0 ? (
              books.map(book => <BookCard key={book._id} book={book} />)
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">No books found matching your criteria.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
