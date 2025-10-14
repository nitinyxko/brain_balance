import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    reminders: {
      type: Boolean,
      default: true,
    },
    reminderTime: {
      type: String,
    },
  },
  streak: {
    current: {
      type: Number,
      default: 0,
    },
    longest: {
      type: Number,
      default: 0,
    },
    lastCheckIn: {
      type: Date,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

export default User;