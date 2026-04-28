import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, Key, Package, User as UserIcon, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [ordersRes, rentalsRes, booksRes] = await Promise.all([
          api.get('/api/orders/myorders', config),
          api.get('/api/rentals/myrentals', config),
          api.get('/api/books', config)
        ]);
        
        setOrders(ordersRes.data);
        setRentals(rentalsRes.data);
        // Filter books where seller is current user
        setMyListings(booksRes.data.filter(b => b.seller?._id === user._id));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const TabButton = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === id ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 glass-card p-10 rounded-[2.5rem] border border-white/5">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
          {user.name.charAt(0)}
        </div>
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-black text-white">{user.name}</h1>
          <p className="text-gray-400 font-medium">{user.email}</p>
          <div className="flex gap-4 mt-4">
             <span className="px-4 py-1 bg-white/5 rounded-full text-xs font-bold text-primary-400 uppercase tracking-widest border border-white/10">
               {user.role}
             </span>
             {user.role === 'admin' && (
               <Link to="/sell" className="text-sm font-bold text-primary-400 hover:underline flex items-center gap-1">
                 List a book to sell <ArrowUpRight className="w-4 h-4" />
               </Link>
             )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-white/5 pb-4">
        <TabButton id="orders" label="My Purchases" icon={ShoppingBag} />
        <TabButton id="rentals" label="My Rentals" icon={Key} />
        {user.role === 'admin' && <TabButton id="listings" label="My Listings" icon={Package} />}
      </div>

      {/* Content */}
      <div className="space-y-6 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'orders' && (
              <div className="grid gap-6">
                {orders.length > 0 ? orders.map(order => (
                  <div key={order._id} className="glass-card p-6 rounded-3xl border border-white/5 flex flex-wrap justify-between items-center gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID: {order._id.slice(-8)}</p>
                      <h3 className="text-lg font-bold text-white uppercase">{order.orderItems.length} Books purchased</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary-400">₹{order.totalPrice.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 text-gray-500">No purchases yet. <Link to="/" className="text-primary-400 underline">Browse books</Link></div>
                )}
              </div>
            )}

            {activeTab === 'rentals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rentals.length > 0 ? rentals.map(rental => (
                  <div key={rental._id} className="glass-card p-6 rounded-3xl border border-white/5 flex gap-4">
                    <img src={rental.book?.imageURL} className="w-20 h-28 object-cover rounded-xl" />
                    <div className="space-y-2">
                       <h3 className="font-bold text-white text-lg">{rental.book?.title}</h3>
                       <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(rental.dueDate).toLocaleDateString()}</span>
                       </div>
                       <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${rental.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                         {rental.status}
                       </span>
                    </div>
                  </div>
                )) : (
                   <div className="col-span-full text-center py-20 text-gray-500">No active rentals.</div>
                )}
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.length > 0 ? myListings.map(listing => (
                  <div key={listing._id} className="glass-card p-4 rounded-3xl border border-white/5 space-y-4">
                    <img src={listing.imageURL} className="w-full h-48 object-cover rounded-2xl" />
                    <div>
                      <h3 className="font-bold text-white truncate">{listing.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                         <p className="text-primary-400 font-black">₹{listing.price}</p>
                         <p className="text-xs text-gray-500">{listing.stockCount} in stock</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-20 text-gray-500">You haven't listed any books for sale. <Link to="/sell" className="text-primary-400 underline">List a book</Link></div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
