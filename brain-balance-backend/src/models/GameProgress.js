import mongoose from 'mongoose';

const gameProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  game: {
    type: String,
    required: true,
  },
  highScore: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
  totalPlays: {
    type: Number,
    default: 0,
  },
  history: [{
    score: Number,
    date: {
      type: Date,
      default: Date.now,
    },
    timeSpent: Number,
  }],
  lastPlayed: {
    type: Date,
    default: Date.now,
  },
});

const GameProgress = mongoose.model('GameProgress', gameProgressSchema);

export default GameProgress;