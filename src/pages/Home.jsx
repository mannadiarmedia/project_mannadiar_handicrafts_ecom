import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Gem, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import { GALLERY_ITEMS } from '../data/galleryData';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home({ addToCart }) {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('*').limit(8),
          supabase.from('categories').select('*').order('name').limit(4)
        ]);
          
        if (productsRes.error) throw productsRes.error;
        if (categoriesRes.error) throw categoriesRes.error;
        
        setFeaturedProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Helper to map category name to a static image for the grid
  const getCategoryImage = (categoryName) => {
    const mapping = {
      'Brass': '/images/1_brass_lamp.jpg',
      'Bronze': '/images/2_nataraja.jpg',
      'Wood': '/images/8_elephant.jpg',
      'Stone': '/images/10_ganesha.jpg',
      'Paintings': '/images/5_madhubani.jpg'
    };
    return mapping[categoryName] || '/images/6_vase.jpg';
  };

  return (
    <>
      {/* Dynamic Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '80vh', 
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Parallax Background */}
        <motion.div 
          style={{
            position: 'absolute', inset: -50,
            backgroundImage: 'url(/images/4_buddha.jpg)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
          }}
          initial={{ y: 0 }}
          animate={{ y: 0 }} // Simple static setup, complex parallax requires useScroll, we'll keep it simple for now or use scale
          whileInView={{ scale: 1.05 }}
          transition={{ duration: 10, ease: "linear" }}
        />
        
        {/* Dark Overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
        
        <motion.div 
          className="container" 
          style={{ position: 'relative', zIndex: 10, color: 'white', maxWidth: '800px' }}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span variants={fadeUp} style={{ display: 'block', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Inter' }}>
            The Essence of India
          </motion.span>
          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '24px' }}>
            Divine Masterpieces for Your Sacred Space
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '40px', opacity: 0.9, fontFamily: 'Inter' }}>
            Handcrafted with devotion by master artisans. Discover museum-quality bronze, stone, and wood sculptures that bring serenity and timeless beauty to your home.
          </motion.p>
          <motion.button 
            variants={fadeUp}
            className="btn btn-primary" 
            style={{ backgroundColor: 'white', color: 'black', padding: '16px 32px', fontSize: '1.05rem', fontFamily: 'Inter' }}
            onClick={() => navigate('/shop')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Collection
          </motion.button>
        </motion.div>
      </section>

      {/* Trust Indicators Bar */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}
        style={{ backgroundColor: '#f9f9f9', padding: '40px 0', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#444' }}>
            <Gem size={32} strokeWidth={1.5} />
            <div>
              <div style={{ fontWeight: 500, fontSize: '1.05rem', fontFamily: 'Inter' }}>Museum Quality</div>
              <div style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'Inter' }}>Authentic Materials</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#444' }}>
            <Truck size={32} strokeWidth={1.5} />
            <div>
              <div style={{ fontWeight: 500, fontSize: '1.05rem', fontFamily: 'Inter' }}>Global Insured Shipping</div>
              <div style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'Inter' }}>Safe & Secure Delivery</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#444' }}>
            <ShieldCheck size={32} strokeWidth={1.5} />
            <div>
              <div style={{ fontWeight: 500, fontSize: '1.05rem', fontFamily: 'Inter' }}>Direct from Artisans</div>
              <div style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'Inter' }}>Supporting Local Heritage</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Shop by Category Visual Grid */}
      <section style={{ padding: '80px 0' }}>
        <motion.div className="container" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
          <motion.h2 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, textAlign: 'center', marginBottom: '40px' }}>Shop by Category</motion.h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {categories.map((cat, idx) => (
              <motion.div 
                variants={fadeUp}
                key={cat.id} 
                style={{ cursor: 'pointer', textAlign: 'center' }}
                onClick={() => navigate(`/shop?category=${cat.name}`)}
                className="product-card"
              >
                <div className="image-zoom-container" style={{ aspectRatio: '1/1', backgroundColor: '#f4f4f4', borderRadius: '50%', marginBottom: '16px' }}>
                  <img src={getCategoryImage(cat.name)} alt={cat.name} className="image-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 500, fontFamily: 'Inter' }}>{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Masterpieces Grid */}
      <section style={{ padding: '80px 0', backgroundColor: '#fafafa', borderTop: '1px solid var(--color-border)' }}>
        <motion.div className="container" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
          <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter' }}>New Arrivals</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginTop: '8px' }}>Featured Masterpieces</h2>
            </div>
            <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333', textDecoration: 'none', fontWeight: 500, fontFamily: 'Inter' }}>
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>Loading featured masterpieces...</div>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* The Story Behind the Art - Split Section */}
      <section style={{ padding: '100px 0', overflow: 'hidden' }}>
        <motion.div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.div 
            style={{ flex: '1 1 400px' }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
          >
            <img src="/images/7_swan.jpg" alt="Artisan Crafting" style={{ width: '100%', height: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </motion.div>
          <motion.div 
            style={{ flex: '1 1 400px' }}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
            }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '24px', lineHeight: 1.2 }}>The Story Behind<br/>Our Masterpieces</h2>
            <p style={{ color: '#555', lineHeight: 1.8, marginBottom: '24px', fontFamily: 'Inter' }}>
              We believe that true luxury lies in authenticity. Every piece in our collection is not just manufactured; it is born from centuries of preserved heritage. Our artisans in Swamimalai, Mahabalipuram, and Rajasthan follow strict Vedic principles, often chanting mantras while carving to imbue each piece with positive spiritual energy.
            </p>
            <p style={{ color: '#555', lineHeight: 1.8, marginBottom: '40px', fontFamily: 'Inter' }}>
              When you welcome a Mannadiar Handicraft into your home, you are not just buying decor. You are adopting a piece of Indian history, supporting the livelihoods of traditional artisans, and anchoring your space with profound, grounded energy.
            </p>
            <button 
              className="btn" 
              style={{ padding: '16px 32px', fontSize: '1.05rem', border: '1px solid #333', backgroundColor: 'transparent', cursor: 'pointer', fontFamily: 'Inter' }}
              onClick={() => navigate('/about')}
            >
              Read Our Full Story
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Living Store & Heritage Gallery Showcase Section */}
      <section style={{ padding: '90px 0', backgroundColor: '#fcfcfc', borderTop: '1px solid #eee' }}>
        <motion.div className="container" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid #d4af37', padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#977218', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              <Sparkles size={13} /> Visual Archive
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, fontFamily: 'Playfair Display', margin: '0 0 12px 0' }}>
              The Living Heritage Gallery
            </h2>
            <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.6, margin: 0, fontFamily: 'Inter' }}>
              A visual journey through over 130 authentic temple bronzes, heirloom brass artifacts, and hand-carved teak panels preserved across our Kerala showrooms.
            </p>
          </motion.div>

          {/* Pinterest Masonry Uncropped Showcase */}
          <div className="pinterest-masonry" style={{ marginBottom: '40px' }}>
            {GALLERY_ITEMS.slice(0, 8).map((item, idx) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                onClick={() => navigate('/gallery')}
                className="pinterest-item"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />

                <div className="pinterest-overlay">
                  <span style={{ fontSize: '0.72rem', color: '#d4af37', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {item.category}
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, fontFamily: 'Playfair Display', margin: '2px 0 0 0', color: '#fff' }}>
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link
              to="/gallery"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                fontSize: '0.95rem',
                fontFamily: 'Inter',
                textDecoration: 'none'
              }}
            >
              <ImageIcon size={18} /> Explore Complete Gallery (130+ Artworks) <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
