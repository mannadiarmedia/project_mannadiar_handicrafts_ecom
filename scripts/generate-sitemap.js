import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env. Sitemap generation aborted.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://mannadiarhandicrafts.com';

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/b2b',
  '/shop',
  '/gallery',
  '/auth'
];

async function generateSitemap() {
  console.log("Generating sitemap.xml...");
  try {
    const { data: products, error } = await supabase.from('products').select('id');
    
    if (error) {
      throw error;
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static routes
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${route}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Add dynamic product routes
    if (products && products.length > 0) {
      for (const product of products) {
        xml += `  <url>\n`;
        xml += `    <loc>${BASE_URL}/shop/${product.id}</loc>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>\n`;

    const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, xml, 'utf8');
    
    console.log(`Successfully generated sitemap.xml at ${outputPath} with ${staticRoutes.length + (products ? products.length : 0)} URLs.`);

  } catch (error) {
    console.error("Error generating sitemap:", error.message);
    process.exit(1);
  }
}

generateSitemap();
