import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import communityRoutes from './routes/community.js';
import { setIO } from './controllers/CommunityController.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// pass io to controller
setIO(io);

app.use(cors());
app.use(bodyParser.json());

// simple auth middleware for testing (replace with real auth)
app.use((req, res, next) => {
  // This is a fake user for testing — replace with real auth logic
  req.user = { _id: '000000000000000000000001', name: 'Test User' };
  next();
});

app.use('/api/communities', communityRoutes);

// socket.io connection
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('joinCommunity', (communityId) => {
    socket.join(communityId);
    console.log(`Socket ${socket.id} joined community ${communityId}`);
  });

  socket.on('leaveCommunity', (communityId) => {
    socket.leave(communityId);
    console.log(`Socket ${socket.id} left community ${communityId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// MongoDB connection (use env or fallback)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/brainbalance';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
