import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './icons';

interface CustomerNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export const CustomerNameModal: React.FC<CustomerNameModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onConfirm(name.trim());
        }
    };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--color-surface)] rounded-lg shadow-xl p-8 max-w-sm w-full relative text-white border border-[var(--color-surface-light)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 font-heading">¿Para quién es?</h2>
        <p className="text-slate-400 mb-6">Introduce un nombre para este pedido.</p>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Juan, Mesa Esquina..."
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-white mb-6"
                autoFocus
            />
            <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-[var(--color-primary)] text-[var(--color-text-dark)] py-3 rounded-lg font-bold hover:bg-[var(--color-primary-dark)] transition-colors disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                Confirmar
            </button>
        </form>
      </motion.div>
    </div>
  );
};