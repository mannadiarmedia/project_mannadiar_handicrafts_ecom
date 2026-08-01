import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Mail, Phone, Building, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsContacted = async (id) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: 'Contacted' })
        .eq('id', id);

      if (error) throw error;
      
      setInquiries(inquiries.map(inq => 
        inq.id === id ? { ...inq, status: 'Contacted' } : inq
      ));
    } catch (error) {
      console.error('Error updating inquiry:', error.message);
      alert('Failed to update status.');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading inquiries...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, fontFamily: 'Playfair Display' }}>B2B & Corporate Inquiries</h1>
        <button 
          onClick={fetchInquiries}
          className="btn btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid #111', backgroundColor: '#fff', cursor: 'pointer' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {inquiries.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
            No inquiries received yet.
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              
              {/* Header */}
              <div style={{ backgroundColor: '#fafafa', padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#333', marginBottom: '4px' }}>{inquiry.name}</h3>
                  <div style={{ display: 'flex', gap: '16px', color: '#666', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building size={14}/> {inquiry.company || 'N/A'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14}/> <a href={`mailto:${inquiry.email}`} style={{ color: '#666', textDecoration: 'none' }}>{inquiry.email}</a></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14}/> {inquiry.phone}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
                    {new Date(inquiry.created_at).toLocaleString()}
                  </div>
                  {inquiry.status === 'New' ? (
                    <button 
                      onClick={() => markAsContacted(inquiry.id)}
                      style={{ backgroundColor: '#fff3e0', color: '#f57c00', border: '1px solid #ffe0b2', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Mark as Contacted
                    </button>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                      <CheckCircle size={14} /> Contacted
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: '24px', display: 'flex', gap: '40px' }}>
                <div style={{ flex: '0 0 200px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Est. Budget</div>
                  <div style={{ fontWeight: 500, fontSize: '1.1rem', color: '#111' }}>{inquiry.budget || 'Not specified'}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Requirements</div>
                  <p style={{ color: '#444', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {inquiry.requirements}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
