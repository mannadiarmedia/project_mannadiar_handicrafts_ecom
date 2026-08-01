import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url, schema }) {
  const siteTitle = 'Mannadiar Handicrafts';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || 'Premium South Indian Brass and Wood Handicrafts. Authentic, handcrafted masterpieces for your home and corporate gifting.';
  const metaImage = image || 'https://qkixmxtczmrtasdchbzo.supabase.co/storage/v1/object/public/products/default-og.jpg';
  const metaUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* OpenGraph / Facebook Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
