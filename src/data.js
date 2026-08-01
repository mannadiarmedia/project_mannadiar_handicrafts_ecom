export const CATEGORIES = ['Brass', 'Bronze', 'Wood', 'Stone', 'Paintings', 'Others'];

export const PRODUCTS = [
  { 
    id: 1, 
    title: 'Brass Deepam Lamp', 
    price: 8500, 
    category: 'Brass', 
    image: '/images/1_brass_lamp.jpg',
    gallery: ['/images/1_brass_lamp.jpg', '/images/7_swan.jpg', '/images/5_teakwood.jpg'], 
    description: 'Traditional Kerala style deepam lamp, crafted with generations of expertise. A symbol of auspicious beginnings and divine light.',
    longDescription: 'The Deepam lamp holds profound significance in Indian households, representing the dispelling of ignorance and the awakening of inner wisdom. This particular piece is hand-cast by master artisans in Kerala using the ancient lost-wax process, ensuring every curve and motif is completely unique to your lamp. Its heavy brass construction guarantees it will become a cherished family heirloom passed down through generations.',
    keyFeatures: [
      'Hand-cast using traditional lost-wax technique',
      'Heavy-gauge authentic brass construction',
      'Intricate floral motifs at the base'
    ],
    benefits: [
      'Brings positive energy and auspiciousness to the home',
      'Perfect for daily puja or festive occasions',
      'Naturally purifies the surrounding air when used with pure ghee'
    ],
    placementTips: 'Place in the northeast corner (Ishan Kund) of your home or directly in your designated prayer room.',
    materials: '100% Solid Brass',
    dimensions: '18" Height x 6" Base Width',
    weight: '2.5 kg'
  },
  { 
    id: 2, 
    title: 'Nataraja Sculpture', 
    price: 45000, 
    category: 'Bronze', 
    image: '/images/2_nataraja.jpg',
    gallery: ['/images/2_nataraja.jpg', '/images/7_swan.jpg', '/images/5_teakwood.jpg'], 
    description: 'An exquisite hand-crafted bronze sculpture depicting Shiva as the Lord of Dance.',
    longDescription: 'Nataraja, the Lord of Dance, represents the cosmic cycles of creation and destruction. This breathtaking sculpture captures the dynamic energy of Shiva in his Ananda Tandava (Dance of Bliss). Sourced directly from Swamimalai, the renowned center of Chola bronze casting, the metallurgical composition follows the strict guidelines laid down in the Shilpa Shastras.',
    keyFeatures: [
      'Panchaloha (Five-metal alloy) inspired casting',
      'Museum-quality detailing on the Prabhavali (arch of fire)',
      'Authentic Chola dynasty aesthetic'
    ],
    benefits: [
      'Reminds the observer of the continuous cycle of life',
      'A commanding centerpiece that elevates any architectural space',
      'Appreciates in cultural and artistic value over time'
    ],
    placementTips: 'Display in a prominent, well-lit area, preferably facing East or West, to capture the morning or evening light on the bronze contours.',
    materials: 'Premium Bronze Alloy',
    dimensions: '24" Height x 18" Width',
    weight: '8.2 kg'
  },
  { 
    id: 3, 
    title: 'Carved Teakwood Panel', 
    price: 28000, 
    category: 'Wood', 
    image: '/images/3_teakwood.jpg',
    gallery: ['/images/3_teakwood.jpg', '/images/7_swan.jpg', '/images/5_teakwood.jpg'], 
    description: 'Intricately carved floral motifs on aged teakwood, perfect for wall mounting.',
    longDescription: 'Rescued from a demolished heritage haveli and painstakingly restored, this teakwood panel features deep-relief carvings of lotuses and vines. Teakwood from this era is renowned for its dense grain and natural resistance to decay, making this not just a piece of art, but a piece of architectural history.',
    keyFeatures: [
      'Reclaimed, heritage-grade teakwood',
      'Deep-relief traditional carving techniques',
      'Natural matte finish highlighting the wood grain'
    ],
    benefits: [
      'Adds warmth, texture, and history to modern interiors',
      'Highly durable and resistant to pests due to natural teak oils',
      'Eco-friendly upcycled art'
    ],
    placementTips: 'Mount as a headboard alternative or as a focal point in a living room above a console table.',
    materials: 'Reclaimed Teakwood',
    dimensions: '36" Width x 12" Height x 2" Depth',
    weight: '5.5 kg'
  },
  { 
    id: 4, 
    title: 'Granite Buddha', 
    price: 55000, 
    category: 'Stone', 
    image: '/images/4_buddha.jpg',
    gallery: ['/images/4_buddha.jpg', '/images/7_swan.jpg', '/images/5_teakwood.jpg'], 
    description: 'Hand-carved stone meditation statue emanating profound tranquility.',
    longDescription: 'Carved from a single block of black granite by artisans in Mahabalipuram, this Dhyana Mudra Buddha statue radiates absolute stillness. The rigorous process of stone carving means the artisan must have a perfect vision before striking the first blow; there is no room for error. The result is a masterpiece of balance and serenity.',
    keyFeatures: [
      'Monolithic black granite construction',
      'Weather-resistant for both indoor and outdoor use',
      'Dhyana Mudra posture signifying deep meditation'
    ],
    benefits: [
      'Anchors a space with profound, grounded energy',
      'Promotes mindfulness and a calm atmosphere',
      'Virtually indestructible and requires zero maintenance'
    ],
    placementTips: 'Ideal for a garden sanctuary, an entrance foyer, or facing the main door to neutralize negative energies.',
    materials: 'Solid Black Granite',
    dimensions: '30" Height x 20" Width',
    weight: '45.0 kg'
  },
  { 
    id: 5, 
    title: 'Madhubani Canvas', 
    price: 12000, 
    category: 'Paintings', 
    image: '/images/5_madhubani.jpg',
    gallery: ['/images/5_madhubani.jpg', '/images/7_swan.jpg', '/images/5_teakwood.jpg'], 
    description: 'Vibrant traditional painting depicting the Tree of Life.',
    longDescription: 'Originating from the Mithila region, this Madhubani painting is characterized by its eye-catching geometrical patterns and vibrant colors extracted from natural plant sources. It depicts the sacred Tree of Life, interwoven with birds and deities, celebrating the harmonious relationship between humanity and nature.',
    keyFeatures: [
      'Authentic Mithila style with intricate double-line borders',
      'Painted using natural dyes and pigments',
      'Unframed canvas, allowing for custom framing to suit your decor'
    ],
    benefits: [
      'Injects vibrant, culturally rich color into any room',
      'Supports the livelihood of rural female artisans',
      'Acts as an excellent conversation starter'
    ],
    placementTips: 'Hang in a well-lit living area or dining room to bring lively, joyous energy to spaces of gathering.',
    materials: 'Hand-spun cotton canvas, natural pigments',
    dimensions: '24" x 36"',
    weight: '0.5 kg (unframed)'
  },
  { 
    id: 6, 
    title: 'Terracotta Vase', 
    price: 4000, 
    category: 'Others', 
    image: '/images/6_vase.jpg',
    gallery: ['/images/6_vase.jpg', '/images/7_swan.jpg', '/images/5_teakwood.jpg'], 
    description: 'Hand-thrown earthen vase with tribal motifs.',
    longDescription: 'Crafted from the rich red clay of rural Bengal, this terracotta vase showcases the raw, tactile beauty of earth. It is hand-thrown on a traditional potter\'s wheel and then fired in a wood kiln, giving it unique, unpredictable color variations that cannot be replicated in a factory.',
    keyFeatures: [
      'Hand-thrown on a traditional wheel',
      'Wood-fired for unique textural variations',
      'Etched with geometric tribal patterns'
    ],
    benefits: [
      'Brings a grounding, earthy element to modern interiors',
      'Highly porous, making it excellent for dried floral arrangements',
      'Accessible entry-point to collecting traditional crafts'
    ],
    placementTips: 'Display on a windowsill, bookshelf, or as a rustic centerpiece on a dining table with dried pampas grass.',
    materials: 'Fired Terracotta Clay',
    dimensions: '14" Height x 8" Diameter',
    weight: '1.2 kg'
  },
  { 
    id: 7, 
    title: 'Silver Raj Hamsa', 
    price: 85000, 
    category: 'Others', 
    image: '/images/7_swan.jpg',
    gallery: ['/images/7_swan.jpg', '/images/7_swan.jpg', '/images/5_teakwood.jpg'], 
    description: 'A symbol of Divine Love and Tranquility, embodied in solid silver.',
    longDescription: 'The Raj Hamsa (Royal Swan) embodies grace, purity, and spiritual growth. As the sacred vehicle of Goddess Saraswati, it glides serenely through life\'s challenges, reminding us to remain unaffected by external chaos and focus on higher wisdom and enlightenment. This exquisite sculpture draws from the element of air, promoting emotional balance, clarity, and spiritual elevation.',
    keyFeatures: [
      'Crafted from high-purity solid silver',
      'Intricate feather detailing polished to a mirror finish',
      'Blessed with Vedic chants during the crafting process'
    ],
    benefits: [
      'Brings tranquility, loyalty, and spiritual growth into any space.',
      'Made of silver, a Moon metal that enhances calmness and mental clarity.',
      'A true heirloom piece with immense intrinsic and spiritual value.'
    ],
    placementTips: 'Place in the southwest corner of your living or working space to benefit from its calming influence and strengthen emotional connections.',
    materials: '92.5% Sterling Silver',
    dimensions: '8" Height x 12" Length',
    weight: '2.8 kg'
  },
  { 
    id: 8, 
    title: 'Royal Wooden Elephant', 
    price: 18000, 
    category: 'Wood', 
    image: '/images/8_elephant.jpg',
    gallery: ['/images/8_elephant.jpg', '/images/7_swan.jpg', '/images/5_teakwood.jpg'], 
    description: 'Majestic hand-carved sandalwood elephant adorned with ceremonial howdah.',
    longDescription: 'In Indian culture, the elephant is a profound symbol of strength, wisdom, and royalty. This piece, carved from sustainably sourced sandalwood, features the traditional Ambari (howdah) used by Maharajas. The intricate jali (lattice) work inside the elephant reveals a smaller, secondary carving within—a testament to the artisan\'s unbelievable skill.',
    keyFeatures: [
      'Carved from a single block of fragrant sandalwood',
      'Undercut carving technique featuring an "elephant within an elephant"',
      'Traditional Rajasthani royal motifs'
    ],
    benefits: [
      'Fills the room with a subtle, natural sandalwood fragrance',
      'Symbolizes good luck and prosperity',
      'Showcases absolute mastery of traditional Indian wood carving'
    ],
    placementTips: 'Place facing the main entrance of your home or office to welcome good fortune and protect the space from negative energy.',
    materials: 'Sustainably Sourced Sandalwood',
    dimensions: '10" Height x 12" Length',
    weight: '3.1 kg'
  },
  { 
    id: 9, 
    title: 'Brass Singing Bowl', 
    price: 6500, 
    category: 'Brass', 
    image: '/images/9_bowl.jpg',
    gallery: ['/images/9_bowl.jpg', '/images/7_swan.jpg', '/images/5_teakwood.jpg'], 
    description: 'Hand-hammered healing bowl tuned to the heart chakra.',
    longDescription: 'Forged in the foothills of the Himalayas, this traditional singing bowl is crafted from a precise alloy of seven metals, each representing a different celestial body. When struck or played along the rim, it produces a resonant, multi-layered harmonic tone that immediately induces a deep state of relaxation and meditative focus.',
    keyFeatures: [
      'Hand-hammered by Himalayan artisans',
      'Tuned precisely to the F note (Heart Chakra)',
      'Includes rosewood striker and silk resting cushion'
    ],
    benefits: [
      'Perfect for sound healing, meditation, and yoga practices',
      'Clears stagnant energy in a room through sonic vibration',
      'Promotes deep relaxation and stress relief'
    ],
    placementTips: 'Keep on an altar or in a meditation space. Strike it once in the morning to set a peaceful tone for the day.',
    materials: '7-Metal Brass Alloy (Panchaloha)',
    dimensions: '8" Diameter x 4" Depth',
    weight: '1.4 kg'
  },
  { 
    id: 10, 
    title: 'Soapstone Ganesha', 
    price: 32000, 
    category: 'Stone', 
    image: '/images/10_ganesha.jpg',
    gallery: ['/images/10_ganesha.jpg', '/images/7_swan.jpg', '/images/5_teakwood.jpg'], 
    description: 'Intricately detailed sculpture of Lord Ganesha, the remover of obstacles.',
    longDescription: 'Carved from a solid block of grey soapstone, a material favored by the Hoysala Empire for its ability to hold incredible, jewelry-like detail. Lord Ganesha is depicted here with four arms, holding a modak (sweet), an axe, a noose, and granting a blessing. The softness of the stone allows for micro-carving of his ornaments and crown.',
    keyFeatures: [
      'Hoysala-style micro-detailing on jewelry and crown',
      'Carved from premium grey soapstone',
      'Smooth, polished finish that is cool to the touch'
    ],
    benefits: [
      'Invoke blessings for success and the removal of obstacles',
      'A perfect, auspicious gift for housewarmings or new business ventures',
      'A stunning display of ancient Indian sculptural techniques'
    ],
    placementTips: 'Place in the East or West direction of your home or office, preferably elevated on a pedestal.',
    materials: 'Grey Soapstone',
    dimensions: '16" Height x 10" Width',
    weight: '12.0 kg'
  }
];
