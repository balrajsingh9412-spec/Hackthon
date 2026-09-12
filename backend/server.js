const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Policy
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
);

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
