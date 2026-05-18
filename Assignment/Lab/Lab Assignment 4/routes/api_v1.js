const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const Product = require('../models/Products');
const User = require('../models/User');

const verifyToken = require('../middleware/verifyToken');

/* =========================
   AUTH LOGIN (JWT)
========================= */
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      message: 'Login successful',
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   PUBLIC: GET PRODUCTS
========================= */
router.get('/products', async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   PUBLIC: GET PRODUCT BY ID
========================= */
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   PROTECTED: USER PROFILE
========================= */
router.get('/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   PROTECTED: CREATE ORDER (basic placeholder)
========================= */
router.post('/orders', verifyToken, async (req, res) => {
  try {
    res.json({
      message: 'Order placed successfully',
      userId: req.user.id
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;