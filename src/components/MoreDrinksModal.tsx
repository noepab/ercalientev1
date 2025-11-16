import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './icons';
import { DrinkItem } from '../types';
import { DrinkIcon } from './DrinkIcon';

interface MoreDrinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAndAdd: (drink: DrinkItem) => void;
  drinks: DrinkItem[];
  onEditImage: (drink: DrinkItem) => void;
}

export const MoreDrinksModal: React.FC<MoreDrinksModalProps> = ({
  isOpen,
  onClose,
  onReviewAndAdd,
  drinks,
  onEditImage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--color-surface)] rounded-lg shadow-xl p-8 max-w-4xl w-full relative text-white border border-[var(--color-surface-light)] h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center font-heading">
          Carta de Bebidas Completa
        </h2>
        <div className="flex-grow overflow-y-auto -mx-4 px-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-8">
            {drinks.map((drink) => (
              <DrinkIcon
                key={`${drink.id}-${drink.name}`}
                drink={drink}
                onReviewAndAdd={onReviewAndAdd}
                isReadyToOrder={true}
                onEditImage={onEditImage}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
