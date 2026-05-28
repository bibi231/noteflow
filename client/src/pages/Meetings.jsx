import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Calendar, Grid3X3, List, Trash2, X, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useMeetings } from '@/hooks/useMeetings';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function NewMeetingModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        date,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });
      toast.success('Meeting created');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="glass-card w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-700 text-lg text-text">New Meeting</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Weekly standup, Product review..."
              className="input-field"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">Tags (comma separated)</label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="product, engineering, weekly"
              className="input-field"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-text-muted text-sm hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 text-sm">
              {submitting ? 'Creating...' : 'Create Meeting'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function MeetingCard({ meeting, onDelete }) {
  const date = new Date(meeting.date || meeting.createdAt);
  const statusColor = meeting.status === 'processed' ? 'bg-accent/20 text-accent' : 'bg-warning/20 text-warning';
  const actions = meeting.actionItems?.length || 0;
  const done = meeting.actionItems?.filter(a => a.status === 'done').length || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card-hover group"
    >
      <Link to={`/meetings/${meeting._id}`} className="block p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-heading font-600 text-sm text-text truncate pr-3">{meeting.title}</h3>
          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0 ${statusColor}`}>
            {meeting.status === 'processed' ? 'Processed' : 'Draft'}
          </span>
        </div>

        {meeting.summary && (
          <p className="text-xs text-text-muted line-clamp-2 mb-3">{meeting.summary}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1"><Calendar size={12} /> {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          {actions > 0 && <span>{done}/{actions} done</span>}
          {meeting.tags?.length > 0 && (
            <span className="flex items-center gap-1"><Tag size={10} /> {meeting.tags[0]}</span>
          )}
        </div>
      </Link>

      <div className="px-5 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.preventDefault(); onDelete(meeting._id); }}
          className="text-xs text-text-muted hover:text-error flex items-center gap-1 transition-colors"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </motion.div>
  );
}

export default function Meetings() {
  const location = useLocation();
  const { meetings, loading, createMeeting, deleteMeeting } = useMeetings();
  const [showNew, setShowNew] = useState(!!location.state?.openNew);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | draft | processed
  const [view, setView] = useState('grid');

  const filtered = useMemo(() => {
    let result = meetings;
    if (search) result = result.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
    if (filter !== 'all') result = result.filter(m => m.status === filter);
    return result;
  }, [meetings, search, filter]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this meeting?')) return;
    try {
      await deleteMeeting(id);
      toast.success('Meeting deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Header title="Meetings" />
      <PageWrapper>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search meetings..."
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'draft', 'processed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors capitalize ${
                  filter === f ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}

            <div className="w-px h-6 bg-border mx-1" />

            <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg ${view === 'grid' ? 'text-primary' : 'text-text-muted'}`}>
              <Grid3X3 size={16} />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-lg ${view === 'list' ? 'text-primary' : 'text-text-muted'}`}>
              <List size={16} />
            </button>

            <div className="w-px h-6 bg-border mx-1" />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowNew(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} /> New
            </motion.button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-4">
              <Calendar size={24} className="text-primary" />
            </div>
            <p className="text-text-muted text-sm mb-1">
              {search || filter !== 'all' ? 'No meetings match your filters' : 'No meetings yet'}
            </p>
            <p className="text-text-muted/60 text-xs mb-4">
              {search || filter !== 'all' ? 'Try adjusting your search' : 'Create your first meeting to get started'}
            </p>
            {!search && filter === 'all' && (
              <button onClick={() => setShowNew(true)} className="btn-primary text-sm flex items-center gap-2">
                <Plus size={14} /> Create Meeting
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map(m => <MeetingCard key={m._id} meeting={m} onDelete={handleDelete} />)}
            </AnimatePresence>
          </motion.div>
        )}

        {/* New Meeting Modal */}
        <AnimatePresence>
          {showNew && <NewMeetingModal onClose={() => setShowNew(false)} onCreate={createMeeting} />}
        </AnimatePresence>
      </PageWrapper>
    </>
  );
}
