# E-Commerce Platform with Microservices

## Overview

This project demonstrates a microservices-based e-commerce platform built from scratch using:

- Node.js + Express microservices

- Docker for containerization

- Kubernetes for orchestration

- Helm for packaging services

- ArgoCD for GitOps continuous delivery

- Kong as API Gateway (Ingress controller)

I will build everything locally, push Docker images, deploy to a Kubernetes cluster, and expose services through Kong.


## Task 1: Project Setup

### 1. create the main project directory:
```bash
mkdir ecommerce-platform2
cd ecommerce-platform2
```

### 2. Create subdirectories for each microservice:
```bash
mkdir product-service
mkdir cart-service
mkdir order-service
```


## Task 2: Create and Initialize Git Repository:
### 1. Initialize a Git repository in the main directory:

```bash
git init
git checkout -b main
```

### 2. Create a .gitignore file to ignore unnecessary files:
```bash
echo "node_modules/
.env
*.log" > .gitignore
```


## Task 3: Version Control
1. Add the initial structure to Git:
```bash
git add .
```

2. Commit the changes:
```bash
git commit -m "Initial project structure"
```


## Task 4: Dockerize Microservices

For each microservice, I will:

- Create a basic Node.js/Express app with the required APIs.
- Add a package.json and install dependencies.
- Create a Dockerfile to containerize it.


I will Start by installing Express in each service directory. I will use in-memory arrays for data (e.g., products list).


## Product Service (Manages product information: API to list and view products)

1. Navigate to the directory:
```bash
cd product-service
```

2. Initialize Node.js project:
```bash
npm init -y
```

3. Install Express:
```bash
npm install express
```

4. Create index.js with basic API:
```bash
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
```

5. Create Dockerfile:
```bash
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

6. Return to main directory:
```bash
cd ..
```

## Cart Service (Handles user shopping carts: API to add/remove items)

1. Navigate:
```bash
cd cart-service
```

2. Initialize:
```bash
npm init -y
```

3. Install Express:
```bash
npm install express
```

4. Create index.js:
```bash
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
```

5. Create Dockerfile (port 3001):
```bash
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
```

6. Return:
```bash
cd ..
```

## Order Service (Manages order processing: API to create and view orders)

1. Navigate:
```bash
cd order-service
```

2. Initialize:
```bash
npm init -y
```

3. Install Express:
```
npm install express
```

4. Create index.js:
```bash
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
```

5. Create Dockerfile (port 3002):
```bash
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["node", "index.js"]
```


6. Return:
```bash
cd ..
```

7. Commit changes to Git:
```bash
git add .
git commit -m "Added microservices implementations and Dockerfiles"
```


## Task 5: Push to Docker Hub

1.Log in to Docker Hub via terminal (replace with your credentials):

```bash
docker login
```

2. Build and push each image (replace yourusername with your Docker Hub username, and tag with v1 for version):

- Product:
```bash
cd product-service
docker build -t yourusername/product-service:v1 .
docker push yourusername/product-service:v1
cd ..
```

## Cart:
```bash
cd cart-service
docker build -t yourusername/cart-service:v1 .
docker push yourusername/cart-service:v1
cd ..
```

## Order:
```bash
cd order-service
docker build -t yourusername/order-service:v1 .
docker push yourusername/order-service:v1
cd ..
```

## Commit any changes: