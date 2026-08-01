const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  dimensions: {
    type: String,
  },
  weight: {
    type: String,
  },
  description: {
    type: String,
  },
  story: {
    type: String,
  },
  craftsmanship: {
    type: String,
  },
  image: {
    type: String, // URL to primary image
    required: true,
  },
  gallery: [{
    type: String, // URLs to additional images
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
