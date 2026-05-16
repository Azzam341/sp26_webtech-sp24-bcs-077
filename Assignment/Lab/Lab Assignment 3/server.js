const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const Product = require('./models/Products');
const adminRoutes = require('./routes/admin_routes');

const app = express();

/* ========================
   DATABASE CONNECTION
======================== */
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Error:', err));

/* ========================
   VIEW ENGINE
======================== */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ========================
   MIDDLEWARES
======================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

/* ========================
   ADMIN ROUTES
======================== */
app.use('/', adminRoutes);

/* ========================
   HOME / PRODUCTS PAGE
======================== */
app.get('/', async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    // Filters
    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || 999999999;

    // Query object
    let query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: 'i'
      };
    }

    if (category) {
      query.category = category;
    }

    query.price = {
      $gte: minPrice,
      $lte: maxPrice
    };

    // Fetch products
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);

    // Count for pagination
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('admin/dashboard', {
      products,
      currentPage: page,
      totalPages,
      search,
      category,
      minPrice,
      maxPrice
    });

  } catch (error) {
    console.log('Server Error:', error);
    res.status(500).send('Server Error');
  }
});

/* ========================
   START SERVER
======================== */
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});