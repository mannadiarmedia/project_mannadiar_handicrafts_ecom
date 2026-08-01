import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useWindowSize from '../hooks/useWindowSize';

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

// ==========================================
// MOBILE ABOUT VIEW
// ==========================================
function MobileAboutView() {
  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '60px 20px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} style={{ fontSize: '2.2rem', fontWeight: 300, marginBottom: '16px', fontFamily: 'Playfair Display' }}>
          Our Heritage
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} style={{ fontSize: '1rem', color: '#555', fontFamily: 'Inter', lineHeight: 1.6 }}>
          Mannadiar Handicrafts was born from a desire to preserve the sacred, ancient arts of India. We are more than curators; we are custodians of history.
        </motion.p>
      </section>

      {/* The Journey Section (Stacked) */}
      <section style={{ padding: '40px 20px' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp}>
          <img src="/images/2_nataraja.jpg" alt="Chola Bronze Casting" style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '24px' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '16px', fontFamily: 'Playfair Display' }}>The Legacy of Swamimalai</h2>
          <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '16px', fontFamily: 'Inter', fontSize: '0.95rem' }}>
            Our bronze collection originates from Swamimalai, the historical heart of Chola bronze casting. The artisans here trace their lineage directly back to the master craftsmen who built the great Brihadeeswarar Temple in Thanjavur over a thousand years ago.
          </p>
          <p style={{ color: '#555', lineHeight: 1.6, fontFamily: 'Inter', fontSize: '0.95rem' }}>
            Using the ancient 'Madhuchishtavidhana' (lost-wax) method, every sculpture is uniquely crafted. Once the molten panchaloha (five-metal alloy) is poured into the mold, the original wax model is destroyed forever—ensuring that every single piece we offer is a one-of-a-kind masterpiece.
          </p>
        </motion.div>
      </section>

      {/* Pillars Section */}
      <section style={{ backgroundColor: '#111', color: 'white', padding: '60px 20px' }}>
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, textAlign: 'center', marginBottom: '40px', fontFamily: 'Playfair Display' }}>
          The Pillars of Our Craft
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '8px', fontFamily: 'Inter' }}>Vedic Purity</h3>
            <p style={{ color: '#aaa', lineHeight: 1.6, fontFamily: 'Inter', fontSize: '0.9rem' }}>Crafted according to the precise geometric and metallurgical rules laid out in the Shilpa Shastras.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '8px', fontFamily: 'Inter' }}>Ethical Sourcing</h3>
            <p style={{ color: '#aaa', lineHeight: 1.6, fontFamily: 'Inter', fontSize: '0.9rem' }}>We partner directly with master artisans, bypassing middlemen to ensure fair, life-changing compensation.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '8px', fontFamily: 'Inter' }}>Spiritual Resonance</h3>
            <p style={{ color: '#aaa', lineHeight: 1.6, fontFamily: 'Inter', fontSize: '0.9rem' }}>Our pieces are often crafted to the sound of Vedic chants, imbuing the metal and stone with profound positive energy.</p>
          </motion.div>
        </div>
      </section>

      {/* Artisan Spotlight (Stacked) */}
      <section style={{ padding: '40px 20px' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp}>
          <img src="/images/4_buddha.jpg" alt="Stone Carving" style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '24px' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '16px', fontFamily: 'Playfair Display' }}>Master Sculptors of Mahabalipuram</h2>
          <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '16px', fontFamily: 'Inter', fontSize: '0.95rem' }}>
            Working with incredibly dense blocks of black granite and soapstone requires unimaginable patience and precision. Our stone artisans in Mahabalipuram learn their craft over decades. There is no room for error in stone—one misplaced strike of the chisel can ruin months of labor.
          </p>
          <p style={{ color: '#555', lineHeight: 1.6, fontFamily: 'Inter', fontSize: '0.95rem' }}>
            When you purchase a stone idol from Mannadiar Handicrafts, you are acquiring a monolithic symbol of absolute devotion and focus.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

// ==========================================
// DESKTOP ABOUT VIEW
// ==========================================
function DesktopAboutView() {
  return (
    <>
      {/* Hero Section */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '100px 0', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <motion.div className="container" initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.h1 variants={fadeUp} style={{ fontSize: '4rem', fontWeight: 300, marginBottom: '24px', fontFamily: 'Playfair Display' }}>
            Our Heritage
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: '1.2rem', color: '#555', maxWidth: '700px', margin: '0 auto', fontFamily: 'Inter', lineHeight: 1.8 }}>
            Mannadiar Handicrafts was born from a desire to preserve the sacred, ancient arts of India. We are more than curators; we are custodians of history.
          </motion.p>
        </motion.div>
      </section>

      {/* The Journey Split Section */}
      <section style={{ padding: '100px 0' }}>
        <motion.div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.div style={{ flex: '1 1 400px' }} variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}>
            <img src="/images/2_nataraja.jpg" alt="Chola Bronze Casting" style={{ width: '100%', height: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </motion.div>
          <motion.div style={{ flex: '1 1 400px' }} variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } } }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 300, marginBottom: '24px', fontFamily: 'Playfair Display' }}>The Legacy of Swamimalai</h2>
            <p style={{ color: '#555', lineHeight: 1.8, marginBottom: '24px', fontFamily: 'Inter' }}>
              Our bronze collection originates from Swamimalai, the historical heart of Chola bronze casting. The artisans here trace their lineage directly back to the master craftsmen who built the great Brihadeeswarar Temple in Thanjavur over a thousand years ago.
            </p>
            <p style={{ color: '#555', lineHeight: 1.8, fontFamily: 'Inter' }}>
              Using the ancient 'Madhuchishtavidhana' (lost-wax) method, every sculpture is uniquely crafted. Once the molten panchaloha (five-metal alloy) is poured into the mold, the original wax model is destroyed forever—ensuring that every single piece we offer is a one-of-a-kind masterpiece.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* The Pillars of Authenticity */}
      <section style={{ backgroundColor: '#111', color: 'white', padding: '100px 0' }}>
        <motion.div className="container" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
          <motion.h2 variants={fadeUp} style={{ fontSize: '2.5rem', fontWeight: 300, textAlign: 'center', marginBottom: '60px', fontFamily: 'Playfair Display' }}>
            The Pillars of Our Craft
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center' }}>
            <motion.div variants={fadeUp}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '16px', fontFamily: 'Inter' }}>Vedic Purity</h3>
              <p style={{ color: '#aaa', lineHeight: 1.6, fontFamily: 'Inter' }}>Crafted according to the precise geometric and metallurgical rules laid out in the Shilpa Shastras.</p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '16px', fontFamily: 'Inter' }}>Ethical Sourcing</h3>
              <p style={{ color: '#aaa', lineHeight: 1.6, fontFamily: 'Inter' }}>We partner directly with master artisans, bypassing middlemen to ensure fair, life-changing compensation.</p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '16px', fontFamily: 'Inter' }}>Spiritual Resonance</h3>
              <p style={{ color: '#aaa', lineHeight: 1.6, fontFamily: 'Inter' }}>Our pieces are often crafted to the sound of Vedic chants, imbuing the metal and stone with profound positive energy.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Artisan Spotlight */}
      <section style={{ padding: '100px 0' }}>
        <motion.div className="container" style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '60px' }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.div style={{ flex: '1 1 400px' }} variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } } }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 300, marginBottom: '24px', fontFamily: 'Playfair Display' }}>Master Sculptors of Mahabalipuram</h2>
            <p style={{ color: '#555', lineHeight: 1.8, marginBottom: '24px', fontFamily: 'Inter' }}>
              Working with incredibly dense blocks of black granite and soapstone requires unimaginable patience and precision. Our stone artisans in Mahabalipuram learn their craft over decades. There is no room for error in stone—one misplaced strike of the chisel can ruin months of labor.
            </p>
            <p style={{ color: '#555', lineHeight: 1.8, fontFamily: 'Inter' }}>
              When you purchase a stone idol from Mannadiar Handicrafts, you are acquiring a monolithic symbol of absolute devotion and focus.
            </p>
          </motion.div>
          <motion.div style={{ flex: '1 1 400px' }} variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}>
            <img src="/images/4_buddha.jpg" alt="Stone Carving" style={{ width: '100%', height: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

export default function About() {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return isMobile ? <MobileAboutView /> : <DesktopAboutView />;
}
