import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Tag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { logAnalyticsEvent } from '../firebase';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Live search debounced
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const cleanQ = query.trim();
        const { data, error } = await supabase
          .from('products')
          .select('id, title, category, price, discounted_price, image, sku, material')
          .or(`title.ilike.%${cleanQ}%,category.ilike.%${cleanQ}%,sku.ilike.%${cleanQ}%,material.ilike.%${cleanQ}%,description.ilike.%${cleanQ}%`)
          .limit(8);

        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleFullSearch = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    logAnalyticsEvent('search', { search_term: query.trim() });
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const popularSearches = ['Nataraja', 'Brass Lamp', 'Krishna', 'Durga', 'Saraswati', 'Wood Carving', 'Tanjore'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '80px' }}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            style={{ 
              position: 'relative', 
              width: '90%', 
              maxWidth: '680px', 
              backgroundColor: '#fff', 
              borderRadius: '12px', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '80vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <form onSubmit={handleFullSearch} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee', gap: '12px' }}>
              <Search size={22} color="#888" />
              <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by idol name, category, material, or SKU (e.g. BRS-001)..."
                style={{ 
                  flex: 1, 
                  border: 'none', 
                  outline: 'none', 
                  fontSize: '1.05rem', 
                  fontFamily: 'Inter',
                  color: '#111'
                }}
              />
              {query && (
                <button 
                  type="button" 
                  onClick={() => setQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '4px', display: 'flex', alignItems: 'center' }}
                >
                  <X size={18} />
                </button>
              )}
              <button 
                type="button" 
                onClick={onClose}
                style={{ 
                  backgroundColor: '#f3f3f3', 
                  border: 'none', 
                  borderRadius: '6px', 
                  padding: '6px 12px', 
                  fontFamily: 'Inter', 
                  fontSize: '0.8rem', 
                  color: '#666',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                ESC
              </button>
            </form>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {loading && (
                <div style={{ textAlign: 'center', padding: '32px', color: '#888', fontFamily: 'Inter' }}>
                  Searching the sacred archives...
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '12px', fontFamily: 'Playfair Display' }}>
                    No masterpieces found for "{query}"
                  </p>
                  <p style={{ color: '#999', fontSize: '0.9rem', fontFamily: 'Inter', marginBottom: '20px' }}>
                    Try searching for "Nataraja", "Brass", "Diya", or specific SKUs.
                  </p>
                  <button 
                    onClick={handleFullSearch}
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    View All in Shop
                  </button>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter' }}>
                      Products ({results.length})
                    </span>
                    <button 
                      onClick={handleFullSearch}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter' }}
                    >
                      View all results <ArrowRight size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: '#fff',
                          border: '1px solid #f0f0f0',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fbfbfb';
                          e.currentTarget.style.borderColor = '#ddd';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fff';
                          e.currentTarget.style.borderColor = '#f0f0f0';
                        }}
                      >
                        <div style={{ width: '48px', height: '48px', backgroundColor: '#f5f5f5', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                        
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Inter' }}>
                              {product.title}
                            </span>
                            {product.sku && (
                              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#888', backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
                                {product.sku}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#777', fontFamily: 'Inter', marginTop: '2px' }}>
                            {product.category} {product.material ? `• ${product.material}` : ''}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0, fontFamily: 'Inter' }}>
                          {product.discounted_price ? (
                            <div>
                              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#d4af37' }}>₹{product.discounted_price.toLocaleString('en-IN')}</span>
                              <div style={{ fontSize: '0.75rem', color: '#999', textDecoration: 'line-through' }}>₹{product.price.toLocaleString('en-IN')}</div>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111' }}>₹{product.price.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions when empty */}
              {!query && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontFamily: 'Inter' }}>
                    Popular Searches
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {popularSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(term)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: '1px solid #e5e5e5',
                          backgroundColor: '#fafafa',
                          color: '#444',
                          fontSize: '0.85rem',
                          fontFamily: 'Inter',
                          cursor: 'pointer'
                        }}
                      >
                        <Tag size={12} color="#888" /> {term}
                      </button>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontFamily: 'Inter' }}>
                    Browse by Category
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {['Brass', 'Bronze', 'Wood', 'Stone', 'Paintings'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          onClose();
                          navigate(`/shop?category=${cat}`);
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #eee',
                          backgroundColor: '#fdfdfd',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontFamily: 'Inter',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: '#222'
                        }}
                      >
                        {cat} Masterpieces
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Tip */}
            <div style={{ padding: '12px 20px', backgroundColor: '#fafafa', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#888', fontFamily: 'Inter' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Press</span>
                <kbd style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '3px', padding: '1px 5px', fontSize: '0.7rem' }}>↵ Enter</kbd>
                <span>to see all results</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Press</span>
                <kbd style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '3px', padding: '1px 5px', fontSize: '0.7rem' }}>ESC</kbd>
                <span>to close</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
