import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, ListTodo, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMeetings } from '@/hooks/useMeetings';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const statIcons = [Calendar, ListTodo, CheckCircle2, Clock];
const statColors = ['from-primary to-primary/60', 'from-accent to-accent/60', 'from-success to-success/60', 'from-warning to-warning/60'];

function StatCard({ label, value, index }) {
  const Icon = statIcons[index];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card-hover p-5 group"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-text-muted text-xs font-medium uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${statColors[index]} flex items-center justify-center opacity-80`}>
          <Icon size={14} className="text-white" />
        </div>
      </div>
      <p className="font-heading font-700 text-3xl text-text">{value}</p>
    </motion.div>
  );
}

function MeetingRow({ meeting, index }) {
  const date = new Date(meeting.date || meeting.createdAt);
  const statusColor = meeting.status === 'processed'
    ? 'bg-accent/20 text-accent'
    : 'bg-warning/20 text-warning';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.06 }}
    >
      <Link
        to={`/meetings/${meeting._id}`}
        className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 transition-colors group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0">
          <Calendar size={16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text truncate">{meeting.title}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {meeting.actionItems?.length ? ` · ${meeting.actionItems.length} actions` : ''}
          </p>
        </div>
        <span className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${statusColor}`}>
          {meeting.status === 'processed' ? 'Processed' : 'Draft'}
        </span>
        <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { meetings, loading, stats } = useMeetings();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const recent = meetings.slice(0, 5);

  return (
    <>
      <Header title="Dashboard" />
      <PageWrapper>
        {/* Greeting */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading font-700 text-2xl text-text mb-1"
            >
              {greeting}, {user?.name?.split(' ')[0]}
            </motion.h2>
            <p className="text-text-muted text-sm">Here's what's on your plate today.</p>
          </div>
          <Link to="/meetings" state={{ openNew: true }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} /> New Meeting
            </motion.button>
          </Link>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Meetings', value: stats.total },
                { label: 'Action Items', value: stats.actionItems },
                { label: 'Completed', value: stats.completed },
                { label: 'Pending', value: stats.pending },
              ].map((s, i) => (
                <StatCard key={s.label} {...s} index={i} />
              ))}
            </div>

            {/* Recent Meetings */}
            <div className="glass-card overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <h3 className="font-heading font-700 text-base text-text">Recent Meetings</h3>
                {meetings.length > 5 && (
                  <Link to="/meetings" className="text-xs text-primary hover:underline">View all</Link>
                )}
              </div>

              {recent.length === 0 ? (
                <div className="flex flex-col items-center py-12 px-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-4">
                    <Sparkles size={22} className="text-primary" />
                  </div>
                  <p className="text-text-muted text-sm mb-1">No meetings yet</p>
                  <p className="text-text-muted/60 text-xs">Create your first meeting to get started</p>
                </div>
              ) : (
                <div className="px-2 pb-3">
                  {recent.map((m, i) => <MeetingRow key={m._id} meeting={m} index={i} />)}
                </div>
              )}
            </div>
          </>
        )}
      </PageWrapper>
    </>
  );
}
