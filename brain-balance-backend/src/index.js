import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/communities', communityRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on:`);
      console.log(`- Local: http://localhost:${PORT}`);
      console.log(`- Network: http://192.168.29.221:${PORT}`);
      console.log('You can access the API endpoints from Expo Go using the Network address');
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });