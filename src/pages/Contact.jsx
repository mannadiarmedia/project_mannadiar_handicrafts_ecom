import React from 'react';

export default function Contact() {
  return (
    <div className="container" style={{ paddingTop: '60px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '40px' }}>Contact Us</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '16px' }}>Get in Touch</h3>
          <p style={{ color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
            For inquiries regarding specific pieces, bespoke commissions, or international shipping, please reach out to our curation team.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#444' }}>
            <div><strong>Email:</strong> support@mannadiarmedia.com</div>
            <div><strong>Phone:</strong> +91 90000 00000</div>
          </div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={e => e.preventDefault()}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Name</label>
            <input type="text" style={{ padding: '12px', border: '1px solid var(--color-border)', outline: 'none' }} placeholder="Your Name" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email</label>
            <input type="email" style={{ padding: '12px', border: '1px solid var(--color-border)', outline: 'none' }} placeholder="Your Email" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Message</label>
            <textarea rows="5" style={{ padding: '12px', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }} placeholder="How can we help you?"></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  );
}
