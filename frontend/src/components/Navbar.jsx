import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, BookOpen, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass h-16 flex items-center justify-between px-6 md:px-12">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
        <BookOpen className="text-primary-500" />
        <span>BookHaven</span>
      </Link>

      <div className="flex items-center gap-6">
        <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-400' : 'text-gray-300 hover:text-white'}`}>
          Home
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/sell" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-400' : 'text-gray-300 hover:text-white'}`}>
            Sell
          </NavLink>
        )}
        
        <Link to="/cart" className="relative group p-2 rounded-full hover:bg-white/5 transition-all">
          <ShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-primary-400" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartItems.length}
            </span>
          )}
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Link to="/admin" className="p-2 rounded-full hover:bg-white/5 text-gray-300 hover:text-primary-400" title="Admin Dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="px-5 py-2 rounded-full bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all shadow-lg shadow-primary-600/20">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
