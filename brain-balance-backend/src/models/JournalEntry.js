import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'bad', 'terrible'],
    required: true,
  },
  tags: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

journalEntrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;