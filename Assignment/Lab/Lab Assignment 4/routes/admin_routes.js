const express = require('express');
const router = express.Router();

const Product = require('../models/Products');
const upload = require('../middleware/upload');
const { isAdmin } = require('../middleware/auth');

/* =========================
   ADMIN DASHBOARD
========================= */
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('admin/dashboard', { products });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

/* =========================
   ADD PRODUCT PAGE
========================= */
router.get('/admin/add', isAdmin, (req, res) => {
  res.render('admin/add_product');
});

/* =========================
   CREATE PRODUCT
========================= */
router.post('/admin/add', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).send('Required fields missing');
    }

    await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: req.file
        ? '/uploads/' + req.file.filename
        : '/uploads/default.png'
    });

    res.redirect('/admin');

  } catch (err) {
    console.log('CREATE ERROR:', err);
    res.status(500).send(err.message);
  }
});

/* =========================
   EDIT PRODUCT PAGE
========================= */
router.get('/admin/edit/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.render('admin/edit_product', { product });

  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

/* =========================
   UPDATE PRODUCT
========================= */
router.post('/admin/edit/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    let updateData = {
      name,
      description,
      price,
      category,
      stock
    };

    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);

    res.redirect('/admin');

  } catch (err) {
    console.log('UPDATE ERROR:', err);
    res.status(500).send(err.message);
  }
});

/* =========================
   DELETE PRODUCT
========================= */
router.get('/admin/delete/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    console.log('DELETE ERROR:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;