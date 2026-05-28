import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Sparkles, ListChecks, Save, Trash2, CheckCircle2,
  Circle, Clock, Tag, Calendar, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { useMeeting } from '@/hooks/useMeetings';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import api from '@/lib/api';

const priorityStyles = {
  high: 'text-error bg-error/10 border-error/20',
  medium: 'text-warning bg-warning/10 border-warning/20',
  low: 'text-accent bg-accent/10 border-accent/20',
};

const statusIcons = {
  done: <CheckCircle2 size={16} className="text-success" />,
  in_progress: <Clock size={16} className="text-warning" />,
  pending: <Circle size={16} className="text-text-muted" />,
};

function ActionItem({ item, index, onToggle }) {
  const nextStatus = { pending: 'in_progress', in_progress: 'done', done: 'pending' };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`flex items-start gap-3 p-3.5 rounded-xl hover:bg-white/5 transition-all duration-200 group ${item.status === 'done' ? 'opacity-50' : ''}`}
    >
      <button
        onClick={() => onToggle(index, nextStatus[item.status])}
        className="mt-0.5 shrink-0 hover:scale-110 transition-transform"
      >
        {statusIcons[item.status]}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm text-text leading-relaxed ${item.status === 'done' ? 'line-through' : ''}`}>{item.text}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {item.assignee && item.assignee !== 'Unassigned' && (
            <span className="text-[10px] text-text-muted bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">{item.assignee}</span>
          )}
          {item.priority && (
            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${priorityStyles[item.priority]}`}>
              {item.priority}
            </span>
          )}
          {item.dueDate && (
            <span className="text-[10px] text-text-muted flex items-center gap-1">
              <Calendar size={9} />
              {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MeetingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { meeting, loading, aiLoading, update, summarize, extractActions, toggleActionItem } = useMeeting(id);
  const [notes, setNotes] = useState('');
  const [notesEdited, setNotesEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (meeting && !notesEdited && notes !== (meeting.rawNotes || '')) {
    setNotes(meeting.rawNotes || '');
  }

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await update({ rawNotes: notes });
      setNotesEdited(false);
      toast.success('Notes saved');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleSummarize = async () => {
    if (!meeting.rawNotes?.trim()) return toast.error('Add notes first');
    try { await summarize(); toast.success('Summary generated'); }
    catch (err) { toast.error(err.message); }
  };

  const handleExtract = async () => {
    if (!meeting.rawNotes?.trim()) return toast.error('Add notes first');
    try { await extractActions(); toast.success('Action items extracted'); }
    catch (err) { toast.error(err.message); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this meeting permanently?')) return;
    setDeleting(true);
    try {
      await api.delete(`/meetings/${id}`);
      toast.success('Meeting deleted');
      navigate('/meetings');
    } catch (err) { toast.error(err.message); }
  };

  const handleToggle = async (index, status) => {
    try { await toggleActionItem(index, status); }
    catch (err) { toast.error(err.message); }
  };

  if (loading) {
    return (
      <>
        <Header title="Meeting" />
        <PageWrapper><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></PageWrapper>
      </>
    );
  }

  if (!meeting) {
    return (
      <>
        <Header title="Meeting" />
        <PageWrapper>
          <div className="flex flex-col items-center py-20">
            <p className="text-text-muted text-sm">Meeting not found.</p>
            <button onClick={() => navigate('/meetings')} className="btn-ghost mt-3 text-sm">Go back</button>
          </div>
        </PageWrapper>
      </>
    );
  }

  const date = new Date(meeting.date || meeting.createdAt);
  const doneCount = meeting.actionItems?.filter(a => a.status === 'done').length || 0;
  const totalActions = meeting.actionItems?.length || 0;
  const progressPct = totalActions ? Math.round((doneCount / totalActions) * 100) : 0;

  return (
    <>
      <Header title={meeting.title} />
      <PageWrapper>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/meetings')} className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted flex items-center gap-1.5">
              <Calendar size={12} />
              {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {meeting.tags?.length > 0 && meeting.tags.map(tag => (
              <span key={tag} className="text-[10px] font-medium text-text-muted bg-white/5 border border-white/5 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Tag size={8} /> {tag}
              </span>
            ))}
            <button onClick={handleDelete} disabled={deleting} className="text-text-muted hover:text-error p-1.5 rounded-lg hover:bg-error/10 transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Notes */}
          <div className="glass-card flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/5">
              <h3 className="font-heading font-600 text-sm text-text">Meeting Notes</h3>
              {notesEdited && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Save size={12} /> {saving ? 'Saving...' : 'Save'}
                </motion.button>
              )}
            </div>
            <textarea
              value={notes}
              onChange={e => { setNotes(e.target.value); setNotesEdited(true); }}
              placeholder="Paste or type your meeting notes here..."
              className="flex-1 min-h-[360px] bg-transparent text-sm text-text placeholder-text-muted p-5 resize-none focus:outline-none font-mono leading-relaxed"
            />
          </div>

          {/* Right: AI Output */}
          <div className="flex flex-col gap-4">
            {/* AI Action buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSummarize}
                disabled={aiLoading}
                className="flex-1 glass-card-hover px-4 py-3.5 flex items-center justify-center gap-2 text-sm font-medium text-text disabled:opacity-50"
              >
                {aiLoading ? <LoadingSpinner size="sm" /> : <Sparkles size={16} className="text-primary" />}
                Summarize
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExtract}
                disabled={aiLoading}
                className="flex-1 glass-card-hover px-4 py-3.5 flex items-center justify-center gap-2 text-sm font-medium text-text disabled:opacity-50"
              >
                {aiLoading ? <LoadingSpinner size="sm" /> : <ListChecks size={16} className="text-accent" />}
                Extract Actions
              </motion.button>
            </div>

            {/* Summary */}
            {meeting.summary && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={13} className="text-primary" />
                  <h4 className="font-heading font-600 text-xs text-text-muted uppercase tracking-wider">AI Summary</h4>
                </div>
                <div className="text-sm text-text leading-relaxed whitespace-pre-wrap">{meeting.summary}</div>
              </motion.div>
            )}

            {/* Action Items */}
            {totalActions > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
              >
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <ListChecks size={13} className="text-accent" />
                    <h4 className="font-heading font-600 text-xs text-text-muted uppercase tracking-wider">Action Items</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted">{doneCount}/{totalActions}</span>
                    <span className="text-[10px] font-medium text-primary">{progressPct}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-5 pt-3">
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </div>

                <div className="p-2">
                  {meeting.actionItems.map((item, i) => (
                    <ActionItem key={i} item={item} index={i} onToggle={handleToggle} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty state */}
            {!meeting.summary && totalActions === 0 && (
              <div className="glass-card flex flex-col items-center py-14">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-4">
                  <Sparkles size={22} className="text-primary" />
                </div>
                <p className="text-text-muted text-sm mb-1">No AI output yet</p>
                <p className="text-text-muted/60 text-xs">Add notes, then click Summarize or Extract Actions</p>
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
