'use client';

import { motion } from 'framer-motion';
import { FaCalendar, FaEnvelope } from 'react-icons/fa';

interface CTAProps {
  calendlyLink?: string;
  email: string;
}

export function CTA({ calendlyLink, email }: CTAProps) {
  return (
    <motion.div
      className="flex flex-col md:flex-row gap-4 justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {calendlyLink && (
        <motion.a
          href={calendlyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCalendar /> Schedule a Meeting
        </motion.a>
      )}
      <motion.a
        href={`mailto:${email}`}
        className="inline-flex items-center gap-3 px-8 py-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaEnvelope /> Contact Me
      </motion.a>
    </motion.div>
  );
}

