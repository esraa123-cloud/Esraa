require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { port, nodeEnv, clientUrl } = require('./config/config');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const swapRoutes = require('./routes/swapRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// --- Middleware ---
const allowedOrigins = clientUrl.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json());
if (nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Skill Swap API is running', env: nodeEnv });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/chats', chatRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

// --- Start server ---
const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Skill Swap API listening on port ${port} [${nodeEnv}]`);
  });
};

start();

module.exports = app;
