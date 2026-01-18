const express = require('express');
const cors = require('cors');
const articlesRoutes = require('./routes/articlesRoutes');
const articlesController = require('./controllers/articlesController');
const errorHandler = require('./middleware/errorHandler');
const CONSTANTS = require('./config/constants');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/health', (req, res) => articlesController.healthCheck(req, res));
app.use('/api/articles', articlesRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(CONSTANTS.PORT, () => {
  console.log(`Server is running on port ${CONSTANTS.PORT}`);
  console.log(`Health check: http://localhost:${CONSTANTS.PORT}/health`);
  console.log(`API endpoint: http://localhost:${CONSTANTS.PORT}/api/articles/search`);
});
