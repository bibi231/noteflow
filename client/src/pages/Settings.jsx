import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, Shield, Sparkles, Crown, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';

function Section({ icon: Icon, title, description, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 mb-6 overflow-hidden relative"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-700 text-sm text-text">{title}</h3>
          {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['5 meetings/month', 'AI summaries', 'Basic action items'],
    current: true,
  },
  {
    name: 'Pro',
    price: '$12',
    features: ['Unlimited meetings', 'Priority AI', 'Advanced analytics', 'Export & integrations'],
    highlight: true,
  },
  {
    name: 'Team',
    price: '$29',
    features: ['Everything in Pro', 'Team workspace', 'Admin controls', 'SSO & audit log'],
  },
];

export default function Settings() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/me', { name, email });
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) return toast.error('Passwords do not match');
    if (newPw.length < 6) return toast.error('Password must be at least 6 characters');
    setChangingPw(true);
    try {
      await api.put('/auth/password', { currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <>
      <Header title="Settings" />
      <PageWrapper>
        <div className="max-w-2xl">
          {/* Profile Avatar + Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/20">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading font-700 text-xl text-text">{user?.name}</h2>
              <p className="text-sm text-text-muted">{user?.email}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                <Crown size={9} /> {user?.plan || 'Free'} plan
              </span>
            </div>
          </motion.div>

          <Section icon={User} title="Profile" description="Update your personal information" delay={0.05}>
            <form onSubmit={handleProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={saving}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </form>
          </Section>

          <Section icon={Shield} title="Security" description="Manage your password" delay={0.1}>
            <form onSubmit={handlePassword} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">Current Password</label>
                <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="input-field" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">New Password</label>
                  <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">Confirm New</label>
                  <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="input-field" required />
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={changingPw}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <Lock size={14} /> {changingPw ? 'Changing...' : 'Change Password'}
              </motion.button>
            </form>
          </Section>

          {/* Plan cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="font-heading font-700 text-sm text-text mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-primary" /> Your Plan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const isCurrent = (user?.plan || 'free').toLowerCase() === plan.name.toLowerCase();
                return (
                  <div
                    key={plan.name}
                    className={`glass-card p-5 relative overflow-hidden transition-all duration-300 ${
                      plan.highlight ? 'border-primary/30 shadow-lg shadow-primary/5' : ''
                    } ${isCurrent ? 'ring-1 ring-primary/40' : 'hover:border-white/20'}`}
                  >
                    {plan.highlight && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-accent text-white text-[9px] font-bold uppercase px-3 py-0.5 rounded-bl-lg">
                        Popular
                      </div>
                    )}
                    <p className="font-heading font-700 text-sm text-text mb-1">{plan.name}</p>
                    <p className="font-heading font-800 text-2xl text-text mb-3">
                      {plan.price}<span className="text-xs font-normal text-text-muted">/mo</span>
                    </p>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map(f => (
                        <li key={f} className="text-xs text-text-muted flex items-start gap-2">
                          <Check size={12} className="text-accent mt-0.5 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <span className="text-xs font-medium text-primary">Current plan</span>
                    ) : (
                      <button className="btn-secondary text-xs w-full flex items-center justify-center gap-1">
                        Upgrade <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    </>
  );
}
