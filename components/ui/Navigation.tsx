'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Navigation() {
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Resume', href: '#resume' },
    { name: 'Social', href: '#social' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.nav
      className="fixed top-0 w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md z-50 border-b border-zinc-200 dark:border-zinc-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Rudra's Portfolio</span>
          </Link>
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

