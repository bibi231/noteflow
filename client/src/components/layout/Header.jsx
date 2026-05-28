import { useAuth } from '@/hooks/useAuth';

export default function Header({ title }) {
  const now = new Date();
  const date = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(now);

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border">
      <div>
        {title && <h1 className="font-heading font-700 text-xl text-text">{title}</h1>}
      </div>
      <p className="text-sm text-text-muted">{date}</p>
    </header>
  );
}
