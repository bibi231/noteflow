import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export default function LoadingSpinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <motion.div
      className={cn('rounded-full border-2 border-border border-t-primary', sizes[size], className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}
