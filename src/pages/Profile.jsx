import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Package, LogOut, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'wishlist'

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '60px 0', minHeight: '60vh', fontFamily: 'Inter' }}>
      {/* Account Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #eee', paddingBottom: '24px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 300, fontFamily: 'Playfair Display', marginBottom: '8px' }}>My Account</h1>
          <p style={{ color: '#666', margin: 0 }}>{user.displayName ? `${user.displayName} (${user.email})` : user.email}</p>
        </div>
        <button 
          onClick={handleSignOut}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid #ccc', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Inter' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #eee', marginBottom: '32px' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '2px solid #111' : '2px solid transparent',
            fontWeight: activeTab === 'orders' ? 600 : 400,
            color: activeTab === 'orders' ? '#111' : '#666',
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: 'Inter'
          }}
        >
          <Package size={18} /> Order History ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'wishlist' ? '2px solid #111' : '2px solid transparent',
            fontWeight: activeTab === 'wishlist' ? 600 : 400,
            color: activeTab === 'wishlist' ? '#111' : '#666',
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: 'Inter'
          }}
        >
          <Heart size={18} color={activeTab === 'wishlist' ? '#e53e3e' : 'currentColor'} fill={activeTab === 'wishlist' ? '#e53e3e' : 'transparent'} /> 
          Saved Wishlist ({wishlist.length})
        </button>
      </div>

      {/* TAB 1: ORDER HISTORY */}
      {activeTab === 'orders' && (
        <div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ backgroundColor: '#fafafa', border: '1px solid #eee', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ color: '#666', marginBottom: '16px' }}>You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/shop')} className="btn btn-primary">Start Exploring</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {orders.map((order) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  key={order.id} 
                  style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}
                >
                  <div style={{ backgroundColor: '#fafafa', padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Order Placed</div>
                      <div style={{ fontWeight: 500 }}>{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Total</div>
                      <div style={{ fontWeight: 500 }}>₹{order.total?.toLocaleString('en-IN') || order.subtotal?.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Order ID</div>
                      <div style={{ fontWeight: 500 }}>#{order.id.slice(0,8)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-block', backgroundColor: order.status === 'shipped' ? '#e8f5e9' : '#fff3e0', color: order.status === 'shipped' ? '#2e7d32' : '#f57c00', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        {order.status.replace('_', ' ')}
                      </div>
                      {order.tracking_number && (
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>
                          Tracking: {order.tracking_number}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ width: '60px', height: '60px', backgroundColor: '#f9f9f9', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={item.image} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{item.title}</div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>{item.category}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? (
            <div style={{ backgroundColor: '#fafafa', border: '1px solid #eee', padding: '60px 40px', borderRadius: '8px', textAlign: 'center' }}>
              <Heart size={48} color="#ccc" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display', marginBottom: '8px' }}>Your Saved Wishlist is Empty</h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>Browse our handcrafted collection and click the heart icon on any piece you'd like to save.</p>
              <button onClick={() => navigate('/shop')} className="btn btn-primary">Browse Masterpieces</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {wishlist.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div 
                      onClick={() => navigate(`/product/${item.id}`)}
                      style={{ height: '200px', backgroundColor: '#f9f9f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '16px', marginBottom: '16px' }}
                    >
                      <img src={item.image} alt={item.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', marginBottom: '4px' }}>{item.category}</div>
                    <h4 
                      onClick={() => navigate(`/product/${item.id}`)}
                      style={{ fontSize: '1.05rem', fontWeight: 500, fontFamily: 'Playfair Display', margin: '0 0 8px 0', cursor: 'pointer' }}
                    >
                      {item.title}
                    </h4>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111', marginBottom: '16px' }}>
                      {item.discounted_price ? (
                        <span>₹{item.discounted_price.toLocaleString('en-IN')}</span>
                      ) : (
                        <span>₹{item.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }}
                    >
                      View Piece
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      style={{
                        padding: '10px 14px',
                        background: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#e53e3e'
                      }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
