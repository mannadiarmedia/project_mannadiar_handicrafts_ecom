import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategoryName.trim() }])
        .select();
        
      if (error) {
        if (error.code === '23505') {
          alert('This category already exists.');
        } else {
          throw error;
        }
      } else if (data) {
        setCategories([...categories, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
        setNewCategoryName('');
      }
    } catch (error) {
      console.error('Error adding category:', error.message);
      alert('Failed to add category: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" category?\n\nNote: Make sure no products are using this category first.`)) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error.message);
        alert('Failed to delete category. ' + error.message);
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, fontFamily: 'Playfair Display' }}>Category Management</h1>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        
        {/* Category List */}
        <div style={{ flex: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading categories...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: '#555' }}>Category Name</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: '#555', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{category.name}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53935' }} 
                        title="Delete"
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="2" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Category Form */}
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '24px', fontFamily: 'Inter' }}>Add New Category</h3>
          <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Name</label>
              <input 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                required 
                type="text" 
                placeholder="e.g. Silver Jewelry" 
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} 
              />
            </div>
            <button 
              type="submit" 
              disabled={submitting} 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#111', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}
            >
              <Plus size={18} /> {submitting ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
