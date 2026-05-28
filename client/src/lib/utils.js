export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));

export const formatRelative = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const priorityColor = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-error',
};

export const statusColor = {
  draft: 'bg-text-muted/20 text-text-muted',
  processed: 'bg-success/20 text-success',
};
