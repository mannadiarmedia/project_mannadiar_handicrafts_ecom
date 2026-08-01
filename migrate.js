import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// We have to extract the data from data.js. 
// Since it's a module, it's easier to just copy the data here for the migration script.
const PRODUCTS = [
  {
    title: 'Bronze Nataraja - The Cosmic Dancer',
    category: 'Bronze',
    price: 125000,
    image: '/images/2_nataraja.jpg',
    gallery: ['/images/2_nataraja.jpg', '/images/7_swan.jpg', '/images/3_teakwood.jpg'],
    material: 'Panchaloha (Five-Metal Alloy)',
    dimensions: 'H: 24", W: 18", D: 8"',
    weight: '12 kg',
    description: 'A museum-quality Chola-style Nataraja depicting Lord Shiva in his cosmic dance of creation and destruction. Cast using the ancient lost-wax process by master artisans in Swamimalai.',
    story: 'The Nataraja represents the rhythmic movement of the cosmos. The circle of fire (prabhamandala) symbolizes the universe, while the drum in his upper right hand heralds creation. This specific posture balances the destructive forces of the universe with the grace of divine salvation.',
    craftsmanship: 'Created using the traditional cire perdue (lost-wax) method. The master artisan spent over 400 hours carving the intricate wax model before casting. The final piece was hand-polished to achieve this profound antique patina.'
  },
  {
    title: 'Divine Granite Buddha Head',
    category: 'Stone',
    price: 85000,
    image: '/images/4_buddha.jpg',
    gallery: ['/images/4_buddha.jpg', '/images/7_swan.jpg', '/images/3_teakwood.jpg'],
    material: 'Black Granite',
    dimensions: 'H: 16", W: 10", D: 11"',
    weight: '28 kg',
    description: 'A remarkably serene Buddha head carved from a single block of dense black granite. The half-closed eyes and gentle smile evoke deep states of meditation and inner peace.',
    story: 'Inspired by the classic Gupta period aesthetics, this sculpture captures the essence of enlightenment. The elongated earlobes signify his royal past, while the ushnisha (cranial bump) symbolizes his immense wisdom.',
    craftsmanship: 'Hand-chiseled by sthapatis (traditional stone carvers) over 3 months. Granite is notoriously difficult to carve due to its hardness, requiring immense skill to achieve such smooth, flowing contours on the face.'
  },
  {
    title: 'Intricate Brass Urli with Peacocks',
    category: 'Brass',
    price: 32000,
    image: '/images/9_bowl.jpg',
    gallery: ['/images/9_bowl.jpg', '/images/7_swan.jpg', '/images/3_teakwood.jpg'],
    material: 'Solid Brass',
    dimensions: 'Dia: 22", H: 8"',
    weight: '9.5 kg',
    description: 'A grand traditional Urli featuring highly detailed peacock handles and floral motifs along the rim. Perfect for floating flowers and candles at the entrance of your home.',
    story: 'Urlis were originally used in Kerala for cooking large feasts or preparing Ayurvedic medicines. Today, they are cherished as welcoming elements in Vastu Shastra, bringing water element energies into the living space.',
    craftsmanship: 'Sand-cast in solid brass and meticulously hand-engraved. The peacocks were cast separately and brazed onto the main bowl, followed by a multi-stage buffing process for a brilliant golden finish.'
  },
  {
    title: 'Vintage Madhubani Canvas',
    category: 'Paintings',
    price: 18000,
    image: '/images/5_madhubani.jpg',
    gallery: ['/images/5_madhubani.jpg', '/images/7_swan.jpg', '/images/3_teakwood.jpg'],
    material: 'Natural Dyes on Handmade Paper',
    dimensions: 'H: 36", W: 48"',
    weight: '2 kg (framed)',
    description: 'A vibrant, large-scale Madhubani painting depicting the wedding of Ram and Sita. Features intricate geometric patterns and striking natural colors.',
    story: 'Originating from the Mithila region, this art form was traditionally painted on mud walls to celebrate festivals and weddings. The intricate patterns represent harmony with nature and divine blessings.',
    craftsmanship: 'Painted entirely using natural pigments derived from flowers, leaves, and spices. The artist used twigs and fine bamboo sticks to achieve the characteristic detailed line work and double borders.'
  },
  {
    title: 'Carved Teakwood Wall Panel',
    category: 'Wood',
    price: 45000,
    image: '/images/3_teakwood.jpg',
    gallery: ['/images/3_teakwood.jpg', '/images/7_swan.jpg', '/images/3_teakwood.jpg'],
    material: 'Seasoned Teakwood',
    dimensions: 'H: 48", W: 24", D: 3"',
    weight: '14 kg',
    description: 'A deeply carved architectural wall panel featuring the Tree of Life motif surrounded by celestial musicians. Provides a stunning focal point for any luxury interior.',
    story: 'The Tree of Life (Kalpavriksha) is a universal symbol of creation, sustenance, and immortality. The surrounding Gandharvas (celestial musicians) celebrate the eternal joy of existence.',
    craftsmanship: 'Carved from a single piece of 80-year-old seasoned teakwood. The artisan used over 40 different specialized chisels to create the deep undercuts and 3D relief, finished with natural oils.'
  },
  {
    title: 'Antique Terracotta Vase',
    category: 'Others',
    price: 12000,
    image: '/images/6_vase.jpg',
    gallery: ['/images/6_vase.jpg', '/images/7_swan.jpg', '/images/3_teakwood.jpg'],
    material: 'Fired Clay',
    dimensions: 'H: 20", Dia: 12"',
    weight: '6 kg',
    description: 'A beautifully aged terracotta vessel featuring tribal warli art patterns. The porous nature of the clay gives it a wonderful matte, earthy texture.',
    story: 'Terracotta is one of the oldest mediums of human expression. The Warli motifs depicted on this vase tell stories of ancient village life, harvests, and communal dances.',
    craftsmanship: 'Wheel-thrown by master potters and slowly sun-dried before being pit-fired in a traditional open kiln, giving it unique, unpredictable smoke patterns.'
  },
  {
    title: 'Silver-Plated Royal Swan',
    category: 'Others',
    price: 28000,
    image: '/images/7_swan.jpg',
    gallery: ['/images/7_swan.jpg', '/images/7_swan.jpg', '/images/3_teakwood.jpg'],
    material: 'White Metal with Pure Silver Plating',
    dimensions: 'H: 14", W: 18"',
    weight: '4.5 kg',
    description: 'An elegant ornamental swan designed as a centerpiece. The feathers are intricately chased, and the silver plating gives it a radiant, luxurious glow.',
    story: 'The Hamsa (swan) represents purity, transcendence, and spiritual discrimination in Vedic philosophy, as it is said to be capable of drinking pure milk while leaving water behind.',
    craftsmanship: 'Crafted in white metal and electroplated with 99.9% pure silver. The fine detailing on the feathers is achieved through the Repoussé and chasing technique.'
  },
  {
    title: 'Majestic Wooden Elephant',
    category: 'Wood',
    price: 55000,
    image: '/images/8_elephant.jpg',
    gallery: ['/images/8_elephant.jpg', '/images/7_swan.jpg', '/images/3_teakwood.jpg'],
    material: 'Rosewood',
    dimensions: 'H: 18", L: 22", W: 10"',
    weight: '16 kg',
    description: 'A regal elephant carved from rich, dark rosewood. It features traditional Kerala-style caparison (Nettipattam) details carved directly into the wood.',
    story: 'Elephants are revered in Indian culture as symbols of strength, wisdom, and royalty. They are strongly associated with Lord Ganesha and the Goddess of Wealth, Lakshmi.',
    craftsmanship: 'Carved from premium Indian Rosewood (Sheesham). The natural dark grains of the wood were carefully aligned with the contours of the elephant, polished with beeswax for a satin finish.'
  },
  {
    title: 'Ganesha Stone Relief',
    category: 'Stone',
    price: 65000,
    image: '/images/10_ganesha.jpg',
    gallery: ['/images/10_ganesha.jpg', '/images/7_swan.jpg', '/images/3_teakwood.jpg'],
    material: 'Pink Sandstone',
    dimensions: 'H: 30", W: 24", D: 4"',
    weight: '35 kg',
    description: 'A magnificent wall relief of Lord Ganesha carved in pink sandstone, highly reminiscent of the ancient temple architectures of Rajasthan.',
    story: 'Ganesha is the Lord of Beginnings and the Remover of Obstacles. Placing this relief at the entrance of a home or office is believed to bring prosperity and smooth endeavors.',
    craftsmanship: 'Carved from Mathura pink sandstone. The artisan utilized varying depths of relief carving to create a striking play of light and shadow, highlighting Ganeshas ornaments.'
  }
];

async function seedDatabase() {
  console.log('Clearing old products...');
  await supabase.from('products').delete().neq('id', 0);
  
  console.log('Starting Supabase migration with correct images...');
  
  for (const product of PRODUCTS) {
    const { data, error } = await supabase
      .from('products')
      .insert([product]);
      
    if (error) {
      console.error('Error inserting', product.title, error);
    } else {
      console.log('Successfully inserted:', product.title);
    }
  }
  
  console.log('Migration complete!');
}

seedDatabase();
