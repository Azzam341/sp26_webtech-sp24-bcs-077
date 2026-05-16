const express = require('express');
const router = express.Router();

const Product = require('../models/Products');
const upload = require('../middleware/upload');

/* =========================
   ADMIN DASHBOARD
========================= */
router.get('/admin', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render('admin/dashboard', { products });
});

/* =========================
   ADD PRODUCT PAGE
========================= */
router.get('/admin/add', (req, res) => {
  res.render('admin/add_product');
});

/* CREATE PRODUCT */
router.post(
  '/admin/add',
  upload.single('image'),
  async (req, res) => {
    console.log("MULTER PASSED");

    try {
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      const { name, description, price, category, stock } = req.body;

      const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        image: req.file ? '/uploads/' + req.file.filename : '/uploads/default.png'
      });

      console.log("PRODUCT SAVED:", product);

      res.redirect('/admin');

    } catch (err) {
      console.log("ERROR HERE:", err);
      res.status(500).send(err.message);
    }
  }
);
/* =========================
   EDIT PAGE
========================= */
router.get('/admin/edit/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('admin/edit_product', { product });
});

/* UPDATE PRODUCT */
router.post('/admin/edit/:id', upload.single('image'), async (req, res) => {
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
});

/* =========================
   DELETE PRODUCT
========================= */
router.get('/admin/delete/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

module.exports = router;