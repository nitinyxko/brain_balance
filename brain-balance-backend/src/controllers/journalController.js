import JournalEntry from '../models/JournalEntry.js';

export const createEntry = async (req, res) => {
  try {
    const entry = new JournalEntry({
      ...req.body,
      user: req.user._id,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};