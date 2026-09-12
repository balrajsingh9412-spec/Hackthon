const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Security Headers Middleware
app.use(helmet({
  contentSecurityPolicy: false // Disabled for dev flexibility, headers enabled
}));

// Rate Limiter for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Allow high threshold for load testing & safety
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
  }
});

// General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false
});

// Body Parser Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// CORS Policy
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
);

// Apply Rate Limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'LifeQuest RPG API Server',
    timestamp: new Date()
  });
});

// Route Handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/character', require('./routes/characterRoutes'));
app.use('/api/shop', require('./routes/shopRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`⚔️ LifeQuest RPG Server running on port ${PORT}`);
  });
});
