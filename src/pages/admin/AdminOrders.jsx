import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, RefreshCw } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const handleTrackingChange = (id, newTracking) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, tracking_number: newTracking } : order
    ));
  };

  const saveOrderUpdate = async (order) => {
    try {
      setUpdating(order.id);
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: order.status, 
          tracking_number: order.tracking_number 
        })
        .eq('id', order.id);

      if (error) throw error;
      alert(`Order #${order.id.slice(0,8)} updated successfully.`);
    } catch (error) {
      console.error('Error updating order:', error.message);
      alert('Failed to update order.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading orders...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, fontFamily: 'Playfair Display' }}>Order Management</h1>
        <button 
          onClick={fetchOrders}
          className="btn btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid #111', backgroundColor: '#fff', cursor: 'pointer' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              
              {/* Order Header */}
              <div style={{ backgroundColor: '#fafafa', padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Order ID</div>
                  <div style={{ fontWeight: 600 }}>#{order.id.split('-')[0]}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Date</div>
                  <div style={{ fontWeight: 500 }}>{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Customer</div>
                  <div style={{ fontWeight: 500 }}>{order.customer_name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{order.customer_email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Total</div>
                  <div style={{ fontWeight: 600, color: '#2e7d32' }}>₹{order.total?.toLocaleString('en-IN') || order.subtotal?.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                
                {/* Left Column: Items */}
                <div style={{ flex: '1 1 400px', padding: '24px', borderRight: '1px solid #eee' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: '#333' }}>Purchased Items</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'contain', backgroundColor: '#f9f9f9', padding: '4px', borderRadius: '4px', border: '1px solid #eee' }} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{item.title}</div>
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.sku ? `${item.sku} | ` : ''}{item.category} | ₹{(item.discounted_price || item.price).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Fulfillment */}
                <div style={{ flex: '1 1 300px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: '#333' }}>Fulfillment & Status</h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>Shipping Address:</div>
                    <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {order.shipping_address?.address}<br/>
                      {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pin}<br/>
                      {order.shipping_address?.country}<br/>
                      Phone: {order.shipping_address?.phone}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>Order Status</label>
                      <select 
                        value={order.status || 'pending_payment'} 
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      >
                        <option value="pending_payment">Pending Payment</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>Tracking Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. BLR12345678"
                        value={order.tracking_number || ''}
                        onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>

                    <button 
                      onClick={() => saveOrderUpdate(order)}
                      disabled={updating === order.id}
                      className="btn btn-primary"
                      style={{ marginTop: '8px', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                      <Save size={16} />
                      {updating === order.id ? 'Saving...' : 'Save Update'}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
