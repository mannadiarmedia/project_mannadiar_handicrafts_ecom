import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Sparkles, Filter, ChevronDown, ArrowRight, LayoutGrid, Columns3, Columns4, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import SEO from '../components/SEO';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../data/galleryData';
import useWindowSize from '../hooks/useWindowSize';

// ==========================================
// MOBILE GALLERY VIEW
// ==========================================
function MobileGalleryView({
  searchQuery, setSearchQuery, selectedCategory, handleCategoryChange,
  displayedItems, filteredItems, visibleCount, handleLoadMore, handleLoadAll,
  openLightbox
}) {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'Inter' }}>
      {/* Mobile Header */}
      <section style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #eee', padding: '40px 16px 20px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 300, fontFamily: 'Playfair Display', margin: '0 0 12px 0', color: '#111', lineHeight: 1.2 }}>
          Heritage Gallery
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.6, margin: '0 auto 20px auto' }}>
          Explore our visual archive of 130+ handcrafted artworks.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={18} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search gallery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 46px', borderRadius: '30px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>
      </section>

      {/* Horizontal Filter Bar */}
      <section style={{ padding: '12px 16px', borderBottom: '1px solid #eee', position: 'sticky', top: '0', backgroundColor: 'rgba(255,255,255,0.96)', zIndex: 30 }}>
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {GALLERY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '6px 16px', borderRadius: '20px', flexShrink: 0,
                  border: isSelected ? '1px solid #111' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#111' : '#fff',
                  color: isSelected ? '#fff' : '#4a5568',
                  fontSize: '0.85rem', fontWeight: isSelected ? 600 : 400
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Masonry (2 columns for Mobile) */}
      <section style={{ padding: '20px 12px' }}>
        {displayedItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <p>No artworks found.</p>
          </div>
        ) : (
          <div className="pinterest-masonry" style={{ columnCount: 2, gap: '12px' }}>
            {displayedItems.map((item, idx) => (
              <div key={item.id} className="pinterest-item" onClick={() => openLightbox(idx)} style={{ marginBottom: '12px' }}>
                <img src={item.src} alt={item.title} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} />
              </div>
            ))}
          </div>
        )}

        {/* Mobile Load More */}
        {visibleCount < filteredItems.length && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={handleLoadMore} className="btn btn-outline" style={{ width: '100%', padding: '14px', borderRadius: '8px' }}>
              Load More (+32)
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// ==========================================
// DESKTOP GALLERY VIEW
// ==========================================
function DesktopGalleryView({
  searchQuery, setSearchQuery, selectedCategory, handleCategoryChange,
  displayedItems, filteredItems, visibleCount, handleLoadMore, handleLoadAll,
  openLightbox, columnCount, setColumnCount
}) {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'Inter' }}>
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

          <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
            <Search size={18} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by exhibit number, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 46px', borderRadius: '30px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        </div>
      </section>

      {/* Filter & Controls Bar */}
      <section style={{ padding: '20px 0', borderBottom: '1px solid #eee', position: 'sticky', top: '73px', backgroundColor: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)', zIndex: 30 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '0 20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {GALLERY_CATEGORIES.map((cat) => {
              const count = cat === 'All' ? GALLERY_ITEMS.length : GALLERY_ITEMS.filter(i => i.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    padding: '7px 16px', borderRadius: '20px',
                    border: isSelected ? '1px solid #111' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#111' : '#fff',
                    color: isSelected ? '#fff' : '#4a5568',
                    fontSize: '0.82rem', fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Column Toggle (Desktop) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>Layout:</span>
            <button onClick={() => setColumnCount(3)} style={{ padding: '6px 12px', borderRadius: '6px', border: columnCount === 3 ? '1px solid #111' : '1px solid #ddd', backgroundColor: columnCount === 3 ? '#111' : '#fff', color: columnCount === 3 ? '#fff' : '#666', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Columns3 size={14} /> 3 Col
            </button>
            <button onClick={() => setColumnCount(4)} style={{ padding: '6px 12px', borderRadius: '6px', border: columnCount === 4 ? '1px solid #111' : '1px solid #ddd', backgroundColor: columnCount === 4 ? '#111' : '#fff', color: columnCount === 4 ? '#fff' : '#666', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Columns4 size={14} /> 4 Col
            </button>
          </div>
        </div>
      </section>

      {/* Masonry Layout */}
      <section className="container" style={{ paddingTop: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
        {displayedItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
            <p style={{ fontSize: '1.2rem' }}>No artworks found.</p>
          </div>
        ) : (
          <div className="pinterest-masonry" style={{ columnCount: columnCount }}>
            {displayedItems.map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.05 }} className="pinterest-item" onClick={() => openLightbox(idx)}>
                <img src={item.src} alt={item.alt} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '11px' }} />
                <div className="pinterest-overlay">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#d4af37', textTransform: 'uppercase', fontWeight: 600 }}>{item.category}</span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 500, fontFamily: 'Playfair Display', margin: '2px 0 0 0', color: '#fff' }}>{item.title}</h4>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Controls */}
        {visibleCount < filteredItems.length && (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <button onClick={handleLoadMore} className="btn btn-outline" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>
              Load More Artworks (+32)
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// ==========================================
// MAIN GALLERY EXPORT
// ==========================================
export default function Gallery() {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(32);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [columnCount, setColumnCount] = useState(4); 

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

  const props = {
    searchQuery, setSearchQuery, selectedCategory, handleCategoryChange,
    displayedItems, filteredItems, visibleCount, handleLoadMore, handleLoadAll,
    openLightbox, columnCount, setColumnCount
  };

  return (
    <>
      <SEO 
        title="Store & Heritage Gallery | Pinterest-Style Uncropped Masterpieces | Mannadiar Handicrafts"
        description="Explore our complete uncropped visual gallery of 130+ authentic handcrafted bronze idols, brass lamps, Tanjore paintings, and wood carvings."
        keywords="handicrafts gallery, bronze statues gallery, kerala brass lamps showroom, wood carvings display, indian temple art pinterest masonry"
      />
      {isMobile ? <MobileGalleryView {...props} /> : <DesktopGalleryView {...props} />}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={displayedItems.map(item => ({ src: item.src, title: item.title, description: item.category }))}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </>
  );
}
