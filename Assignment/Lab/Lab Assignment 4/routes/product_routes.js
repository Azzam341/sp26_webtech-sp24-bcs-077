const express = require('express');
const router = express.Router();

const Product = require('../models/Products');

router.get('/products', async (req, res) => {

  try {

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    // Filters
    const search = req.query.search || '';
    const category = req.query.category || '';

    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 999999999;

    // Query Object
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

    // Price Range
    query.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice)
    };

    // Fetch Products
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);

    // Total Products
    const totalProducts = await Product.countDocuments(query);

    // Total Pages
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('products', {
      products,
      currentPage: page,
      totalPages,
      search,
      category,
      minPrice,
      maxPrice
    });

  } catch (error) {

    console.log(error);
    res.send('Server Error');

  }

});

module.exports = router;