import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Settings, LogOut, BookOpen, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/meetings', label: 'Meetings', icon: Calendar },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-surface border-r border-border px-4 py-6 shrink-0">
      <Link to="/" className="flex items-center gap-2 mb-10 px-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-105 transition-transform">
          <BookOpen size={16} className="text-white" />
        </div>
        <span className="font-heading font-700 text-lg text-text">NoteFlow</span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-primary' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border pt-4 mt-4">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{user.name}</p>
                <p className="text-xs text-text-muted capitalize">{user.plan} plan</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-error hover:bg-error/10 transition-all duration-200"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text hover:bg-white/5 transition-all duration-200"
            >
              <LogIn size={18} />
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm text-center py-2.5"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
