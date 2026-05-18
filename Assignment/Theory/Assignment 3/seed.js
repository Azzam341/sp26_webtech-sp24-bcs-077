const mongoose = require('mongoose');
const Product = require('./models/Products');
const slugify = require('slugify');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');

const products = [
  // ================= ELECTRONICS =================
  {
    name: 'Apple Mac Mini',
    description: 'Compact desktop computer',
    price: 199999,
    category: 'Electronics',
    rating: 4.8,
    stock: 10,
    image: '/assets/apple_mac_mini.jpg'
  },
  {
    name: 'JBL Flip 7',
    description: 'Portable waterproof speaker',
    price: 45999,
    category: 'Electronics',
    rating: 4.5,
    stock: 15,
    image: '/assets/jbl_flip.jpg'
  },
  {
    name: 'JBL Partybox',
    description: 'Wireless party speaker',
    price: 89999,
    category: 'Electronics',
    rating: 4.7,
    stock: 8,
    image: '/assets/jbl_partybox.jpg'
  },
  {
    name: 'Samsung Galaxy Buds',
    description: 'Wireless earbuds',
    price: 29999,
    category: 'Electronics',
    rating: 4.4,
    stock: 25,
    image: '/assets/galaxy_buds.jpg'
  },
  {
    name: 'HP Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 4999,
    category: 'Electronics',
    rating: 4.2,
    stock: 50,
    image: '/assets/hp_mouse.jpg'
  },

  // ================= FASHION =================
  {
    name: 'Nike Air Max',
    description: 'Comfortable running shoes',
    price: 18999,
    category: 'Fashion',
    rating: 4.6,
    stock: 30,
    image: '/assets/nike_air_max.jpg'
  },
  {
    name: 'Adidas Hoodie',
    description: 'Warm cotton hoodie',
    price: 7999,
    category: 'Fashion',
    rating: 4.3,
    stock: 40,
    image: '/assets/adidas_hoodie.jpg'
  },
  {
    name: 'Levi’s Jeans',
    description: 'Slim fit denim jeans',
    price: 6999,
    category: 'Fashion',
    rating: 4.5,
    stock: 35,
    image: '/assets/levis_jeans.jpg'
  },
  {
    name: 'Polo T-Shirt',
    description: 'Casual cotton t-shirt',
    price: 2999,
    category: 'Fashion',
    rating: 4.1,
    stock: 60,
    image: '/assets/polo_tshirt.jpg'
  },
  {
    name: 'Leather Jacket',
    description: 'Stylish black jacket',
    price: 14999,
    category: 'Fashion',
    rating: 4.7,
    stock: 20,
    image: '/assets/leather_jacket.jpg'
  },

  // ================= HOME =================
  {
    name: 'Sofa Set',
    description: 'Comfortable 3-seater sofa',
    price: 54999,
    category: 'Home',
    rating: 4.6,
    stock: 5,
    image: '/assets/sofa.jpg'
  },
  {
    name: 'Dining Table',
    description: 'Wooden 6-chair dining set',
    price: 79999,
    category: 'Home',
    rating: 4.5,
    stock: 7,
    image: '/assets/dining_table.jpg'
  },
  {
    name: 'LED Lamp',
    description: 'Modern desk lamp',
    price: 1999,
    category: 'Home',
    rating: 4.2,
    stock: 100,
    image: '/assets/led_lamp.jpg'
  },
  {
    name: 'Wall Clock',
    description: 'Minimalist wall clock',
    price: 2499,
    category: 'Home',
    rating: 4.3,
    stock: 80,
    image: '/assets/wall_clock.jpg'
  },
  {
    name: 'Kitchen Set',
    description: 'Non-stick cookware set',
    price: 9999,
    category: 'Home',
    rating: 4.4,
    stock: 25,
    image: '/assets/kitchen_set.jpg'
  }
];

async function seedProducts() {
  try {

    await Product.deleteMany({});

    const productsWithSlug = products.map(p => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true })
    }));

    await Product.insertMany(productsWithSlug);

    console.log('15 Products Seeded Successfully');

  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
}

seedProducts();