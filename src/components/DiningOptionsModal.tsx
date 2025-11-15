import React from 'react';
import { motion } from 'framer-motion';

interface DiningOptionsModalProps {
  onSelect: (option: 'dine-in' | 'takeout') => void;
}

export const DiningOptionsModal: React.FC<DiningOptionsModalProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] rounded-xl shadow-2xl p-8 max-w-lg w-full text-white border border-[var(--color-surface-light)] text-center"
      >
        <h2 className="text-3xl font-bold mb-8 font-heading text-slate-100">
          ¿Cómo quieres disfrutar?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('dine-in')}
            className="p-8 bg-[var(--color-surface-light)] rounded-xl hover:bg-slate-700 transition-colors flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
          >
            <span className="text-6xl mb-3 drop-shadow-lg">🍽️</span>
            <span className="font-bold text-lg">Comer aquí</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('takeout')}
            className="p-8 bg-[var(--color-surface-light)] rounded-xl hover:bg-slate-700 transition-colors flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
          >
            <span className="text-6xl mb-3 drop-shadow-lg">🛍️</span>
            <span className="font-bold text-lg">Para llevar</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
