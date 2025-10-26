// backend/src/index.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/communities', communityRoutes);

// HTTP server for Socket.IO
const server = createServer(app);

// ⚡ Named export here
export const ioInstance = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Example connection
ioInstance.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
});

// MongoDB + server start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
