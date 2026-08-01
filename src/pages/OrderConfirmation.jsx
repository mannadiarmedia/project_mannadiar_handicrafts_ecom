import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <CheckCircle size={64} color="#2e7d32" style={{ marginBottom: '24px', margin: '0 auto' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '16px', fontFamily: 'Playfair Display' }}>
          Thank You For Your Order
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.6, marginBottom: '32px', fontFamily: 'Inter' }}>
          Your order has been securely received. Our team will review your request and contact you shortly to arrange payment and finalize shipping details.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', padding: '12px 32px' }}>
            Return Home
          </Link>
          <Link to="/shop" className="btn btn-outline" style={{ textDecoration: 'none', padding: '12px 32px', border: '1px solid #111', color: '#111', backgroundColor: 'transparent' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
