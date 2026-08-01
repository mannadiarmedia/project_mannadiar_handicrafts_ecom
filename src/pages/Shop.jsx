import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';

export default function Shop({ addToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCategory = searchParams.get('category') || 'All';
  const sortOrder = searchParams.get('sort') || 'default';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const ITEMS_PER_PAGE = 12;
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync local search when URL changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Scroll to top on mount or page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory, currentPage, searchQuery]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name')
        ]);
          
        if (productsRes.error) throw productsRes.error;
        if (categoriesRes.error) throw categoriesRes.error;
        
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  let filteredProducts = products;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(p => 
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.material && p.material.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (activeCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
  }

  if (sortOrder === 'price-low-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price-high-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const updateParams = (newParams) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    });
    setSearchParams(next);
  };

  const handleCategoryChange = (cat) => {
    updateParams({ category: cat, page: 1 });
  };

  const handleSortChange = (e) => {
    updateParams({ sort: e.target.value, page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: localSearch.trim(), page: 1 });
  };

  const clearSearch = () => {
    setLocalSearch('');
    updateParams({ search: '', page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParams({ page: newPage });
    }
  };

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ fontSize: '3rem', fontWeight: 300, marginBottom: '16px' }}
          >
            {searchQuery ? `Search Results` : `Our Collection`}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            style={{ color: '#666', fontFamily: 'Inter', margin: 0 }}
          >
            {searchQuery 
              ? `Showing results matching "${searchQuery}"` 
              : `Explore our curated selection of authentic Indian handcrafted masterpieces.`}
          </motion.p>
        </div>

        {/* In-page Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '30px', padding: '6px 16px', minWidth: '280px', maxWidth: '400px', flex: 1 }}>
          <Search size={18} color="#888" style={{ marginRight: '8px' }} />
          <input 
            type="text" 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search collection..."
            style={{ border: 'none', outline: 'none', width: '100%', fontFamily: 'Inter', fontSize: '0.9rem' }}
          />
          {localSearch && (
            <button type="button" onClick={clearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '2px', display: 'flex', alignItems: 'center' }}>
              <X size={16} />
            </button>
          )}
        </form>
      </div>

      {/* Active Search Pill Banner */}
      {searchQuery && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', padding: '12px 20px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontFamily: 'Inter' }}>
          <span style={{ fontSize: '0.9rem', color: '#444' }}>
            Filtered by search: <strong>"{searchQuery}"</strong> ({filteredProducts.length} items found)
          </span>
          <button 
            onClick={clearSearch}
            style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '20px', padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#333' }}
          >
            <X size={14} /> Clear Search
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        {/* Sidebar Filters */}
        <div style={{ flex: '0 0 250px' }}>
          <div style={{ position: 'sticky', top: '120px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>Categories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('All')}
                style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: '1rem', color: activeCategory === 'All' ? '#111' : '#666', fontWeight: activeCategory === 'All' ? 600 : 400 }}
              >
                All Masterpieces
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={`filter-btn ${activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.name)}
                  style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: '1rem', color: activeCategory === cat.name ? '#111' : '#666', fontWeight: activeCategory === cat.name ? 600 : 400 }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '24px', marginTop: '40px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>Sort By</h3>
            <select 
              value={sortOrder} 
              onChange={handleSortChange}
              style={{ width: '100%', padding: '12px', fontFamily: 'Inter', fontSize: '0.95rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', outline: 'none' }}
            >
              <option value="default">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          <motion.div 
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}
          >
            {loading ? (
              <div style={{ color: '#666', gridColumn: '1 / -1', padding: '40px 0', fontFamily: 'Inter' }}>Loading collection...</div>
            ) : paginatedProducts.length === 0 ? (
              <div style={{ color: '#666', gridColumn: '1 / -1', padding: '40px 0', fontFamily: 'Inter' }}>No masterpieces found in this collection.</div>
            ) : (
              paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))
            )}
          </motion.div>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '60px' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '40px', height: '40px', borderRadius: '4px',
                  border: '1px solid #ccc', backgroundColor: '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.4 : 1
                }}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    width: '40px', height: '40px', borderRadius: '4px',
                    border: currentPage === pageNum ? '1px solid #111' : '1px solid #ccc',
                    backgroundColor: currentPage === pageNum ? '#111' : '#fff',
                    color: currentPage === pageNum ? '#fff' : '#111',
                    fontWeight: currentPage === pageNum ? 600 : 400,
                    fontFamily: 'Inter', fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '40px', height: '40px', borderRadius: '4px',
                  border: '1px solid #ccc', backgroundColor: '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.4 : 1
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
