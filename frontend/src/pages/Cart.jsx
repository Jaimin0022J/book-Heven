import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import api from '../api';

const Cart = () => {
  const { cartItems, removeFromCart, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login?redirect=cart');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const orderData = {
        orderItems: cartItems,
        totalPrice,
      };

      await api.post('/api/orders', orderData, config);
      alert('Order Placed Successfully!');
      clearCart();
      navigate('/');
    } catch (err) {
      alert('Order Placement Failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-black text-white">Your Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="glass-card rounded-3xl p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-gray-500" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">Your cart is empty</p>
            <p className="text-gray-400">Looks like you haven't added anything yet.</p>
          </div>
          <Link to="/" className="inline-block py-4 px-8 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-600/30">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.book} className="glass-card rounded-2xl p-4 flex gap-6 items-center border border-white/5 hover:border-white/10 transition-all">
                <img 
                  src={item.imageURL} 
                  alt={item.title} 
                  className="w-24 h-32 object-cover rounded-xl"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-gray-500 font-medium">₹{item.price}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm text-gray-400">Qty: {item.qty}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.book)}
                  className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-8 sticky top-24 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold">FREE</span>
                </div>
                <div className="h-px bg-white/10 my-6"></div>
                <div className="flex justify-between text-xl font-black text-white">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2"
              >
                Checkout Now
              </button>
              <p className="mt-4 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
