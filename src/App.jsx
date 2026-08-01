import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { ShoppingCart, Menu, X, ArrowRight, Search, Heart, User, ClipboardList } from 'lucide-react';
import SearchModal from './components/SearchModal';
import WishlistDrawer from './components/WishlistDrawer';
import AnalyticsTracker from './components/AnalyticsTracker';
import { logAnalyticsEvent } from './firebase';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import StaticPage from './pages/StaticPage';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Gallery from './pages/Gallery';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminCategories from './pages/admin/AdminCategories';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInquiries from './pages/admin/AdminInquiries';

// Auth Context & Pages
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WishlistProvider, useWishlist } from './contexts/WishlistContext';
import { EnquiryProvider, useEnquiry } from './contexts/EnquiryContext';
import EnquiryDrawer from './components/EnquiryDrawer';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import B2B from './pages/B2B';

import './index.css';

function StorefrontLayout({ cartOpen, setCartOpen, cart, setCart, mobileMenuOpen, setMobileMenuOpen, removeFromCart, cartTotal, searchOpen, setSearchOpen, wishlistOpen, setWishlistOpen }) {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const { enquiryItems, setIsEnquiryOpen } = useEnquiry();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Announcement Bar */}
      <div style={{ backgroundColor: '#111', color: '#fff', textAlign: 'center', padding: '10px 16px', fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        100% Authentic Handcrafted Masterpieces | Worldwide Shipping Available
      </div>

      {/* Navbar */}
      <nav style={{ padding: '20px 0', borderBottom: '1px solid #eae5d9', position: 'sticky', top: 0, backgroundColor: '#f9f6f0', zIndex: 40 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* LEFT: Menu, Logo, Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              style={{ 
                width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#fff', 
                border: '1px solid #eae5d9', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
              }}
            >
              <Menu size={20} color="#333" />
            </button>
            
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/images/logo.png" alt="Mannadiar Logo" style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '50%' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 500, fontFamily: 'Playfair Display', lineHeight: 1.1 }}>Mannadiar</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 500, fontFamily: 'Playfair Display', lineHeight: 1.1 }}>Handicrafts</span>
              </div>
            </Link>

            <div className="desktop-only" style={{ width: '1px', height: '32px', backgroundColor: '#e2dcca', margin: '0 8px' }}></div>

            <Link to="/shop" className="desktop-only" style={{ textDecoration: 'none', color: '#333', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              ALL PRODUCTS
            </Link>
            <Link to="/gallery" className="desktop-only" style={{ textDecoration: 'none', color: '#333', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              GALLERY
            </Link>
          </div>
          
          {/* CENTER: Search Bar */}
          <div className="desktop-only" style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 24px' }}>
            <button 
              onClick={() => setSearchOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', maxWidth: '280px',
                background: '#fff', border: '1px solid #eae5d9', borderRadius: '30px',
                padding: '10px 16px', cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888' }}>
                <Search size={16} />
                <span style={{ fontSize: '0.85rem', fontFamily: 'Inter' }}>Search</span>
              </div>
              <kbd style={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', fontSize: '0.65rem', color: '#666', fontFamily: 'monospace' }}>⌘K</kbd>
            </button>
          </div>

          {/* RIGHT: Wishlist, Login, Enquiry, Cart */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            
            {/* Pill Container for Wishlist, Enquiry & Login */}
            <div className="desktop-only" style={{ 
              display: 'flex', alignItems: 'center', 
              background: '#fff', border: '1px solid #eae5d9', borderRadius: '30px', 
              padding: '8px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', gap: '20px' 
            }}>
              <div 
                onClick={() => setWishlistOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#333' }}
              >
                <Heart size={16} color={wishlistCount > 0 ? "#e53e3e" : "currentColor"} fill={wishlistCount > 0 ? "#e53e3e" : "transparent"} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>WISHLIST ({wishlistCount})</span>
              </div>

              <div style={{ width: '1px', height: '16px', backgroundColor: '#eae5d9' }}></div>

              <div 
                onClick={() => setIsEnquiryOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#333' }}
              >
                <ClipboardList size={16} color={enquiryItems.length > 0 ? "#2e7d32" : "currentColor"} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>QUOTE ({enquiryItems.length})</span>
              </div>
              
              <div style={{ width: '1px', height: '16px', backgroundColor: '#eae5d9' }}></div>

              <Link to={user ? "/profile" : "/auth"} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textDecoration: 'none', color: '#333' }}>
                <User size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>{user ? 'ACCOUNT' : 'LOGIN'}</span>
              </Link>
            </div>

            {/* Distinct Cart Button */}
            <button 
              onClick={() => setCartOpen(true)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                backgroundColor: '#dec9aa', border: 'none', borderRadius: '30px',
                padding: '12px 24px', color: '#222', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease, background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4be9d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dec9aa'}
            >
              <ShoppingCart size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>CART ({cart.length})</span>
            </button>
            
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{ width: '80%', maxWidth: '300px', height: '100%', backgroundColor: 'var(--color-bg)', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Menu</h2>
              <X size={24} style={{ cursor: 'pointer' }} onClick={() => setMobileMenuOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.1rem' }}>
              <button 
                onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', textAlign: 'left', fontSize: '1.1rem', cursor: 'pointer', padding: 0 }}
              >
                <Search size={18} /> Search Masterpieces
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); setWishlistOpen(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', textAlign: 'left', fontSize: '1.1rem', cursor: 'pointer', padding: 0 }}
              >
                <Heart size={18} color="#e53e3e" fill="#e53e3e" /> Saved Wishlist ({wishlistCount})
              </button>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Shop Collection</Link>
              <Link to="/gallery" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Heritage Gallery (130+)</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Our Heritage</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
            </div>
          </div>
        </div>
      )}

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Mega Footer */}
      <footer style={{ backgroundColor: '#fafafa', paddingTop: '80px', paddingBottom: '40px', position: 'relative' }}>
        <div className="container">
          {/* Top Split Section */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px', marginBottom: '60px' }}>
            <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <img src="/images/logo.png" alt="Mannadiar Logo" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                <h2 style={{ fontSize: '2rem', fontWeight: 400, fontFamily: 'Playfair Display', margin: 0, lineHeight: 1.1 }}>
                  Mannadiar<br/>Handicrafts
                </h2>
              </div>
              <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '24px', fontSize: '0.95rem' }}>
                Welcome to our world of artistic luxury, and enjoy your time discovering beautiful things at Mannadiar Handicrafts. Each ornate piece that comes of Mannadiar Handicrafts has been carved under the spell of vedic chants in order to have the best energies reach the user.
              </p>
              <div style={{ display: 'flex', gap: '16px', color: '#333' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </div>
            </div>
            <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '24px' }}>Subscribe to Our Newsletter</h3>
              <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '40px', overflow: 'hidden', backgroundColor: '#fff', padding: '4px' }}>
                <input type="email" placeholder="Email address" style={{ flex: 1, border: 'none', padding: '12px 24px', outline: 'none', fontSize: '1rem' }} />
                <button style={{ background: 'none', border: 'none', padding: '0 24px', cursor: 'pointer' }}>
                  <ArrowRight size={20} color="#333" />
                </button>
              </div>
            </div>
          </div>

          {/* Middle 4 Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', borderTop: '1px solid var(--color-border)', paddingTop: '60px', marginBottom: '40px' }}>
            <div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px' }}>Our Products</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#555', fontSize: '0.95rem' }}>
                <Link to="/shop?category=Brass" style={{ textDecoration: 'none', color: 'inherit' }}>Brass Collection</Link>
                <Link to="/shop?category=Bronze" style={{ textDecoration: 'none', color: 'inherit' }}>Bronze Idols</Link>
                <Link to="/shop?category=Wood" style={{ textDecoration: 'none', color: 'inherit' }}>Wood Carvings</Link>
                <Link to="/shop?category=Stone" style={{ textDecoration: 'none', color: 'inherit' }}>Stone Sculptures</Link>
                <Link to="/shop?category=Paintings" style={{ textDecoration: 'none', color: 'inherit' }}>Paintings</Link>
                <Link to="/gallery" style={{ textDecoration: 'none', color: '#d4af37', fontWeight: 600 }}>Showroom Gallery (130+)</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px' }}>Our Library</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#555', fontSize: '0.95rem' }}>
                <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Vastu</Link>
                <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Science and Sculptures</Link>
                <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Psychology of Sculptures</Link>
                <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Direction and Effects</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px' }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#555', fontSize: '0.95rem' }}>
                <Link to="/contact-information" style={{ textDecoration: 'none', color: 'inherit' }}>Contact Information</Link>
                <Link to="/privacy-policy" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy Policy</Link>
                <Link to="/refund-policy" style={{ textDecoration: 'none', color: 'inherit' }}>Refund Policy</Link>
                <Link to="/shipping-policy" style={{ textDecoration: 'none', color: 'inherit' }}>Shipping Policy</Link>
                <Link to="/terms-of-service" style={{ textDecoration: 'none', color: 'inherit' }}>Terms of Service</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px' }}>Main</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#555', fontSize: '0.95rem' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link>
                <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Our Products</Link>
                <Link to="/corporate-gifting" style={{ textDecoration: 'none', color: 'inherit' }}>Trade & Wholesale</Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', color: '#888', fontSize: '0.85rem' }}>
            <div>Ac 2026 Mannadiar Handicrafts</div>
            <div>Terms and Policies</div>
          </div>
        </div>
        
        {/* Floating WhatsApp Icon */}
        <a href="https://wa.me/919846109990?text=Hello%20Mannadiar%20Handicrafts!%20I%20am%20interested%20in%20your%20collection." target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999, transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
           <img src="/images/whatsapp_icon.png" alt="WhatsApp Chat" style={{ width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
        </a>
      </footer>

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }}
            onClick={() => setCartOpen(false)}
          />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px', backgroundColor: 'var(--color-bg)', zIndex: 60, padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 500 }}>Your Cart ({cart.length})</h2>
              <X size={24} style={{ cursor: 'pointer' }} onClick={() => setCartOpen(false)} />
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: '16px' }}>

              {cart.length === 0 ? (
                <div style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>Your cart is empty.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '80px', height: '80px', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                         <img src={item.image} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt={item.title} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px' }}>{item.title}</h4>
                        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>₹{item.price.toLocaleString('en-IN')}</div>
                        <button 
                          style={{ fontSize: '0.75rem', color: '#666', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                          onClick={() => removeFromCart(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px', marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.1rem', fontWeight: 500 }}>
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <Link to="/checkout" onClick={() => setCartOpen(false)} style={{ textDecoration: 'none' }}>
                <button className="btn btn-primary" style={{ width: '100%' }} disabled={cart.length === 0}>
                  Checkout Securely
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Global Ctrl+K / Cmd+K shortcut
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setCartOpen(true);
    logAnalyticsEvent('add_to_cart', {
      currency: 'INR',
      value: product.discounted_price || product.price,
      items: [{
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
        price: product.discounted_price || product.price,
        quantity: 1
      }]
    });
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, idx) => idx !== indexToRemove));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.discounted_price || item.price), 0);

  return (
    <AuthProvider>
      <WishlistProvider>
        <EnquiryProvider>
          <Router>
            <AnalyticsTracker />
            <Routes>
              {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminAddProduct />} />
              <Route path="products/edit/:id" element={<AdminEditProduct />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="*" element={<div>Admin Route Not Found</div>} />
            </Route>

            {/* Storefront Routes */}
            <Route element={<StorefrontLayout cartOpen={cartOpen} setCartOpen={setCartOpen} cart={cart} setCart={setCart} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} removeFromCart={removeFromCart} cartTotal={cartTotal} searchOpen={searchOpen} setSearchOpen={setSearchOpen} wishlistOpen={wishlistOpen} setWishlistOpen={setWishlistOpen} />}>
              <Route path="/" element={<Home addToCart={addToCart} />} />
              <Route path="/shop" element={<Shop addToCart={addToCart} />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
              <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} cartTotal={cartTotal} />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/shipping-policy" element={<StaticPage title="Shipping Policy" />} />
              <Route path="/privacy-policy" element={<StaticPage title="Privacy Policy" />} />
              <Route path="/refund-policy" element={<StaticPage title="Refund Policy" />} />
              <Route path="/terms-of-service" element={<StaticPage title="Terms of Service" />} />
              <Route path="/contact-information" element={<Contact />} />
              <Route path="/corporate-gifting" element={<B2B />} />
              <Route path="*" element={<div>Page Not Found</div>} />
            </Route>
            </Routes>
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} addToCart={addToCart} />
            <EnquiryDrawer />
          </Router>
        </EnquiryProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;

