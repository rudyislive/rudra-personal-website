'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Card({ children, className = '', delay = 0 }: CardProps) {
  return (
    <motion.div
      className={`rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, borderColor: 'rgba(139, 92, 246, 0.3)' }}
    >
      {children}
    </motion.div>
  );
}

