const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const Product = require('./models/Products');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {

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

    // Search Filter
    if (search) {

      query.name = {
        $regex: search,
        $options: 'i'
      };

    }

    // Category Filter
    if (category) {

      query.category = category;

    }

    // Price Filter
    query.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice)
    };

    // Fetch Products
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);

    // Count Products
    const totalProducts = await Product.countDocuments(query);

    // Total Pages
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

    console.log(error);

    res.send('Server Error');

  }

});

app.listen(3000, () => {
  console.log('Server Running On Port 3000');
});