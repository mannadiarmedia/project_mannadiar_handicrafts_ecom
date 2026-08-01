import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ChevronLeft, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logAnalyticsEvent } from '../firebase';
import useWindowSize from '../hooks/useWindowSize';

// ==========================================
// ORDER SUMMARY COMPONENT (Shared)
// ==========================================
function OrderSummary({ cart, cartTotal, isIndia, shippingFee, grandTotal, isMobile }) {
  return (
    <div style={{ padding: isMobile ? '24px 16px' : '40px 5%', backgroundColor: '#fafafa', borderBottom: isMobile ? '1px solid #e0e0e0' : 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {cart.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px' }}>
                <img src={item.image} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#666', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                1
              </div>
            </div>
            <div style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{item.title}</div>
            <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>₹{(item.discounted_price || item.price).toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
          <span>Subtotal</span>
          <span>₹{cartTotal.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
          <span>Shipping</span>
          <span>{isIndia ? (shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`) : 'To be Quoted'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
          <span>Estimated taxes</span>
          <span>Included in price</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '24px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>Total</span>
        <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>
          <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 400, marginRight: '8px' }}>INR</span>
          {isIndia ? `₹${grandTotal.toLocaleString('en-IN')}` : 'To be Quoted'}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// CHECKOUT FORM COMPONENT (Shared)
// ==========================================
function CheckoutForm({ formData, handleChange, handleSubmit, loading, isIndia, shippingFee, isMobile }) {
  return (
    <div style={{ padding: isMobile ? '24px 16px' : '40px 10%', flex: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <Link to="/shop" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#666', fontSize: '0.9rem' }}>
          <ChevronLeft size={16} /> Back to Shop
        </Link>
        <h1 style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontFamily: 'Playfair Display', marginTop: '24px' }}>Mannadiar Handicrafts</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Contact Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '16px' }}>Contact</h2>
          <input 
            type="email" 
            name="email" 
            placeholder="Email or mobile phone number" 
            required
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'Inter' }}
          />
        </div>

        {/* Delivery Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '16px' }}>Delivery</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <select 
              name="country" 
              value={formData.country} 
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'Inter', backgroundColor: '#fff' }}
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other (Rest of World)</option>
            </select>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
              <input type="text" name="firstName" placeholder="First name" required value={formData.firstName} onChange={handleChange} style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'Inter', minWidth: 0, width: '100%' }} />
              <input type="text" name="lastName" placeholder="Last name" required value={formData.lastName} onChange={handleChange} style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'Inter', minWidth: 0, width: '100%' }} />
            </div>

            <input type="text" name="address" placeholder="Address" required value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'Inter' }} />

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
              <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'Inter', minWidth: 0, width: '100%' }} />
              <div style={{ display: 'flex', gap: '16px', flex: isMobile ? 'none' : 2 }}>
                <input type="text" name="state" placeholder="State" required value={formData.state} onChange={handleChange} style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'Inter', minWidth: 0, width: '100%' }} />
                <input type="text" name="pin" placeholder="PIN code" required value={formData.pin} onChange={handleChange} style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'Inter', minWidth: 0, width: '100%' }} />
              </div>
            </div>

            <input type="tel" name="phone" placeholder="Phone" required value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'Inter' }} />
          </div>
        </div>

        {/* Shipping Method */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '16px' }}>Shipping method</h2>
          <div style={{ padding: '16px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500, color: '#333' }}>
                {isIndia ? 'Calculated Delivery' : 'International Freight'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                {isIndia ? 'Based on items in your cart' : 'Custom quote required for international shipping'}
              </div>
            </div>
            <div style={{ fontWeight: 500 }}>
              {isIndia ? (shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`) : 'To be Quoted'}
            </div>
          </div>
        </div>

        {/* Payment */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '16px' }}>Payment</h2>
          <div style={{ padding: '24px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', textAlign: 'center', color: '#555' }}>
            <p style={{ marginBottom: '16px' }}>
              Secure payment processing (UPI, Cards, Netbanking) will be integrated here via Razorpay.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              For now, click the button below to submit your order, and our team will contact you to arrange payment.
            </p>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '16px', fontSize: '1.2rem', marginTop: '16px' }}
          disabled={loading}
        >
          {loading ? 'Processing...' : (isIndia ? 'Complete Order' : 'Request International Quote')}
        </button>
      </form>
    </div>
  );
}

// ==========================================
// MOBILE CHECKOUT VIEW
// ==========================================
function MobileCheckoutView(props) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      
      {/* Mobile Accordion for Summary */}
      <div style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
        <button 
          onClick={() => setSummaryOpen(!summaryOpen)}
          style={{ width: '100%', padding: '20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: '#111', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37' }}>
            <ShoppingBag size={20} />
            <span style={{ fontWeight: 500, color: '#111' }}>{summaryOpen ? 'Hide order summary' : 'Show order summary'}</span>
            {summaryOpen ? <ChevronUp size={16} color="#111" /> : <ChevronDown size={16} color="#111" />}
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            {props.isIndia ? `₹${props.grandTotal.toLocaleString('en-IN')}` : 'To be Quoted'}
          </span>
        </button>

        {summaryOpen && (
          <OrderSummary {...props} isMobile={true} />
        )}
      </div>

      <CheckoutForm {...props} isMobile={true} />
    </div>
  );
}

// ==========================================
// DESKTOP CHECKOUT VIEW
// ==========================================
function DesktopCheckoutView(props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter', backgroundColor: '#fff', flexDirection: 'row' }}>
      <div style={{ flex: 1, borderRight: '1px solid #e0e0e0' }}>
        <CheckoutForm {...props} isMobile={false} />
      </div>
      <div style={{ flex: '0 0 45%', backgroundColor: '#fafafa' }}>
        <OrderSummary {...props} isMobile={false} />
      </div>
    </div>
  );
}

// ==========================================
// MAIN EXPORT
// ==========================================
export default function Checkout({ cart, setCart, cartTotal }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/shop');
    } else {
      logAnalyticsEvent('begin_checkout', {
        currency: 'INR',
        value: cartTotal,
        items: cart.map(item => ({
          item_id: item.id,
          item_name: item.title,
          item_category: item.category,
          price: item.discounted_price || item.price,
          quantity: 1
        }))
      });
    }
  }, [cart, navigate, cartTotal]);

  const [formData, setFormData] = useState({
    email: '',
    country: 'India',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pin: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isIndia = formData.country === 'India';
  const shippingFee = isIndia ? cart.reduce((sum, item) => sum + (Number(item.shipping_fee) || 0), 0) : 0;
  const grandTotal = cartTotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) return;

    try {
      setLoading(true);

      const orderData = {
        customer_email: formData.email,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        shipping_address: {
          country: formData.country,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pin: formData.pin,
          phone: formData.phone
        },
        items: cart,
        subtotal: cartTotal,
        shipping_fee: isIndia ? shippingFee : null,
        total: isIndia ? grandTotal : null,
        is_international: !isIndia,
        status: 'pending_payment',
        user_id: user ? user.uid : null
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) {
        throw error;
      }

      // Log e-commerce purchase event
      logAnalyticsEvent('purchase', {
        currency: 'INR',
        value: isIndia ? grandTotal : cartTotal,
        shipping: isIndia ? shippingFee : 0,
        items: cart.map(item => ({
          item_id: item.id,
          item_name: item.title,
          item_category: item.category,
          price: item.discounted_price || item.price,
          quantity: 1
        }))
      });

      setCart([]);
      navigate('/order-confirmation');

    } catch (error) {
      console.error('Error submitting order:', error.message);
      alert('There was an error processing your order. Please ensure the orders table exists in your database.');
    } finally {
      setLoading(false);
    }
  };

  const props = {
    cart, cartTotal, formData, handleChange, handleSubmit, loading, isIndia, shippingFee, grandTotal
  };

  return isMobile ? <MobileCheckoutView {...props} /> : <DesktopCheckoutView {...props} />;
}
