const express = require('express');
const app = express();
const port = 3002;

app.use(express.json());

// In-memory orders
const orders = [];

// Create order
app.post('/orders', (req, res) => {
  const { userId, items } = req.body;
  const orderId = orders.length + 1;
  orders.push({ orderId, userId, items, status: 'pending' });
  res.json({ message: 'Order created', orderId });
});

// View order
app.get('/orders/:orderId', (req, res) => {
  const order = orders.find(o => o.orderId === parseInt(req.params.orderId));
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.listen(port, () => {
  console.log(`Order Service listening at http://localhost:${port}`);
});