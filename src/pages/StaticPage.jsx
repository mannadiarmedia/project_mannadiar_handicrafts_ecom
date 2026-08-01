import React from 'react';

export default function StaticPage({ title, content }) {
  return (
    <div className="container" style={{ paddingTop: '60px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '40px' }}>{title}</h1>
      <div style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.8 }}>
        {content ? content : (
          <p>
            This section is currently being updated. Please check back later for detailed information regarding {title.toLowerCase()}.
          </p>
        )}
      </div>
    </div>
  );
}
