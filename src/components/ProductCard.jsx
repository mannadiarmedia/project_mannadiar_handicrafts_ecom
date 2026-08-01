import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';

export default function ProductCard({ product, addToCart }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  // Fallback to primary image if gallery is empty
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const hasMultipleImages = gallery.length > 1;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className="product-card" 
      style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #eee' }}
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="image-zoom-container" style={{ position: 'relative', backgroundColor: '#f9f9f9', padding: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '4px' }}>
        
        {/* Badges */}
        {product.out_of_stock ? (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, backgroundColor: '#111', color: '#fff', fontSize: '0.7rem', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.05em', fontFamily: 'Inter' }}>
            SOLD OUT
          </div>
        ) : product.discounted_price ? (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, backgroundColor: '#d4af37', color: '#fff', fontSize: '0.7rem', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.05em', fontFamily: 'Inter' }}>
            SALE
          </div>
        ) : null}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            border: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s, background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart 
            size={16} 
            color={isWishlisted ? "#e53e3e" : "#666"} 
            fill={isWishlisted ? "#e53e3e" : "transparent"} 
          />
        </button>

        <AnimatePresence mode="wait">
          {isHovered && hasMultipleImages ? (
            <motion.img 
              key="image-2"
              src={gallery[1]} 
              alt={`${product.title} - view 2`} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{ objectFit: 'contain', width: '100%', height: '100%', position: 'absolute', inset: 0, padding: '24px' }} 
            />
          ) : (
            <motion.img 
              key="image-1"
              src={gallery[0]} 
              alt={product.title} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: isHovered && !hasMultipleImages ? 1.05 : 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{ objectFit: 'contain', width: '100%', height: '100%', position: 'absolute', inset: 0, padding: '24px' }} 
            />
          )}
        </AnimatePresence>
      </div>
      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'Inter' }}>{product.category}</div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 400, marginBottom: '8px', fontFamily: 'Playfair Display', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontFamily: 'Inter' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {product.discounted_price ? (
            <>
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#d4af37' }}>₹{product.discounted_price.toLocaleString('en-IN')}</span>
              <span style={{ fontSize: '0.9rem', color: '#999', textDecoration: 'line-through' }}>₹{product.price.toLocaleString('en-IN')}</span>
            </>
          ) : (
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
        
        {addToCart && !product.out_of_stock && (
          <button 
            onClick={(e) => {
              e.stopPropagation(); // prevent card click
              addToCart(product);
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#111', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#111'}
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
