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
    origin: process.env.CLIENT_URL || true,
    credentials: true
  })
);

app.use(express.json());

if (nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Ensure DB connection for every request (Serverless & Direct execution)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

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

// --- Database & Local Server ---
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB()
    .then(() => {
      console.log('Database connected successfully');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Database connection failed:', error.message);
      process.exit(1);
    });
}

// --- Export App ---
module.exports = app;