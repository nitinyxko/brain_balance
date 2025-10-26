import  GameProgress from '../models/GameProgress.js';


export const saveGameProgress = async (req, res) => {
  try {
    const { game, score, timeSpent } = req.body;
    const userId = req.user._id;

    let gameProgress = await GameProgress.findOne({ user: userId, game });

    if (gameProgress) {
      // Update existing progress
      const newTotalPlays = gameProgress.totalPlays + 1;
      const newAverageScore = (gameProgress.averageScore * gameProgress.totalPlays + score) / newTotalPlays;

      gameProgress.highScore = Math.max(gameProgress.highScore, score);
      gameProgress.averageScore = newAverageScore;
      gameProgress.totalPlays = newTotalPlays;
      gameProgress.lastPlayed = new Date();
      gameProgress.history.push({ score, timeSpent });
    } else {
      // Create new progress
      gameProgress = new GameProgress({
        user: userId,
        game,
        highScore: score,
        averageScore: score,
        totalPlays: 1,
        history: [{ score, timeSpent }],
      });
    }

    await gameProgress.save();
    res.json(gameProgress);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getGameProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { game } = req.params;

    const gameProgress = await GameProgress.findOne({ user: userId, game });
    if (!gameProgress) {
      return res.status(404).json({ error: 'No progress found' });
    }

    res.json(gameProgress);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllGameProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const progress = await GameProgress.find({ user: userId });
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};