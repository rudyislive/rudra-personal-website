'use client';

import { SocialLinks } from '@/lib/types/social';
import { 
  FaInstagram, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaReddit,
} from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import { SiCoinmarketcap } from 'react-icons/si';
import { motion } from 'framer-motion';

interface SocialLinksComponentProps {
  socialLinks: SocialLinks;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

const iconMap = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  github: FaGithub,
  reddit: FaReddit,
  coinmarketcap: SiCoinmarketcap,
  threads: FaThreads,
};

const colorMap = {
  instagram: 'from-purple-600 via-pink-600 to-red-500',
  facebook: 'from-blue-600 to-blue-800',
  twitter: 'from-sky-500 to-blue-600',
  linkedin: 'from-blue-700 to-blue-900',
  github: 'from-zinc-700 to-zinc-900',
  reddit: 'from-orange-600 to-red-600',
  coinmarketcap: 'from-blue-400 to-blue-600',
  threads: 'from-zinc-900 to-zinc-700',
};

export function SocialLinksComponent({ 
  socialLinks, 
  size = 'md',
  variant = 'default' 
}: SocialLinksComponentProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const socialEntries = Object.entries(socialLinks).filter(([_, url]) => url && url !== '' && url !== 'https://instagram.com/your-profile');

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-3">
        {socialEntries.map(([platform, url]) => {
          const Icon = iconMap[platform as keyof typeof iconMap];
          if (!Icon || !url) return null;
          
          return (
            <motion.a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-gradient-to-r ${colorMap[platform as keyof typeof colorMap]} text-white hover:scale-110 transition-transform shadow-lg hover:shadow-xl relative`}
              aria-label={platform}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 justify-center">
      {socialEntries.map(([platform, url], index) => {
        const Icon = iconMap[platform as keyof typeof iconMap];
        if (!Icon || !url) return null;
        
        return (
          <motion.a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-gradient-to-r ${colorMap[platform as keyof typeof colorMap]} text-white hover:scale-110 transition-transform shadow-lg hover:shadow-xl group relative`}
            aria-label={platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-5 h-5" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 dark:bg-zinc-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </span>
          </motion.a>
        );
      })}
    </div>
  );
}

