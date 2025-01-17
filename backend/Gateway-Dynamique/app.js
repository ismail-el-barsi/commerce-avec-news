import dotenv from 'dotenv';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

const serviceMap = {
  users: 'http://localhost:3001',
  products: 'http://localhost:3002',
  news: 'http://localhost:3004',  // URL de votre service news
};

app.use('/:service', (req, res, next) => {
  const serviceName = req.params.service;
  const target = serviceMap[serviceName];

  if (target) {
    createProxyMiddleware({
      target,
      changeOrigin: true,
      logLevel: 'debug',
    })(req, res, next);
  } else {
    res.status(502).send(`Service ${serviceName} non disponible.`);
  }
});

const port = process.env.GATEWAY_PORT || 3003;

app.listen(port, () => {
  console.log(`API Gateway démarrée sur http://localhost:${port}`);
});
