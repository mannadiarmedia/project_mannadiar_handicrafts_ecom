import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Clock, Award, Star, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { logAnalyticsEvent } from '../firebase';
import { useWishlist } from '../contexts/WishlistContext';
import SEO from '../components/SEO';
import ProductReviews from '../components/ProductReviews';

// Lightbox Imports
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export default function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
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
          // Remove if already exists to put it at the front
          const filtered = stored.filter(item => item.id !== data.id);
          const updated = [{
            id: data.id,
            title: data.title,
            image: data.image,
            price: data.discounted_price || data.price
          }, ...filtered].slice(0, 5); // Keep last 5
          
          localStorage.setItem('recentlyViewed', JSON.stringify(updated));
          // For display, exclude the current product
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

  // Ensure gallery exists (fallback to just the main image)
  const gallery = product.gallery || [product.image];

  const handleThumbnailClick = (img, index) => {
    setActiveImage(img);
    setLightboxIndex(index);
  };

  const handleMainImageClick = () => {
    setLightboxOpen(true);
  };

  // Generate JSON-LD Schema for Google Shopping
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

  return (
    <>
      <SEO 
        title={product.title} 
        description={product.description.substring(0, 155)} 
        image={product.image}
        schema={productSchema}
      />
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
              <Link 
                to={`/product/${prevProduct.id}`}
                title={prevProduct.title}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#111', fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: 500 }}
              >
                <ChevronLeft size={16} /> Previous
              </Link>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ccc', fontFamily: 'Inter', fontSize: '0.9rem', cursor: 'not-allowed' }}>
                <ChevronLeft size={16} /> Previous
              </span>
            )}

            <span style={{ color: '#ddd' }}>|</span>

            {nextProduct ? (
              <Link 
                to={`/product/${nextProduct.id}`}
                title={nextProduct.title}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#111', fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: 500 }}
              >
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
                  <a 
                    href={`mailto:contact@mannadiarhandicrafts.com?subject=Inquiry: ${product.title}&body=Hello,%0D%0A%0D%0AI would like to commission a new piece or be notified when the following item is back in stock:%0D%0A%0D%0AProduct: ${product.title}%0D%0ACategory: ${product.category}%0D%0A%0D%0APlease let me know the estimated lead time and pricing.%0D%0A%0D%0AThank you.`}
                    className="btn btn-primary" 
                    style={{ flex: 1, textAlign: 'center', padding: '16px', fontSize: '1.05rem', fontFamily: 'Inter', textDecoration: 'none' }}
                  >
                    I Need This Item
                  </a>
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
              <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '16px', fontSize: '1.05rem', fontFamily: 'Inter' }}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
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

      {/* Lightbox Modal */}
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
