import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ClipboardList, Send } from 'lucide-react';
import { useEnquiry } from '../contexts/EnquiryContext';
import { supabase } from '../supabaseClient';

export default function EnquiryDrawer() {
  const { isEnquiryOpen, setIsEnquiryOpen, enquiryItems, removeFromEnquiry, clearEnquiry } = useEnquiry();
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([{ 
          ...formData,
          budget: 'Enquiry Cart',
          products: JSON.stringify(enquiryItems.map(item => ({ id: item.id, title: item.title, sku: item.sku })))
        }]);

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        clearEnquiry();
        setIsEnquiryOpen(false);
        setFormData({ name: '', company: '', email: '', phone: '', requirements: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting enquiry:', error.message);
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isEnquiryOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsEnquiryOpen(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '450px', backgroundColor: '#fff', zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 30px rgba(0,0,0,0.1)' }}
          >
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 400, fontFamily: 'Playfair Display', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={20} /> Request Quote
              </h2>
              <button onClick={() => setIsEnquiryOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={24} color="#666" />
              </button>
            </div>

            {/* Content Container */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {enquiryItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
                  <ClipboardList size={48} color="#ccc" style={{ marginBottom: '16px' }} />
                  <p style={{ fontFamily: 'Inter' }}>Your enquiry list is empty.</p>
                  <button 
                    onClick={() => setIsEnquiryOpen(false)}
                    style={{ marginTop: '24px', padding: '12px 24px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer' }}
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : success ? (
                <div style={{ textAlign: 'center', color: '#2e7d32', marginTop: '40px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display', marginBottom: '16px' }}>Request Sent!</h3>
                  <p style={{ fontFamily: 'Inter', lineHeight: 1.6 }}>Thank you for your interest. Our trade team will review your requested items and contact you shortly with pricing and availability.</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: '16px' }}>Selected Items ({enquiryItems.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {enquiryItems.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '16px', backgroundColor: '#fafafa', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                          <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 500, fontFamily: 'Playfair Display', marginBottom: '4px' }}>{item.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'Inter' }}>SKU: {item.sku || 'N/A'}</div>
                          </div>
                          <button onClick={() => removeFromEnquiry(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', padding: '4px' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #eee', paddingTop: '32px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 400, fontFamily: 'Playfair Display', marginBottom: '24px' }}>Contact Details</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Full Name *" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
                      <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company / Firm (Optional)" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email *" style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Phone *" style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
                      </div>
                      <textarea name="requirements" required value={formData.requirements} onChange={handleChange} rows="3" placeholder="Additional requirements or questions... *" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter', resize: 'vertical' }}></textarea>
                      
                      <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1.05rem', fontFamily: 'Inter', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                        {loading ? 'Submitting...' : <><Send size={18} /> Request Custom Quote</>}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
