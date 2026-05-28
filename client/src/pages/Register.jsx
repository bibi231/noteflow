import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, User, Mail, Lock, AlertCircle, ArrowRight, Shield, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const perks = [
  { icon: Sparkles, text: 'Unlimited AI summaries' },
  { icon: Shield, text: 'Secure & private' },
  { icon: Clock, text: 'Set up in 30 seconds' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
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
        <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-background to-primary/10" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/12 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] animate-float-slower" />

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-heading font-800 text-xl text-text">NoteFlow</span>
          </Link>

          <h2 className="font-heading font-800 text-4xl text-text leading-tight mb-4">
            Start turning notes<br />
            <span className="gradient-text">into action.</span>
          </h2>
          <p className="text-text-muted text-base max-w-sm mb-10 leading-relaxed">
            Join thousands of teams using NoteFlow to make every meeting count.
          </p>

          <div className="flex flex-col gap-4">
            {perks.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-accent" />
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
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm relative"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-heading font-800 text-xl text-text">NoteFlow</span>
          </div>

          <h1 className="font-heading font-800 text-2xl text-text mb-1">Create your account</h1>
          <p className="text-text-muted text-sm mb-8">Free forever. No credit card required.</p>

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
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="input-field pl-10"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

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
                  placeholder="Min 8 characters"
                  className="input-field pl-10"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="new-password"
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
              {loading ? 'Creating account...' : <>Get started free <ArrowRight size={16} /></>}
            </motion.button>
          </form>

          <p className="text-xs text-text-muted/60 text-center mt-4">
            By signing up you agree to our Terms of Service
          </p>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:text-accent transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
