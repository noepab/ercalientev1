import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './icons';

interface TableSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (table: string) => void;
}

const tables = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

export const TableSelectionModal: React.FC<TableSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] rounded-xl shadow-2xl p-8 max-w-lg w-full relative text-white border border-[var(--color-surface-light)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-8 text-center font-heading text-slate-100">
          Selecciona tu Mesa
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {tables.map((table) => (
            <motion.button
              key={table}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(table)}
              className="aspect-square bg-[var(--color-surface-light)] rounded-xl hover:bg-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors text-2xl font-bold flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              {table}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
