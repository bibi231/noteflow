import { motion } from 'framer-motion';

export default function PageWrapper({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex-1 overflow-auto px-4 sm:px-8 py-6 ${className}`}
    >
      {children}
    </motion.main>
  );
}
