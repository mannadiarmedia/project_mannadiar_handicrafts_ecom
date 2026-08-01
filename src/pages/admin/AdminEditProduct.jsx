import React, { useState, useEffect } from 'react';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Brass',
    price: '',
    material: '',
    height: '',
    width: '',
    length: '',
    dia: '',
    weight: '',
    packing_weight: '',
    description: '',
    story: '',
    craftsmanship: '',
    image: '',
    gallery: [],
    discounted_price: '',
    shipping_fee: '',
    out_of_stock: false
  });
  
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);
  
  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title || '',
          category: data.category || '',
          price: data.price || '',
          material: data.material || '',
          height: data.height || '',
          width: data.width || '',
          length: data.length || '',
          dia: data.dia || '',
          weight: data.weight || '',
          packing_weight: data.packing_weight || '',
          description: data.description || '',
          story: data.story || '',
          craftsmanship: data.craftsmanship || '',
          image: data.image || '',
          gallery: data.gallery || (data.image ? [data.image] : []),
          discounted_price: data.discounted_price || '',
          shipping_fee: data.shipping_fee || '',
          out_of_stock: data.out_of_stock || false
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error.message);
      alert('Could not load product details.');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleImageUpload = async (event, isGallery = false) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      
      if (isGallery) {
        setFormData({ ...formData, gallery: [...formData.gallery, data.publicUrl] });
      } else {
        setFormData({ ...formData, image: data.publicUrl, gallery: [data.publicUrl, ...formData.gallery.filter(g => g !== formData.image)] });
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.image) {
      alert("Please upload a product image first.");
      setLoading(false);
      return;
    }

    try {
      const productToUpdate = {
        ...formData,
        price: Number(formData.price),
        discounted_price: formData.discounted_price ? Number(formData.discounted_price) : null,
        shipping_fee: formData.shipping_fee ? Number(formData.shipping_fee) : 0,
        height: formData.height ? Number(formData.height) : null,
        width: formData.width ? Number(formData.width) : null,
        length: formData.length ? Number(formData.length) : null,
        dia: formData.dia ? Number(formData.dia) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        packing_weight: formData.packing_weight ? Number(formData.packing_weight) : null,
        gallery: formData.gallery.length > 0 ? formData.gallery : [formData.image]
      };
      
      delete productToUpdate.dimensions; // Ensure old field isn't sent
      
      const { error } = await supabase
        .from('products')
        .update(productToUpdate)
        .eq('id', id);
        
      if (error) throw error;
      
      alert('Product updated successfully!');
      navigate('/admin/products');
      
    } catch (error) {
      console.error('Error updating product:', error.message);
      alert('Failed to update product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: '40px' }}>Loading product details...</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link to="/admin/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', marginBottom: '16px', fontFamily: 'Inter' }}>
          <ArrowLeft size={16} /> Back to Inventory
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, fontFamily: 'Playfair Display' }}>Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Basic Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Product Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required type="text" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter', backgroundColor: 'white' }}>
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Original Price (₹)</label>
            <input name="price" value={formData.price} onChange={handleChange} required type="number" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Discounted Price (₹)</label>
            <input name="discounted_price" value={formData.discounted_price} onChange={handleChange} type="number" placeholder="Optional" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Shipping Fee (₹)</label>
            <input name="shipping_fee" value={formData.shipping_fee} onChange={handleChange} type="number" placeholder="0 for Free" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, color: '#444' }}>
              <input type="checkbox" name="out_of_stock" checked={formData.out_of_stock} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
              Mark as Out of Stock
            </label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Material</label>
            <input name="material" value={formData.material} onChange={handleChange} required type="text" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
          </div>
        </div>

        {/* Dimensions & Weight Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', backgroundColor: '#fafafa', padding: '16px', borderRadius: '8px', border: '1px solid #eee' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Height (in)</label>
            <input name="height" value={formData.height} onChange={handleChange} type="number" step="0.1" placeholder="e.g. 24.5" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Width (in)</label>
            <input name="width" value={formData.width} onChange={handleChange} type="number" step="0.1" placeholder="e.g. 18" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Length (in)</label>
            <input name="length" value={formData.length} onChange={handleChange} type="number" step="0.1" placeholder="e.g. 12" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Diameter (in)</label>
            <input name="dia" value={formData.dia} onChange={handleChange} type="number" step="0.1" placeholder="e.g. 8" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Item Weight (kg)</label>
            <input name="weight" value={formData.weight} onChange={handleChange} type="number" step="0.1" placeholder="e.g. 5.2" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Packing Weight (kg) <span style={{ color: '#d32f2f', fontSize: '0.75rem' }}>(Admin Only)</span></label>
            <input name="packing_weight" value={formData.packing_weight} onChange={handleChange} type="number" step="0.1" placeholder="e.g. 8.5" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter', backgroundColor: '#fff3f3' }} />
          </div>
        </div>

        {/* Rich Text / Story */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter', resize: 'vertical' }}></textarea>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>The Story Behind the Art</label>
          <textarea name="story" value={formData.story} onChange={handleChange} rows="3" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Inter', resize: 'vertical' }}></textarea>
        </div>

        {/* Image Upload Area */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Primary Image</label>
          {formData.image ? (
            <div style={{ position: 'relative', width: '200px', height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
              <img src={formData.image} alt="Uploaded product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, image: '', gallery: formData.gallery.filter(g => g !== formData.image) })}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', border: '2px dashed #ccc', borderRadius: '8px', padding: '40px', textAlign: 'center', backgroundColor: '#fafafa', cursor: 'pointer' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, false)}
                disabled={uploading}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
              />
              {uploading ? (
                <div>Uploading image to Supabase Storage...</div>
              ) : (
                <>
                  <UploadCloud size={40} color="#888" style={{ marginBottom: '16px' }} />
                  <p style={{ color: '#666', margin: 0 }}>Click or drag a new product photo here</p>
                  <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '8px' }}>High-res JPG or PNG.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Gallery Upload Area */}
        {formData.image && (
          <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#444' }}>Additional Images (Gallery)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {formData.gallery.filter(img => img !== formData.image).map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
                  <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    type="button" 
                    onClick={() => removeGalleryImage(formData.gallery.indexOf(img))}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    X
                  </button>
                </div>
              ))}
              
              <div style={{ position: 'relative', width: '120px', height: '120px', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa', cursor: 'pointer' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, true)}
                  disabled={uploading}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                />
                <UploadCloud size={24} color="#888" />
                <span style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>Add Image</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
          <Link to="/admin/products" style={{ padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none', color: '#333' }}>Cancel</Link>
          <button type="submit" disabled={loading || uploading} style={{ padding: '12px 24px', backgroundColor: '#111', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: (loading || uploading) ? 0.7 : 1 }}>
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
