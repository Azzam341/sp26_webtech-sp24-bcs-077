const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const Product = require('./models/Products');

const adminRoutes = require('./routes/admin_routes');
const authRoutes = require('./routes/auth_routes');

const app = express();

/* =========================
   DATABASE CONNECTION
========================= */
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Error:', err));

/* =========================
   VIEW ENGINE
========================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* =========================
   MIDDLEWARES
========================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   SESSION (FIXED VERSION)
   ❗ IMPORTANT: NO MongoStore.create()
========================= */
app.use(session({
  secret: 'ecommerceSecretKey',
  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/ecommerce'
  }),

  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

/* =========================
   GLOBAL USER FOR EJS
========================= */
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

/* =========================
   ROUTES
========================= */
app.use('/', authRoutes);
app.use('/', adminRoutes);

/* =========================
   HOME PAGE (PRODUCT LISTING)
========================= */
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
    const maxPrice = Number(req.query.maxPrice) || 99999;

    let query = {};

    // Search
    if (search) {
      query.name = {
        $regex: search,
        $options: 'i'
      };
    }

    // Category
    if (category) {
      query.category = category;
    }

    // Price
    query.price = {
      $gte: minPrice,
      $lte: maxPrice
    };

    // Fetch products
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);

    // Pagination count
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    

    res.render('home', {
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

/* =========================
   START SERVER
========================= */
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});