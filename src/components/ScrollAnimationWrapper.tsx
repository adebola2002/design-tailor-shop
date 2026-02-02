import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  variant?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';
  className?: string;
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    inView: { opacity: 1 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 50 },
    inView: { opacity: 1, y: 0 },
  },
  'slide-left': {
    initial: { opacity: 0, x: 50 },
    inView: { opacity: 1, x: 0 },
  },
  'slide-right': {
    initial: { opacity: 0, x: -50 },
    inView: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    inView: { opacity: 1, scale: 1 },
  },
};

export function ScrollAnimationWrapper({
  children,
  delay = 0,
  duration = 0.6,
  variant = 'slide-up',
  className = '',
}: ScrollAnimationWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const variantConfig = variants[variant];

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? 'inView' : 'initial'}
      variants={variantConfig}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
