import React from 'react';
import { motion } from 'framer-motion';
// Fix: Corrected import path for types.
import { DrinkItem, ALLERGIES_DATA } from '../types';
import { ImageIcon, Wand2Icon } from './icons';

interface DrinkIconProps {
  drink: DrinkItem;
  onReviewAndAdd: (drink: DrinkItem) => void;
  isReadyToOrder: boolean;
  onEditImage: (drink: DrinkItem) => void;
}

export const DrinkIcon: React.FC<DrinkIconProps> = ({
  drink,
  onReviewAndAdd,
  isReadyToOrder,
  onEditImage,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isReadyToOrder || !drink.imageUrl) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', `drink-${drink.id}`);
    e.dataTransfer.effectAllowed = 'copy';
    if (drink.imageUrl) {
      const dragImage = new Image();
      dragImage.src = drink.imageUrl;
      dragImage.style.width = '80px';
      dragImage.style.height = '80px';
      dragImage.style.borderRadius = '50%';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 40, 40);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const allergenDisplay = (() => {
    if (drink.allergens === undefined) return null;
    if (drink.allergens.length === 0)
      return <p className="text-[10px] text-green-400 leading-tight mt-0.5">Sin alérgenos</p>;
    const translatedAllergens = drink.allergens.map((a) => ALLERGIES_DATA[a]).join(', ');
    return <p className="text-[10px] text-red-400 leading-tight mt-0.5">{translatedAllergens}</p>;
  })();

  return (
    <div
      className="relative flex flex-col items-center group w-24 flex-shrink-0"
      draggable={isReadyToOrder && !!drink.imageUrl}
      onDragStart={handleDragStart}
    >
      <button
        onClick={() => onEditImage(drink)}
        className="absolute top-0 right-0 z-10 bg-slate-900/50 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-slate-900/75 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 -translate-y-1/2 translate-x-1/2"
        aria-label="Editar o generar imagen con IA"
      >
        <Wand2Icon className="w-4 h-4" />
      </button>
      <motion.div whileTap={{ scale: 0.9 }}>
        <div
          className={`flex flex-col items-center group disabled:cursor-not-allowed active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)] rounded-full disabled:opacity-50`}
        >
          <div className="w-20 h-20 bg-[var(--color-surface)] rounded-full flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform border-2 border-[var(--color-surface-light)] group-hover:border-[var(--color-primary)] pointer-events-none relative">
            {drink.imageUrl ? (
              <img
                loading="lazy"
                src={drink.imageUrl}
                alt={`Imagen de ${drink.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-700">
                <ImageIcon className="w-10 h-10 text-slate-500" />
              </div>
            )}
          </div>
          <div className="text-center mt-2 h-12 flex flex-col justify-start pointer-events-none">
            <span className="text-sm font-medium text-slate-300 leading-tight">{drink.name}</span>
            {allergenDisplay}
          </div>
        </div>
      </motion.div>
      <button
        onClick={() => onReviewAndAdd(drink)}
        disabled={!isReadyToOrder}
        className="text-xs mt-1 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold px-3 py-1 rounded-full transition-colors"
      >
        Revisar/Añadir
      </button>
    </div>
  );
};
