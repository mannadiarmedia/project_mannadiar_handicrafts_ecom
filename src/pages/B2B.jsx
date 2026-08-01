import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Briefcase, Building, Mail, Phone, IndianRupee } from 'lucide-react';

export default function B2B() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    budget: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([formData]);

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting inquiry:', error.message);
      alert('Failed to submit your inquiry. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '80px 0', minHeight: '80vh', fontFamily: 'Inter' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ fontSize: '3rem', fontWeight: 300, fontFamily: 'Playfair Display', marginBottom: '24px' }}
        >
          Trade & Corporate Gifting
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
          style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.8 }}
        >
          Mannadiar Handicrafts proudly partners with interior designers, architects, and corporate clients to provide exclusive, museum-grade masterpieces for bulk orders, corporate gifting, and bespoke interior projects.
        </motion.p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px' }}>
        
        {/* Left Side: Info */}
        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 400, fontFamily: 'Playfair Display', marginBottom: '32px' }}>Why Partner With Us?</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ color: '#d4af37' }}><Briefcase size={28} /></div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '8px' }}>Trade Discounts</h4>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem' }}>Exclusive pricing tiers available for registered interior designers and wholesale buyers based on volume.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ color: '#d4af37' }}><Building size={28} /></div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '8px' }}>Corporate Gifting</h4>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem' }}>Make a lasting impression with authentic bronze and wood handicrafts, perfectly suited for VIP client gifts and executive awards.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ color: '#d4af37' }}><IndianRupee size={28} /></div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '8px' }}>Custom Commissions</h4>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem' }}>Looking for a specific deity or a monumental size? Our master artisans can commission bespoke pieces tailored to your exact specifications.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div style={{ flex: '1 1 500px', backgroundColor: '#fafafa', padding: '40px', borderRadius: '8px', border: '1px solid #eee' }}>
          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 400, fontFamily: 'Playfair Display', marginBottom: '16px', color: '#2e7d32' }}>Inquiry Received</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>Thank you for your interest in partnering with Mannadiar Handicrafts. Our trade team will review your requirements and contact you within 24-48 business hours.</p>
            </motion.div>
          ) : (
            <>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 400, fontFamily: 'Playfair Display', marginBottom: '24px' }}>Request a Consultation</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Full Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Company / Firm</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Email Address *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Phone Number *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Estimated Budget / Quantity</label>
                  <select name="budget" value={formData.budget} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter', backgroundColor: '#fff' }}>
                    <option value="">Select an option</option>
                    <option value="Below ₹1 Lakh">Below ₹1 Lakh</option>
                    <option value="₹1 Lakh - ₹5 Lakhs">₹1 Lakh - ₹5 Lakhs</option>
                    <option value="₹5 Lakhs - ₹25 Lakhs">₹5 Lakhs - ₹25 Lakhs</option>
                    <option value="Above ₹25 Lakhs">Above ₹25 Lakhs</option>
                    <option value="Just inquiring">Just inquiring</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Project Requirements *</label>
                  <textarea name="requirements" required value={formData.requirements} onChange={handleChange} rows="4" placeholder="Tell us about your project, timeline, and specific items of interest..." style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter', resize: 'vertical' }}></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem', marginTop: '8px' }}>
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
