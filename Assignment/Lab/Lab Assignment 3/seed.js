const mongoose = require('mongoose');
const Product = require('./models/Products');



const products = [

  {
    name: 'Apple Mac Mini',
    description: 'Compact desktop computer',
    price: 199999,
    category: 'Electronics',
    rating: 4.8,
    stock: 10,
    image: '/assets/apple_mac_mini_2024_2_-_tejar.jpg'
  },

  {
    name: 'JBL Flip 7',
    description: 'Portable waterproof speaker',
    price: 45999,
    category: 'Electronics',
    rating: 4.5,
    stock: 15,
    image: '/assets/jbl_flip_7_portable_waterproof_speaker4_-_tejar.jpg'
  },

  {
    name: 'JBL Partybox',
    description: 'Wireless party speaker',
    price: 89999,
    category: 'Electronics',
    rating: 4.7,
    stock: 8,
    image: '/assets/jbl_partybox_stage_320_wireless_speaker2-tejar.jpg'
  },

  {
    name: 'Spectrum Battery',
    description: 'High performance battery',
    price: 25999,
    category: 'Electronics',
    rating: 4.2,
    stock: 20,
    image: '/assets/spektrum_7000mah_6s_22.2v_smart_g2_lipo_30c_ic5_battery_-_tejar.jpg'
  }

];


seedProducts();