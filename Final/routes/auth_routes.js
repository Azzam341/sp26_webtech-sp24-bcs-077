const express = require('express');
const router = express.Router();

const User = require('../models/User');

/* REGISTER PAGE */
router.get('/register', (req, res) => {
  res.render('auth/register');
});

/* REGISTER */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await User.create({ name, email, password });
    res.redirect('/login');
  } catch (err) {
    res.send(err.message);
  }
});

/* LOGIN PAGE */
router.get('/login', (req, res) => {
  res.render('auth/login');
});

/* LOGIN */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.send('User not found');

  const isMatch = await user.matchPassword(password);

  if (!isMatch) return res.send('Invalid credentials');

  req.session.user = {
    id: user._id,
    name: user.name,
    role: user.role
  };

  // 🔥 ROLE BASED REDIRECT
  if (user.role === 'admin') {
    return res.redirect('/admin');
  }

  return res.redirect('/');
});

/* LOGOUT */
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;