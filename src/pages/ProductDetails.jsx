import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Clock, Award, Star, ChevronLeft, ChevronRight, Heart, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { logAnalyticsEvent } from '../firebase';
import { useWishlist } from '../contexts/WishlistContext';
import { useEnquiry } from '../contexts/EnquiryContext';
import SEO from '../components/SEO';
import ProductReviews from '../components/ProductReviews';
import useWindowSize from '../hooks/useWindowSize';

// Lightbox Imports
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

// ==========================================
// MOBILE PRODUCT DETAILS VIEW
// ==========================================
function MobileProductDetailsView({
  product, gallery, activeImage, handleThumbnailClick, handleMainImageClick,
  prevProduct, nextProduct, recentlyViewed,
  addToCart, toggleWishlist, isInWishlist, addToEnquiry, navigate
}) {
  return (
    <div style={{ paddingBottom: '100px' }}> {/* Extra padding for sticky footer */}
      {/* Top Nav */}
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#444' }}>
          <ArrowLeft size={20} /> <span style={{ fontFamily: 'Inter', fontWeight: 500 }}>Shop</span>
        </button>
      </div>

      {/* Main Image */}
      <div 
        onClick={handleMainImageClick}
        style={{ width: '100%', height: '350px', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
      >
        <img src={activeImage} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>

      {/* Thumbnails (Horizontal Scroll) */}
      {gallery.length > 1 && (
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '12px', padding: '16px', overflowX: 'auto', borderBottom: '1px solid #eee' }}>
          {gallery.map((img, idx) => (
            <div 
              key={idx} onClick={() => handleThumbnailClick(img, idx)}
              style={{ 
                width: '60px', height: '60px', flexShrink: 0, 
                border: activeImage === img ? '2px solid #111' : '1px solid #ddd',
                borderRadius: '8px', padding: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}
            >
              <img src={img} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      )}

      {/* Product Info */}
      <div style={{ padding: '24px 16px' }}>
        <div style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter' }}>
          {product.category} Masterpiece
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '12px', lineHeight: 1.2, fontFamily: 'Playfair Display' }}>
          {product.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', color: '#d4af37' }}>
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
          </div>
        </div>

        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {product.discounted_price ? (
            <>
              <span style={{ fontSize: '1.75rem', fontWeight: 600, color: '#d4af37' }}>₹{product.discounted_price.toLocaleString('en-IN')}</span>
              <span style={{ fontSize: '1.1rem', color: '#999', textDecoration: 'line-through' }}>₹{product.price.toLocaleString('en-IN')}</span>
            </>
          ) : (
            <span style={{ fontSize: '1.75rem', fontWeight: 600 }}>₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>

        <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px', fontFamily: 'Inter' }}>
          {product.description}
        </p>

        {/* Details Accordions style (just stacked for now) */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Playfair Display' }}><Award size={18} /> The Story</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>{product.story}</p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Playfair Display' }}><ShieldCheck size={18} /> Craftsmanship</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>{product.craftsmanship}</p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Playfair Display' }}><Clock size={18} /> Specifications</h3>
          <ul style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
            {product.material && <li><strong>Material:</strong> {product.material}</li>}
            {product.height && <li><strong>Dimensions:</strong> {product.height}x{product.width}x{product.length} in</li>}
            {product.weight && <li><strong>Weight:</strong> {product.weight} kg</li>}
          </ul>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <ProductReviews product={product} />
      </div>

      {/* Sticky Bottom Action Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: '16px', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '12px', zIndex: 100 }}>
        {product.out_of_stock ? (
          <button onClick={() => addToEnquiry(product)} className="btn btn-primary" style={{ flex: 1, padding: '14px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ClipboardList size={18} /> Request Restock
          </button>
        ) : (
          <>
            <button onClick={() => addToCart(product)} className="btn btn-primary" style={{ flex: 1, padding: '14px', fontSize: '1rem', fontWeight: 500 }}>
              Add to Cart
            </button>
            <button onClick={() => addToEnquiry(product)} className="btn btn-outline" style={{ padding: '14px', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={20} />
            </button>
          </>
        )}
        <button onClick={() => toggleWishlist(product)} className="btn btn-outline" style={{ padding: '14px', flex: '0 0 auto', borderColor: isInWishlist(product.id) ? '#e53e3e' : '#ccc' }}>
          <Heart size={20} color={isInWishlist(product.id) ? "#e53e3e" : "currentColor"} fill={isInWishlist(product.id) ? "#e53e3e" : "transparent"} />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// DESKTOP PRODUCT DETAILS VIEW
// ==========================================
function DesktopProductDetailsView({
  product, gallery, activeImage, handleThumbnailClick, handleMainImageClick,
  prevProduct, nextProduct, recentlyViewed,
  addToCart, toggleWishlist, isInWishlist, addToEnquiry, navigate
}) {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/shop')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', color: '#666', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Collection
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {prevProduct ? (
            <Link to={`/product/${prevProduct.id}`} title={prevProduct.title} style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#111', fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: 500 }}>
              <ChevronLeft size={16} /> Previous
            </Link>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ccc', fontFamily: 'Inter', fontSize: '0.9rem', cursor: 'not-allowed' }}>
              <ChevronLeft size={16} /> Previous
            </span>
          )}

          <span style={{ color: '#ddd' }}>|</span>

          {nextProduct ? (
            <Link to={`/product/${nextProduct.id}`} title={nextProduct.title} style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#111', fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: 500 }}>
              Next <ChevronRight size={16} />
            </Link>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ccc', fontFamily: 'Inter', fontSize: '0.9rem', cursor: 'not-allowed' }}>
              Next <ChevronRight size={16} />
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px' }}>
        
        {/* Left Column - Gallery */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ position: 'sticky', top: '120px' }}>
            
            {/* Main Active Image */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              style={{ backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', borderRadius: '8px', cursor: 'zoom-in', border: '1px solid #eee' }}
              onClick={handleMainImageClick}
            >
              <img src={activeImage} alt={product.title} style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain' }} />
            </motion.div>

            {/* Thumbnail Row */}
            {gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                {gallery.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleThumbnailClick(img, idx)}
                    style={{ 
                      width: '80px', height: '80px', flexShrink: 0, 
                      backgroundColor: '#f9f9f9', borderRadius: '4px', cursor: 'pointer',
                      border: activeImage === img ? '2px solid #111' : '1px solid #ddd',
                      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', fontSize: '0.85rem', marginBottom: '16px', fontFamily: 'Inter' }}>
            {product.category} Masterpiece
          </div>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '16px', lineHeight: 1.2, fontFamily: 'Playfair Display' }}>
            {product.title}
          </h1>
          
          {product.sku && (
            <div style={{ fontSize: '0.9rem', color: '#666', fontFamily: 'Inter', marginBottom: '16px', fontWeight: 500 }}>
              Product Code: <span style={{ color: '#111' }}>{product.sku}</span>
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', color: '#d4af37' }}>
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <span style={{ fontSize: '0.9rem', color: '#666', fontFamily: 'Inter' }}>(Museum Grade)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            {product.discounted_price ? (
              <>
                <span style={{ fontSize: '2rem', fontWeight: 500, fontFamily: 'Inter', color: '#d4af37' }}>
                  ₹{product.discounted_price.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '1.25rem', color: '#999', textDecoration: 'line-through', fontFamily: 'Inter' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span style={{ backgroundColor: '#d4af37', color: '#fff', fontSize: '0.8rem', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.05em', fontFamily: 'Inter' }}>
                  SALE
                </span>
              </>
            ) : (
              <span style={{ fontSize: '2rem', fontWeight: 500, fontFamily: 'Inter' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '40px', fontFamily: 'Inter' }}>
            {product.description}
          </p>

          {product.out_of_stock ? (
            <div>
              <div style={{ backgroundColor: '#fff3f3', border: '1px solid #ffcaca', color: '#d32f2f', padding: '16px', borderRadius: '4px', marginBottom: '24px', fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong>Currently Sold Out</strong>
                <span>|</span>
                <span>Handcrafted upon request.</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                <button 
                  onClick={() => addToEnquiry(product)}
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '16px', fontSize: '1.05rem', fontFamily: 'Inter', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <ClipboardList size={20} /> Request Restock Quote
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 20px', borderColor: isInWishlist(product.id) ? '#e53e3e' : '#ccc', color: isInWishlist(product.id) ? '#e53e3e' : 'inherit' }}
                  title={isInWishlist(product.id) ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart size={20} color={isInWishlist(product.id) ? "#e53e3e" : "currentColor"} fill={isInWishlist(product.id) ? "#e53e3e" : "transparent"} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '16px', fontSize: '1.05rem', fontFamily: 'Inter' }}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <button
                onClick={() => addToEnquiry(product)}
                className="btn btn-outline"
                style={{ flex: 1, padding: '16px', fontSize: '1.05rem', fontFamily: 'Inter', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ClipboardList size={20} /> Add to Quote
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 20px', borderColor: isInWishlist(product.id) ? '#e53e3e' : '#ccc', color: isInWishlist(product.id) ? '#e53e3e' : 'inherit' }}
                title={isInWishlist(product.id) ? "Remove from Wishlist" : "Save to Wishlist"}
              >
                <Heart size={20} color={isInWishlist(product.id) ? "#e53e3e" : "currentColor"} fill={isInWishlist(product.id) ? "#e53e3e" : "transparent"} />
              </button>
            </div>
          )}

          {/* Accordion / Details Section */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
            
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Playfair Display' }}>
                <Award size={20} /> The Story
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', fontFamily: 'Inter' }}>{product.story}</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Playfair Display' }}>
                <ShieldCheck size={20} /> Craftsmanship
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', fontFamily: 'Inter' }}>{product.craftsmanship}</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Playfair Display' }}>
                <Clock size={20} /> Specifications
              </h3>
              <ul style={{ color: '#666', lineHeight: 1.8, fontSize: '0.95rem', paddingLeft: '20px', fontFamily: 'Inter' }}>
                {product.material && <li><strong>Material:</strong> {product.material}</li>}
                {product.height && <li><strong>Height:</strong> {product.height} in</li>}
                {product.width && <li><strong>Width:</strong> {product.width} in</li>}
                {product.length && <li><strong>Length:</strong> {product.length} in</li>}
                {product.dia && <li><strong>Diameter:</strong> {product.dia} in</li>}
                {product.dimensions && <li><strong>Dimensions:</strong> {product.dimensions}</li>}
                {product.weight && <li><strong>Weight:</strong> {product.weight} kg</li>}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Interactive Customer Reviews & Ratings */}
      <ProductReviews product={product} />

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div style={{ marginTop: '100px', borderTop: '1px solid #eee', paddingTop: '60px' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 300, fontFamily: 'Playfair Display', textAlign: 'center', marginBottom: '40px' }}>
            Recently Viewed Masterpieces
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
            {recentlyViewed.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div whileHover={{ y: -5 }} style={{ transition: 'all 0.3s' }}>
                  <div style={{ backgroundColor: '#f9f9f9', padding: '24px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
                    <img src={item.image} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '8px', fontFamily: 'Inter' }}>{item.title}</h4>
                  <div style={{ fontSize: '1.1rem', color: '#111', fontWeight: 600, fontFamily: 'Inter' }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// MAIN EXPORT
// ==========================================
export default function ProductDetails({ addToCart }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToEnquiry } = useEnquiry();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for image gallery and lightbox
  const [activeImage, setActiveImage] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // State for prev / next navigation
  const [prevProduct, setPrevProduct] = useState(null);
  const [nextProduct, setNextProduct] = useState(null);

  // State for recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const [currentRes, allRes] = await Promise.all([
          supabase.from('products').select('*').eq('id', id).single(),
          supabase.from('products').select('id, title').order('created_at', { ascending: false })
        ]);
          
        if (currentRes.error) throw currentRes.error;
        const data = currentRes.data;
        setProduct(data);
        setActiveImage(data.image);

        // Log e-commerce view_item event
        logAnalyticsEvent('view_item', {
          currency: 'INR',
          value: data.discounted_price || data.price,
          items: [{
            item_id: data.id,
            item_name: data.title,
            item_category: data.category,
            price: data.discounted_price || data.price
          }]
        });

        // Find prev / next products
        if (allRes.data && allRes.data.length > 0) {
          const currentIndex = allRes.data.findIndex(p => p.id === data.id);
          if (currentIndex > 0) {
            setPrevProduct(allRes.data[currentIndex - 1]);
          } else {
            setPrevProduct(null);
          }

          if (currentIndex >= 0 && currentIndex < allRes.data.length - 1) {
            setNextProduct(allRes.data[currentIndex + 1]);
          } else {
            setNextProduct(null);
          }
        }

        // Update recently viewed
        try {
          const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
          const filtered = stored.filter(item => item.id !== data.id);
          const updated = [{
            id: data.id,
            title: data.title,
            image: data.image,
            price: data.discounted_price || data.price
          }, ...filtered].slice(0, 5);
          
          localStorage.setItem('recentlyViewed', JSON.stringify(updated));
          setRecentlyViewed(updated.filter(item => item.id !== data.id));
        } catch (e) {
          console.error("Local storage error", e);
        }

      } catch (error) {
        console.error('Error fetching product:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading product details...</div>;
  if (!product) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Product not found.</div>;

  const gallery = product.gallery || [product.image];

  const handleThumbnailClick = (img, index) => {
    setActiveImage(img);
    setLightboxIndex(index);
  };

  const handleMainImageClick = () => {
    setLightboxOpen(true);
  };

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.image,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Mannadiar Handicrafts"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.discounted_price || product.price,
      "availability": product.out_of_stock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  const props = {
    product, gallery, activeImage, handleThumbnailClick, handleMainImageClick,
    prevProduct, nextProduct, recentlyViewed,
    addToCart, toggleWishlist, isInWishlist, addToEnquiry, navigate
  };

  return (
    <>
      <SEO 
        title={product.title} 
        description={product.description.substring(0, 155)} 
        image={product.image}
        schema={productSchema}
      />
      {isMobile ? <MobileProductDetailsView {...props} /> : <DesktopProductDetailsView {...props} />}

      {/* Lightbox Modal (Shared) */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={gallery.map(src => ({ src }))}
        plugins={[Zoom]}
        carousel={{ finite: gallery.length <= 1 }}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </>
  );
}
