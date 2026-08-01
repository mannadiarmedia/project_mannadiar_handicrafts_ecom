import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'B2B Inquiries', path: '/admin/inquiries', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f4', fontFamily: 'Inter' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#111', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/images/logo.png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'Playfair Display' }}>Mannadiar Admin</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '24px 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
                    color: location.pathname === item.path ? '#fff' : '#888',
                    backgroundColor: location.pathname === item.path ? '#222' : 'transparent',
                    textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s'
                  }}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid #333' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#888', textDecoration: 'none', fontWeight: 500 }}>
            <LogOut size={20} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
