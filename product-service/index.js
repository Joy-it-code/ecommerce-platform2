const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory products
const products = [
  { id: 1, name: 'Product A', price: 10 },
  { id: 2, name: 'Product B', price: 20 },
];

// List all products
app.get('/products', (req, res) => {
  res.json(products);
});

// View single product
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.listen(port, () => {
  console.log(`Product Service listening at http://localhost:${port}`);
});