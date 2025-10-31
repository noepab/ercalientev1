import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './icons';
import { Allergy, ALLERGIES, ALLERGIES_DATA } from '../types';

interface AllergySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAllergies: Allergy[];
  onAllergyToggle: (allergy: Allergy) => void;
}

export const AllergySelectionModal: React.FC<AllergySelectionModalProps> = ({ isOpen, onClose, selectedAllergies, onAllergyToggle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--color-surface)] rounded-lg shadow-xl p-8 max-w-lg w-full relative text-white border border-[var(--color-surface-light)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 font-heading">Filtro de Alérgenos</h2>
        <p className="text-slate-400 mb-6">Selecciona los alérgenos que quieres excluir del menú. Los platos que los contengan se ocultarán.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ALLERGIES.map(allergy => (
            <label key={allergy} className="flex items-center space-x-3 p-3 bg-[var(--color-surface-light)] rounded-lg cursor-pointer hover:bg-slate-600">
              <input
                type="checkbox"
                checked={selectedAllergies.includes(allergy)}
                onChange={() => onAllergyToggle(allergy)}
                className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-white font-medium">{ALLERGIES_DATA[allergy]}</span>
            </label>
          ))}
        </div>
         <div className="mt-8 text-center">
            <button onClick={onClose} className="bg-[var(--color-primary)] text-[var(--color-text-dark)] py-2 px-6 rounded-lg font-bold hover:bg-[var(--color-primary-dark)] transition-colors">
                Hecho
            </button>
        </div>
      </motion.div>
    </div>
  );
};