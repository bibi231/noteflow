import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, AlertCircle, ArrowRight, Brain, ListChecks, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const features = [
  { icon: Brain, text: 'AI-powered meeting summaries' },
  { icon: ListChecks, text: 'Automatic action item extraction' },
  { icon: BarChart3, text: 'Track progress & completion' },
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/15 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] animate-float-slower" />

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-heading font-800 text-xl text-text">NoteFlow</span>
          </Link>

          <h2 className="font-heading font-800 text-4xl text-text leading-tight mb-4">
            Your meetings,<br />
            <span className="gradient-text">distilled.</span>
          </h2>
          <p className="text-text-muted text-base max-w-sm mb-10 leading-relaxed">
            Transform chaotic meeting notes into clear summaries and actionable tasks with AI.
          </p>

          <div className="flex flex-col gap-4">
            {features.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-primary" />
                </div>
                <span className="text-sm text-text-muted">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm relative"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-heading font-800 text-xl text-text">NoteFlow</span>
          </div>

          <h1 className="font-heading font-800 text-2xl text-text mb-1">Welcome back</h1>
          <p className="text-text-muted text-sm mb-8">Sign in to continue to your dashboard</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 bg-error/10 border border-error/20 text-error text-sm px-4 py-3 rounded-xl mb-5"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-10"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : <>Sign in <ArrowRight size={16} /></>}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm text-text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:text-accent transition-colors">
                Get started free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
