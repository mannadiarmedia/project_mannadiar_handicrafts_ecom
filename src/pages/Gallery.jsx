import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Sparkles, Filter, ChevronDown, ArrowRight, LayoutGrid, Columns3, Columns4, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import SEO from '../components/SEO';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../data/galleryData';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(32);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [columnCount, setColumnCount] = useState(4); // 3 or 4 columns

  // Filter items by category & search query
  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Sliced items for smooth progressive loading
  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(32);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 32);
  };

  const handleLoadAll = () => {
    setVisibleCount(filteredItems.length);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'Inter' }}>
      <SEO 
        title="Store & Heritage Gallery | Pinterest-Style Uncropped Masterpieces | Mannadiar Handicrafts"
        description="Explore our complete uncropped visual gallery of 130+ authentic handcrafted bronze idols, brass lamps, Tanjore paintings, and wood carvings."
        keywords="handicrafts gallery, bronze statues gallery, kerala brass lamps showroom, wood carvings display, indian temple art pinterest masonry"
      />

      {/* Hero Header */}
      <section style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #eee', padding: '70px 0 50px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '850px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', border: '1px solid #d4af37', padding: '6px 18px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 600, color: '#977218', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
            <Sparkles size={14} color="#d4af37" /> Complete Uncropped Visual Archive (130+ Artworks)
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 300, fontFamily: 'Playfair Display', margin: '0 0 16px 0', color: '#111', lineHeight: 1.2 }}>
            Living Store & Heritage Gallery
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: 1.7, margin: '0 auto 28px auto', maxWidth: '680px' }}>
            Explore every intricate curve, tall temple idol, wide architectural panel, and sacred heirloom in full original landscape and portrait dimensions.
          </p>

          {/* Search bar inside header */}
          <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
            <Search size={18} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by exhibit number, category, or keyword..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(32); }}
              style={{
                width: '100%',
                padding: '12px 16px 12px 46px',
                borderRadius: '30px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter & Controls Bar */}
      <section style={{ padding: '20px 0', borderBottom: '1px solid #eee', position: 'sticky', top: '73px', backgroundColor: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)', zIndex: 30 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '0 20px' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {GALLERY_CATEGORIES.map((cat) => {
              const count = cat === 'All' ? GALLERY_ITEMS.length : GALLERY_ITEMS.filter(i => i.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '20px',
                    border: isSelected ? '1px solid #111' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#111' : '#fff',
                    color: isSelected ? '#fff' : '#4a5568',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{cat}</span>
                  <span style={{ fontSize: '0.72rem', opacity: isSelected ? 0.8 : 0.6 }}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Column Toggle (Desktop) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>Layout:</span>
            <button
              onClick={() => setColumnCount(3)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: columnCount === 3 ? '1px solid #111' : '1px solid #ddd',
                backgroundColor: columnCount === 3 ? '#111' : '#fff',
                color: columnCount === 3 ? '#fff' : '#666',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="3 Columns (Large Pins)"
            >
              <Columns3 size={14} /> 3 Col
            </button>
            <button
              onClick={() => setColumnCount(4)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: columnCount === 4 ? '1px solid #111' : '1px solid #ddd',
                backgroundColor: columnCount === 4 ? '#111' : '#fff',
                color: columnCount === 4 ? '#fff' : '#666',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="4 Columns (Pinterest Density)"
            >
              <Columns4 size={14} /> 4 Col
            </button>
          </div>
        </div>
      </section>

      {/* Pinterest-Style Masonry Layout */}
      <section className="container" style={{ paddingTop: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
        {displayedItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>No artworks found matching "{searchQuery}".</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="btn btn-outline">
              Reset Filters
            </button>
          </div>
        ) : (
          <div 
            className="pinterest-masonry"
            style={{
              columnCount: columnCount
            }}
          >
            {displayedItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.35, delay: (idx % 8) * 0.03 }}
                className="pinterest-item"
                onClick={() => openLightbox(idx)}
              >
                {/* 100% Uncropped Original Image */}
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '11px'
                  }}
                />

                {/* Hover Gradient Overlay with Title and Inspect button */}
                <div className="pinterest-overlay">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#d4af37', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                        {item.category}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 500, fontFamily: 'Playfair Display', margin: '2px 0 0 0', color: '#fff' }}>
                        {item.title}
                      </h4>
                    </div>

                    <div style={{
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(4px)',
                      padding: '8px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Maximize2 size={16} color="#fff" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Controls */}
        {visibleCount < filteredItems.length && (
          <div style={{ textAlign: 'center', marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={handleLoadMore}
                className="btn btn-outline"
                style={{
                  padding: '14px 32px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#fff'
                }}
              >
                <span>Load More Artworks (+32)</span>
                <ChevronDown size={16} />
              </button>
              
              <button
                onClick={handleLoadAll}
                className="btn"
                style={{
                  padding: '14px 28px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  backgroundColor: '#111',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Show All ({filteredItems.length} Pins)
              </button>
            </div>

            <div style={{ color: '#888', fontSize: '0.85rem' }}>
              Showing {displayedItems.length} of {filteredItems.length} uncropped artworks
            </div>
          </div>
        )}

        {/* Custom Commission Banner */}
        <div style={{ marginTop: '80px', padding: '48px 32px', backgroundColor: '#111', color: '#fff', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display', fontWeight: 300, margin: '0 0 12px 0' }}>
            Commission a Custom Temple Sculpture
          </h3>
          <p style={{ color: '#aaa', maxWidth: '640px', margin: '0 auto 28px auto', fontSize: '1rem', lineHeight: 1.6 }}>
            Did you spot a sculpture or panel in our gallery you'd like crafted in custom dimensions, metals, or temple specifications? Our hereditary artisans can craft it for you.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/corporate-gifting" className="btn" style={{ backgroundColor: '#d4af37', color: '#fff', padding: '12px 28px', textDecoration: 'none', fontWeight: 500 }}>
              Custom Commission Inquiry
            </Link>
            <Link to="/shop" className="btn btn-outline" style={{ color: '#fff', borderColor: '#555', padding: '12px 28px', textDecoration: 'none' }}>
              Browse Store Catalog <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Fullscreen Uncropped Lightbox Viewer */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={displayedItems.map(item => ({ src: item.src, title: item.title, description: item.category }))}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </div>
  );
}
