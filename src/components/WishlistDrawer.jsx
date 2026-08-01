import React from 'react';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistDrawer({ isOpen, onClose, addToCart }) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    if (addToCart) {
      addToCart(product);
    }
    removeFromWishlist(product.id);
  };

  const handleGoToProduct = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60, backdropFilter: 'blur(2px)' }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#fff',
              zIndex: 70,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={20} color="#e53e3e" fill="#e53e3e" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 500, fontFamily: 'Playfair Display', margin: 0 }}>
                  Saved Wishlist ({wishlist.length})
                </h2>
              </div>
              <button 
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#666' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Item List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
                  <Heart size={48} color="#ccc" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: '#333', marginBottom: '8px', fontFamily: 'Playfair Display' }}>
                    Your wishlist is empty
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '24px', fontFamily: 'Inter' }}>
                    Save your favorite handcrafted statues, carvings, and paintings to review them later.
                  </p>
                  <button 
                    onClick={() => { onClose(); navigate('/shop'); }}
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', padding: '10px 20px' }}
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {wishlist.map((item) => (
                    <div 
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '14px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        backgroundColor: '#fafafa'
                      }}
                    >
                      <div 
                        onClick={() => handleGoToProduct(item.id)}
                        style={{ width: '70px', height: '70px', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <img src={item.image} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 
                            onClick={() => handleGoToProduct(item.id)}
                            style={{ fontSize: '0.9rem', fontWeight: 500, margin: '0 0 4px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Inter' }}
                          >
                            {item.title}
                          </h4>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111', fontFamily: 'Inter' }}>
                            {item.discounted_price ? (
                              <span>₹{item.discounted_price.toLocaleString('en-IN')}</span>
                            ) : (
                              <span>₹{item.price.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <button
                            onClick={() => handleMoveToCart(item)}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '6px 10px',
                              backgroundColor: '#111',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              fontFamily: 'Inter',
                              cursor: 'pointer'
                            }}
                          >
                            <ShoppingBag size={13} /> Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            style={{
                              padding: '6px 10px',
                              background: '#fff',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              color: '#888',
                              cursor: 'pointer',
                              fontFamily: 'Inter'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid #eee', backgroundColor: '#fafafa' }}>
                <button
                  onClick={() => { onClose(); navigate('/profile'); }}
                  className="btn btn-outline"
                  style={{ width: '100%', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  View All in My Account <ArrowRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
