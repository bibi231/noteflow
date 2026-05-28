import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Sparkles, Brain, ListChecks, FileText, ChevronRight, Check,
  ArrowRight, Star, Quote, Shield, Clock, Users, BarChart3,
  Menu, X, MousePointer2, Layers, Target, Workflow
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/* ─── Animated background orbs ─── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-float-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/8 blur-[100px] animate-float-slower" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] animate-float-medium" />
    </div>
  );
}

/* ─── Grid background ─── */
function GridBg() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }}
    />
  );
}

/* ─── Animated counter ─── */
function Counter({ end, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-heading font-700 text-lg text-text">NoteFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
              className="text-sm text-text-muted hover:text-text transition-colors">{item}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="btn-primary text-sm flex items-center gap-2">
                Go to Dashboard <ArrowRight size={14} />
              </motion.button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-text-muted hover:text-text transition-colors px-4 py-2">
                Sign in
              </Link>
              <Link to="/register">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary text-sm flex items-center gap-2">
                  Get Started <ArrowRight size={14} />
                </motion.button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-text-muted" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-t border-white/5 px-6 py-4 space-y-3"
          >
            {['Features', 'How it works', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                className="block text-sm text-text-muted py-2" onClick={() => setMobileOpen(false)}>{item}</a>
            ))}
            <div className="flex gap-3 pt-2">
              {user ? (
                <Link to="/dashboard" className="flex-1 btn-primary text-sm text-center py-2.5" onClick={() => setMobileOpen(false)}>Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="flex-1 text-center text-sm border border-border rounded-xl py-2.5 text-text-muted" onClick={() => setMobileOpen(false)}>Sign in</Link>
                  <Link to="/register" className="flex-1 btn-primary text-sm text-center py-2.5" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <FloatingOrbs />
      <GridBg />

      {/* Radial spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-primary/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8"
        >
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-medium text-primary">AI-Powered Meeting Intelligence</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading font-800 text-5xl md:text-7xl text-text leading-[1.1] mb-6"
        >
          Your meetings,{' '}
          <span className="relative">
            <span className="gradient-text">distilled</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute bottom-1 left-0 h-[3px] bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </span>
          <span className="gradient-text">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Stop drowning in meeting notes. NoteFlow uses AI to instantly summarize conversations,
          extract action items, and track everything — so you can focus on what matters.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(108,60,225,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-base px-8 py-4 flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Sparkles size={18} /> Start Free — No Card Required
            </motion.button>
          </Link>
        </motion.div>

        {/* Browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="gradient-border rounded-2xl overflow-hidden">
            <div className="bg-surface rounded-2xl overflow-hidden border border-white/5">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-surface-2 rounded-lg px-3 py-1.5 text-xs text-text-muted text-center">
                    app.noteflow.com
                  </div>
                </div>
              </div>
              {/* App preview */}
              <div className="p-6 bg-background min-h-[300px]">
                <div className="flex gap-4">
                  {/* Mini sidebar */}
                  <div className="w-40 shrink-0 hidden sm:block">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent" />
                      <span className="text-xs font-heading font-700 text-text">NoteFlow</span>
                    </div>
                    {['Dashboard', 'Meetings', 'Settings'].map((item, i) => (
                      <div key={item} className={`text-[10px] px-2.5 py-1.5 rounded-lg mb-1 ${i === 0 ? 'bg-primary/20 text-primary' : 'text-text-muted'}`}>{item}</div>
                    ))}
                  </div>
                  {/* Mini dashboard */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      {[12, 47, 38, 9].map((n, i) => (
                        <div key={i} className="glass-card p-3">
                          <div className="text-[9px] text-text-muted uppercase mb-1">{['Meetings', 'Actions', 'Done', 'Pending'][i]}</div>
                          <div className="text-sm font-heading font-700 text-text">{n}</div>
                        </div>
                      ))}
                    </div>
                    <div className="glass-card p-3">
                      <div className="text-[10px] font-heading font-600 text-text mb-2">Recent Meetings</div>
                      {['Product Sync', 'Design Review', 'Sprint Planning'].map((m, i) => (
                        <div key={m} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                          <span className="text-[10px] text-text">{m}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${i < 2 ? 'bg-accent/20 text-accent' : 'bg-warning/20 text-warning'}`}>
                            {i < 2 ? 'Processed' : 'Draft'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow under mockup */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gradient-to-t from-primary/10 to-transparent blur-2xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SOCIAL PROOF ─── */
function SocialProof() {
  const stats = [
    { value: 2500, suffix: '+', label: 'Meetings Processed' },
    { value: 10000, suffix: '+', label: 'Action Items Tracked' },
    { value: 98, suffix: '%', label: 'Time Saved' },
    { value: 4.9, suffix: '/5', label: 'User Rating' },
  ];

  return (
    <section className="relative py-20 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="text-center">
              <p className="font-heading font-800 text-3xl md:text-4xl text-text mb-1">
                <Counter end={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES BENTO ─── */
function Features() {
  const features = [
    {
      icon: Brain, title: 'AI Summarization', desc: 'Paste raw notes, get a crisp summary. Powered by GPT-4o — no fluff, just decisions and outcomes.',
      gradient: 'from-primary/20 to-primary/5', span: 'md:col-span-2',
    },
    {
      icon: ListChecks, title: 'Smart Extraction', desc: 'Action items with assignees, priorities, and due dates — pulled automatically.',
      gradient: 'from-accent/20 to-accent/5', span: '',
    },
    {
      icon: Target, title: 'Progress Tracking', desc: 'Visual progress bars and status toggles for every action item.',
      gradient: 'from-warning/20 to-warning/5', span: '',
    },
    {
      icon: Shield, title: 'Enterprise Security', desc: 'JWT httpOnly cookies, bcrypt, rate limiting, input sanitization, CORS whitelist.',
      gradient: 'from-success/20 to-success/5', span: '',
    },
    {
      icon: Layers, title: 'Tag & Organize', desc: 'Tag meetings by project, team, or topic. Filter and search instantly.',
      gradient: 'from-error/20 to-error/5', span: '',
    },
    {
      icon: BarChart3, title: 'Dashboard Analytics', desc: 'Live stats — meetings count, action items, completion rates — all at a glance.',
      gradient: 'from-primary/20 to-accent/5', span: 'md:col-span-2',
    },
  ];

  return (
    <section id="features" className="relative py-24">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Features</span>
          <h2 className="font-heading font-800 text-3xl md:text-4xl text-text mt-3 mb-4">
            Everything you need to <span className="gradient-text">own your meetings</span>
          </h2>
          <p className="text-text-muted max-w-lg mx-auto">
            From raw notes to tracked action items in seconds. No more lost follow-ups.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, gradient, span }, i) => (
            <Reveal key={title} delay={i * 0.08} className={span}>
              <motion.div
                whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
                className="glass-card p-6 h-full group cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className="text-text" />
                </div>
                <h3 className="font-heading font-600 text-base text-text mb-2">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Paste your notes', desc: 'Drop in raw meeting notes — from any format, any length.', icon: FileText },
    { num: '02', title: 'AI processes', desc: 'GPT-4o summarizes and extracts action items with context.', icon: Brain },
    { num: '03', title: 'Track & deliver', desc: 'Toggle tasks done, track progress, and never miss a follow-up.', icon: Target },
  ];

  return (
    <section id="how-it-works" className="relative py-24 bg-surface/30">
      <GridBg />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="text-xs font-medium text-accent uppercase tracking-wider">How it works</span>
          <h2 className="font-heading font-800 text-3xl md:text-4xl text-text mt-3 mb-4">
            Three steps. <span className="gradient-text">Zero effort.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ num, title, desc, icon: Icon }, i) => (
            <Reveal key={num} delay={i * 0.15}>
              <div className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary/40 to-transparent z-0" />
                )}
                <motion.div whileHover={{ y: -4 }} className="relative z-10 glass-card p-6 text-center">
                  <div className="text-4xl font-heading font-800 gradient-text opacity-30 mb-3">{num}</div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-600 text-base text-text mb-2">{title}</h3>
                  <p className="text-sm text-text-muted">{desc}</p>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ─── */
function Testimonials() {
  const testimonials = [
    { name: 'Sarah Chen', role: 'Product Lead, TechCorp', text: 'NoteFlow cut our meeting follow-up time by 80%. Action items are tracked before the call even ends.', avatar: 'SC' },
    { name: 'James Okafor', role: 'Engineering Manager', text: 'Finally, a tool that actually extracts useful action items instead of generic summaries. Game changer.', avatar: 'JO' },
    { name: 'Amara Diallo', role: 'Operations Director', text: 'We went from losing 30% of action items to tracking 100% of them. The ROI is insane.', avatar: 'AD' },
  ];

  return (
    <section className="relative py-24">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Testimonials</span>
          <h2 className="font-heading font-800 text-3xl md:text-4xl text-text mt-3 mb-4">
            Loved by <span className="gradient-text">productive teams</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <motion.div whileHover={{ y: -4 }} className="glass-card p-6 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-warning fill-warning" />)}
                </div>
                <p className="text-sm text-text leading-relaxed flex-1 mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ─── */
function Pricing() {
  const plans = [
    {
      name: 'Free', price: '0', period: 'forever', desc: 'For individuals getting started',
      features: ['5 meetings/month', 'AI summaries', 'Action item extraction', 'Basic dashboard'],
      cta: 'Start Free', popular: false,
    },
    {
      name: 'Pro', price: '12', period: '/month', desc: 'For professionals & small teams',
      features: ['Unlimited meetings', 'Priority AI processing', 'Advanced analytics', 'Tag & organize', 'Export to PDF', 'Email reports'],
      cta: 'Start Pro Trial', popular: true,
    },
    {
      name: 'Team', price: '29', period: '/month', desc: 'For growing organizations',
      features: ['Everything in Pro', 'Team workspace', 'Shared meetings', 'Admin controls', 'API access', 'Priority support'],
      cta: 'Contact Sales', popular: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 bg-surface/30">
      <GridBg />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="text-xs font-medium text-accent uppercase tracking-wider">Pricing</span>
          <h2 className="font-heading font-800 text-3xl md:text-4xl text-text mt-3 mb-4">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="text-text-muted">No hidden fees. Cancel anytime.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`glass-card p-6 relative ${plan.popular ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-[10px] font-semibold text-white uppercase">
                    Most Popular
                  </div>
                )}
                <h3 className="font-heading font-700 text-lg text-text mb-1">{plan.name}</h3>
                <p className="text-xs text-text-muted mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-heading font-800 text-4xl text-text">${plan.price}</span>
                  <span className="text-sm text-text-muted">{plan.period}</span>
                </div>
                <Link to="/register">
                  <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : 'border border-border text-text hover:bg-white/5'
                  }`}>
                    {plan.cta}
                  </button>
                </Link>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-text-muted">
                      <Check size={14} className="text-accent shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'What AI model does NoteFlow use?', a: 'We use OpenAI GPT-4o-mini for fast, accurate summarization and action item extraction. Processing takes under 10 seconds.' },
    { q: 'Is my meeting data secure?', a: 'Absolutely. We use JWT httpOnly cookies, bcrypt password hashing, rate limiting, input sanitization, and encrypted connections. Your data is never shared.' },
    { q: 'Can I use NoteFlow for free?', a: 'Yes! Our free plan includes 5 meetings per month with full AI processing. No credit card required.' },
    { q: 'Does NoteFlow integrate with Zoom or Google Meet?', a: 'Not yet — NoteFlow works with pasted/typed notes. Integrations with Zoom, Meet, and Teams are on our roadmap.' },
    { q: 'Can I export my meeting data?', a: 'Pro and Team plans include PDF export and email reports. We are working on CSV and Notion export.' },
  ];

  return (
    <section className="relative py-24">
      <div className="max-w-2xl mx-auto px-6">
        <Reveal className="text-center mb-12">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="font-heading font-800 text-3xl text-text mt-3">Frequently asked questions</h2>
        </Reveal>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <Reveal key={q} delay={i * 0.05}>
              <div className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-medium text-text pr-4">{q}</span>
                  <ChevronRight size={16} className={`text-text-muted shrink-0 transition-transform ${open === i ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 text-sm text-text-muted leading-relaxed">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FINAL CTA ─── */
function FinalCTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8">
            <BookOpen size={28} className="text-white" />
          </div>
          <h2 className="font-heading font-800 text-3xl md:text-5xl text-text mb-4">
            Ready to <span className="gradient-text">distill</span> your meetings?
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-md mx-auto">
            Join thousands of teams saving hours every week. Start free, upgrade when you're ready.
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(108,60,225,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-base px-10 py-4 shadow-lg shadow-primary/25"
            >
              Get Started Free <ArrowRight size={18} className="inline ml-2" />
            </motion.button>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="font-heading font-700 text-sm text-text">NoteFlow</span>
          </div>
          <div className="flex gap-6 text-xs text-text-muted">
            <a href="#features" className="hover:text-text transition-colors">Features</a>
            <a href="#pricing" className="hover:text-text transition-colors">Pricing</a>
            <a href="#" className="hover:text-text transition-colors">Privacy</a>
            <a href="#" className="hover:text-text transition-colors">Terms</a>
          </div>
          <p className="text-xs text-text-muted">&copy; 2026 NoteFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN EXPORT ─── */
export default function LandingPage() {
  return (
    <div className="bg-background text-text overflow-x-hidden">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
