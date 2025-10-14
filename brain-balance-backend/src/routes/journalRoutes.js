import express from 'express';
import * as journalController from '../controllers/journalController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // All journal routes require authentication

router.post('/entries', journalController.createEntry);
router.get('/entries', journalController.getEntries);
router.get('/entries/:id', journalController.getEntry);
router.patch('/entries/:id', journalController.updateEntry);
router.delete('/entries/:id', journalController.deleteEntry);

export default router;