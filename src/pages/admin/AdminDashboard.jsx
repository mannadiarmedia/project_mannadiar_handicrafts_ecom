import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, Layers, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalValue: 0,
    totalCategories: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch total products and total value
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('price');
        
      if (productsError) throw productsError;
      
      const totalProducts = productsData.length;
      const totalValue = productsData.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

      // Fetch total categories
      const { count: categoriesCount, error: categoriesError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });
        
      if (categoriesError) throw categoriesError;

      // Fetch recent 4 products
      const { data: recentData, error: recentError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (recentError) throw recentError;

      setMetrics({
        totalProducts,
        totalValue,
        totalCategories: categoriesCount || 0
      });
      setRecentProducts(recentData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#666', fontFamily: 'Inter' }}>Loading dashboard metrics...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, fontFamily: 'Playfair Display' }}>Dashboard Overview</h1>
        <Link 
          to="/admin/products/new" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#111', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 500, fontFamily: 'Inter' }}
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        
        {/* Total Products Card */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#f4f4f4', padding: '12px', borderRadius: '50%', color: '#333' }}>
              <Package size={24} />
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter' }}>Total Products</div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'Inter' }}>{metrics.totalProducts}</div>
        </div>

        {/* Total Value Card */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#f4f4f4', padding: '12px', borderRadius: '50%', color: '#333' }}>
              <TrendingUp size={24} />
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter' }}>Total Catalog Value</div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'Inter' }}>₹{metrics.totalValue.toLocaleString('en-IN')}</div>
        </div>

        {/* Total Categories Card */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#f4f4f4', padding: '12px', borderRadius: '50%', color: '#333' }}>
              <Layers size={24} />
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter' }}>Active Categories</div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'Inter' }}>{metrics.totalCategories}</div>
        </div>
      </div>

      {/* Recent Additions */}
      <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 400, fontFamily: 'Playfair Display' }}>Recently Added Masterpieces</h2>
          <Link to="/admin/products" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem', fontFamily: 'Inter' }}>View All Inventory &rarr;</Link>
        </div>

        {recentProducts.length === 0 ? (
          <div style={{ color: '#666', fontFamily: 'Inter', padding: '20px 0' }}>No products found. Add your first product!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ width: '80px', height: '80px', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', flexShrink: 0 }}>
                  <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 500, marginBottom: '4px', fontFamily: 'Playfair Display' }}>{product.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontFamily: 'Inter' }}>{product.category}</div>
                </div>
                <div style={{ fontWeight: 600, fontFamily: 'Inter', color: '#333' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
