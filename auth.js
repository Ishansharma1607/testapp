
const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user === 'admin') {
    return next();
  } else {
    return res.redirect('/login');
  }
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '12345') {
    req.session.user = 'admin';
    return res.redirect('/app');
  } else {
    return res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = { app, authMiddleware };
