require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { nodeEnv } = require('./config/config');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const swapRoutes = require('./routes/swapRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());

if (nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Skill Swap API is running',
    env: nodeEnv
  });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/chats', chatRoutes);

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

// --- Database ---
connectDB()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
  });

// --- Export App ---
module.exports = app;