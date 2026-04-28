import React, { useState, useEffect, useContext } from 'react';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { BarChart3, Users, ShoppingCart, Package, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimatedNumber = ({ value, duration = 2000, isCurrency = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {isCurrency ? "₹" : ""}
      {isCurrency ? count.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Math.floor(count).toLocaleString('en-IN')}
    </span>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ books: 0, orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [books, orders, users] = await Promise.all([
          api.get('/api/books'),
          api.get('/api/orders', config),
          api.get('/api/users', config)
        ]);

        const revenue = orders.data.reduce((acc, order) => acc + order.totalPrice, 0);

        setStats({
          books: books.data.length,
          orders: orders.data.length,
          users: users.data.length,
          revenue
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const StatCard = ({ icon: Icon, label, value, color, trend, isCurrency }) => (
    <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-4">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-gray-400 font-medium">{label}</p>
          <h3 className="text-3xl font-black text-white mt-1">
            <AnimatedNumber value={value} isCurrency={isCurrency} />
          </h3>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-500 text-sm font-bold bg-green-500/10 px-2 py-1 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            {trend}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back, {user.name}. Here's what's happening today.</p>
        </div>
        <Link to="/admin/inventory" className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all font-bold">
           <Package className="w-5 h-5 text-primary-400" />
           Manage Inventory
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={BarChart3} label="Total Revenue" value={stats.revenue} isCurrency={true} color="bg-primary-600 shadow-lg shadow-primary-600/30" trend="+12.5%" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.orders} color="bg-purple-600 shadow-lg shadow-purple-600/30" trend="+5.2%" />
        <StatCard icon={Users} label="Total Customers" value={stats.users} color="bg-blue-600 shadow-lg shadow-blue-600/30" trend="+2.4%" />
        <StatCard icon={Package} label="Books in Library" value={stats.books} color="bg-amber-600 shadow-lg shadow-amber-600/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/5 h-[400px] flex flex-col items-center justify-center text-center">
            <BarChart3 className="w-16 h-16 text-gray-700 mb-4" />
            <p className="text-gray-500 font-medium">Sales Analytics Visualization Coming Soon</p>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <ArrowUpRight className="text-gray-500 w-5 h-5" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                   <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">New order received</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
