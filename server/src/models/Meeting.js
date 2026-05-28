import mongoose from 'mongoose';

const actionItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  assignee: { type: String, default: 'Unassigned' },
  dueDate: { type: Date },
  status: { type: String, enum: ['pending', 'in_progress', 'done'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
});

const meetingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  date: { type: Date, default: Date.now },
  rawNotes: { type: String, default: '' },
  summary: { type: String, default: '' },
  actionItems: [actionItemSchema],
  tags: [{ type: String, trim: true, maxlength: 50 }],
  status: { type: String, enum: ['draft', 'processed'], default: 'draft' },
}, { timestamps: true });

export default mongoose.model('Meeting', meetingSchema);
