
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { app: authApp, authMiddleware } = require('./auth');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authApp);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/app', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.post('/save-text', authMiddleware, (req, res) => {
  const { text } = req.body;
  const stmt = db.prepare('INSERT INTO user_text (text_content) VALUES (?)');
  stmt.run(text);
  res.json({ success: true });
});

app.get('/load-text', authMiddleware, (req, res) => {
  const row = db.prepare('SELECT text_content FROM user_text ORDER BY id DESC LIMIT 1').get();
  res.json({ text: row ? row.text_content : '' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
