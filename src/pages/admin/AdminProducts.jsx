import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Bulk Edit State
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [bulkEdits, setBulkEdits] = useState({});
  const [savingBulk, setSavingBulk] = useState(false);
  
  // Filter State
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this masterpiece?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error.message);
        alert('Failed to delete product.');
      }
    }
  };

  const handleEnableBulkEdit = () => {
    const initialEdits = {};
    products.forEach(p => {
      initialEdits[p.id] = {
        category: p.category,
        price: p.price,
        discounted_price: p.discounted_price || '',
        shipping_fee: p.shipping_fee || '',
        out_of_stock: p.out_of_stock || false
      };
    });
    setBulkEdits(initialEdits);
    setIsBulkEditMode(true);
  };

  const handleBulkChange = (id, field, value) => {
    setBulkEdits(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSaveBulkEdits = async () => {
    try {
      setSavingBulk(true);
      
      const promises = products.map(p => {
        const edits = bulkEdits[p.id];
        const updateData = {
          category: edits.category,
          price: Number(edits.price),
          discounted_price: edits.discounted_price ? Number(edits.discounted_price) : null,
          shipping_fee: edits.shipping_fee ? Number(edits.shipping_fee) : 0,
          out_of_stock: edits.out_of_stock
        };
        return supabase.from('products').update(updateData).eq('id', p.id);
      });

      await Promise.all(promises);
      
      alert('Bulk edits saved successfully!');
      setIsBulkEditMode(false);
      fetchProducts(); // Refresh data
    } catch (error) {
      console.error('Error saving bulk edits:', error);
      alert('Error saving bulk edits. Check console.');
    } finally {
      setSavingBulk(false);
    }
  };

  const displayedProducts = filterCategory === 'All' 
    ? products 
    : products.filter(p => p.category === filterCategory);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, fontFamily: 'Playfair Display' }}>Inventory Management</h1>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter', backgroundColor: '#fff', minWidth: '150px' }}
          >
            <option value="All">All Products</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {isBulkEditMode ? (
            <>
              <button onClick={() => setIsBulkEditMode(false)} disabled={savingBulk} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}>
                <X size={18} /> Cancel
              </button>
              <button onClick={handleSaveBulkEdits} disabled={savingBulk} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', cursor: 'pointer' }}>
                <Save size={18} /> {savingBulk ? 'Saving...' : 'Save All Changes'}
              </button>
            </>
          ) : (
            <>
              <button onClick={handleEnableBulkEdit} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: '1px solid #111', backgroundColor: '#fff', color: '#111', cursor: 'pointer' }}>
                <Edit3 size={18} /> Enable Bulk Edit
              </button>
              <Link to="/admin/products/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#111', color: '#fff', textDecoration: 'none' }}>
                <Plus size={18} /> Add New Product
              </Link>
            </>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading database...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '16px', fontWeight: 600, color: '#555' }}>Product</th>
                  <th style={{ padding: '16px', fontWeight: 600, color: '#555' }}>Category</th>
                  <th style={{ padding: '16px', fontWeight: 600, color: '#555' }}>Price (₹)</th>
                  
                  {isBulkEditMode ? (
                    <>
                      <th style={{ padding: '16px', fontWeight: 600, color: '#555' }}>Discount (₹)</th>
                      <th style={{ padding: '16px', fontWeight: 600, color: '#555' }}>Shipping (₹)</th>
                      <th style={{ padding: '16px', fontWeight: 600, color: '#555', textAlign: 'center' }}>Out of Stock</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '16px', fontWeight: 600, color: '#555' }}>Material</th>
                      <th style={{ padding: '16px', fontWeight: 600, color: '#555', textAlign: 'right' }}>Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={product.image} alt={product.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{product.title}</span>
                        {product.sku && <span style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace', marginTop: '4px' }}>{product.sku}</span>}
                      </div>
                    </td>
                    
                    {isBulkEditMode ? (
                      <>
                        <td style={{ padding: '16px' }}>
                          <select 
                            value={bulkEdits[product.id]?.category || ''} 
                            onChange={(e) => handleBulkChange(product.id, 'category', e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                          >
                            <option value="">Select</option>
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" 
                            value={bulkEdits[product.id]?.price || ''} 
                            onChange={(e) => handleBulkChange(product.id, 'price', e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" 
                            value={bulkEdits[product.id]?.discounted_price || ''} 
                            onChange={(e) => handleBulkChange(product.id, 'discounted_price', e.target.value)}
                            placeholder="None"
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" 
                            value={bulkEdits[product.id]?.shipping_fee || ''} 
                            onChange={(e) => handleBulkChange(product.id, 'shipping_fee', e.target.value)}
                            placeholder="0"
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                          />
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={bulkEdits[product.id]?.out_of_stock || false} 
                            onChange={(e) => handleBulkChange(product.id, 'out_of_stock', e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '16px', color: '#666' }}>{product.category}</td>
                        <td style={{ padding: '16px', fontWeight: 500 }}>
                          {product.discounted_price ? (
                            <div>
                              <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem', marginRight: '8px' }}>₹{product.price.toLocaleString('en-IN')}</span>
                              <span style={{ color: '#d32f2f' }}>₹{product.discounted_price.toLocaleString('en-IN')}</span>
                            </div>
                          ) : (
                            `₹${product.price.toLocaleString('en-IN')}`
                          )}
                        </td>
                        <td style={{ padding: '16px', color: '#666' }}>{product.material}</td>
                        <td style={{ padding: '16px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '16px', alignItems: 'center' }}>
                          <Link to={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'underline', fontWeight: 500 }}>
                            View in Website
                          </Link>
                          <Link to={`/admin/products/edit/${product.id}`} style={{ fontSize: '0.85rem', color: '#111', textDecoration: 'underline', fontWeight: 500 }}>
                            Open Item
                          </Link>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', display: 'flex', alignItems: 'center' }} 
                            title="Delete"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {displayedProducts.length === 0 && (
                  <tr>
                    <td colSpan={isBulkEditMode ? 6 : 5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
