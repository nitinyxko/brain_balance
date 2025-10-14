import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'avatar', 'preferences'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const user = req.user;
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const me = async (req, res) => {
  try {
    // Remove password from response
    const userResponse = req.user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateStreak = async (req, res) => {
  try {
    const user = req.user;
    const now = new Date();
    const lastCheckIn = user.streak.lastCheckIn;

    if (lastCheckIn) {
      const timeDiff = now.getTime() - lastCheckIn.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Consecutive day
        user.streak.current += 1;
        user.streak.longest = Math.max(user.streak.current, user.streak.longest);
      } else if (daysDiff > 1) {
        // Streak broken
        user.streak.current = 1;
      }
    } else {
      // First check-in
      user.streak.current = 1;
      user.streak.longest = 1;
    }

    user.streak.lastCheckIn = now;
    await user.save();

    res.json({ streak: user.streak });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};