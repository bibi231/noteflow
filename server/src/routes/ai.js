import express from 'express';
import Meeting from '../models/Meeting.js';
import { protect } from '../middleware/auth.js';
import { summarizeMeeting, extractActionItems } from '../services/aiService.js';

const router = express.Router();
router.use(protect);

router.post('/summarize', async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.body.meetingId, userId: req.user._id });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (!meeting.rawNotes) return res.status(400).json({ message: 'No notes to summarize' });

    const summary = await summarizeMeeting(meeting.rawNotes);
    meeting.summary = summary;
    meeting.status = 'processed';
    await meeting.save();
    res.json({ summary });
  } catch (err) { next(err); }
});

router.post('/extract', async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.body.meetingId, userId: req.user._id });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (!meeting.rawNotes) return res.status(400).json({ message: 'No notes to extract from' });

    const items = await extractActionItems(meeting.rawNotes);
    meeting.actionItems = items.map(item => ({
      text: item.text,
      assignee: item.assignee || 'Unassigned',
      priority: item.priority || 'medium',
      dueDate: item.suggestedDueDate ? new Date(item.suggestedDueDate) : undefined,
      status: 'pending',
    }));
    meeting.status = 'processed';
    await meeting.save();
    res.json({ actionItems: meeting.actionItems });
  } catch (err) { next(err); }
});

export default router;
