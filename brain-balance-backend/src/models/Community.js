import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  posts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Community = mongoose.model('Community', communitySchema);

export default Community;