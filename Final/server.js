require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const Product = require('./models/Products');

const adminRoutes = require('./routes/admin_routes');
const authRoutes = require('./routes/auth_routes');

/* =========================
   NEW: API ROUTES (JWT)
========================= */
const apiRoutes = require('./routes/api_v1');

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
   SESSION (EXISTING SYSTEM)
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
   ROUTES (EJS SYSTEM)
========================= */
app.use('/', authRoutes);
app.use('/', adminRoutes);

/* =========================
   NEW: JWT API SYSTEM
========================= */
app.use('/api/v1', apiRoutes);

/* =========================
   HOME PAGE (EJS FRONTEND)
========================= */
app.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || 99999;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    query.price = {
      $gte: minPrice,
      $lte: maxPrice
    };

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);

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