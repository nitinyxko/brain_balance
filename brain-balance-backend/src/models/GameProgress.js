import mongoose from 'mongoose';

const gameProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to your User model
      required: true,
    },
    game: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
    },
    timeSpent: {
      type: Number, // time in seconds (optional)
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const GameProgress = mongoose.model('GameProgress', gameProgressSchema);

export default GameProgress;
