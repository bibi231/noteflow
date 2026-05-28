import express from 'express';
import Meeting from '../models/Meeting.js';
import { protect } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimit.js';

const router = express.Router();
router.use(protect, apiLimiter);

router.get('/', async (req, res, next) => {
  try {
    const meetings = await Meeting.find({ userId: req.user._id })
      .sort({ date: -1 })
      .select('-rawNotes');
    res.json({ meetings });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, date, rawNotes, tags } = req.body;
    const meeting = await Meeting.create({ userId: req.user._id, title, date, rawNotes, tags });
    res.status(201).json({ meeting });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, userId: req.user._id });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json({ meeting });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json({ meeting });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const meeting = await Meeting.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

export default router;
