const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

// In-memory carts (keyed by userId)
const carts = {};

// Add item to cart
app.post('/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;
  if (!carts[userId]) carts[userId] = [];
  carts[userId].push({ productId, quantity });
  res.json({ message: 'Item added', cart: carts[userId] });
});

// Remove item from cart
app.delete('/cart/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;
  if (carts[userId]) {
    carts[userId] = carts[userId].filter(item => item.productId !== parseInt(productId));
    res.json({ message: 'Item removed', cart: carts[userId] });
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// View cart
app.get('/cart/:userId', (req, res) => {
  const { userId } = req.params;
  res.json(carts[userId] || []);
});

app.listen(port, () => {
  console.log(`Cart Service listening at http://localhost:${port}`);
});