import React from 'react';
import { motion } from 'framer-motion';
// Fix: Corrected import path for types.
import { MenuItem, ALLERGIES_DATA } from '../types';
import { CubeIcon, Wand2Icon, ImageIcon } from './icons';

interface MenuItemCardProps {
  item: MenuItem;
  onReviewAndAdd: (item: MenuItem) => void;
  isReadyToOrder: boolean;
  onEditImage: (item: MenuItem) => void;
  onGenerateModel: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onReviewAndAdd,
  isReadyToOrder,
  onEditImage,
  onGenerateModel,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isReadyToOrder) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', `menu-${item.id}`);
    e.dataTransfer.effectAllowed = 'copy';
    const dragImage = new Image();
    dragImage.src = item.imageUrl;
    dragImage.style.width = '100px';
    dragImage.style.height = '100px';
    dragImage.style.borderRadius = '8px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 50, 50);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const AllergenInfo = () => {
    if (item.allergens === undefined) {
      return null;
    }
    if (item.allergens.length === 0) {
      return <p className="text-xs text-green-400 mt-2">Sin alérgenos conocidos</p>;
    }
    return (
      <div className="mt-2">
        <div className="flex flex-wrap gap-1">
          {item.allergens.map((allergy) => (
            <span
              key={allergy}
              className="text-xs font-bold bg-red-200 text-red-800 px-2 py-1 rounded-full"
            >
              {ALLERGIES_DATA[allergy]}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        draggable={isReadyToOrder}
        onDragStart={handleDragStart}
        className={`bg-[var(--color-surface)] rounded-xl shadow-lg overflow-hidden border border-[var(--color-surface-light)] flex flex-col ${isReadyToOrder ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div className="relative w-full h-56 bg-slate-700">
          {item.imageUrl ? (
            <img
              loading="lazy"
              src={item.imageUrl}
              alt={`Imagen de ${item.name}`}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-slate-500" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
              onClick={() => onGenerateModel(item)}
              className="bg-slate-900/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-slate-900/75 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-[var(--color-primary)]"
              aria-label="Ver o generar modelo 3D"
            >
              <CubeIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEditImage(item)}
              className="bg-slate-900/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-slate-900/75 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-pink-500"
              aria-label="Editar o generar imagen con IA"
            >
              <Wand2Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white pr-2 font-heading">{item.name}</h3>
            <span className="text-xs flex-shrink-0 font-semibold bg-slate-700 text-[var(--color-primary)] px-2 py-1 rounded-full">
              {item.category}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">{item.description}</p>
          <div className="flex-grow">
            <AllergenInfo />
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              ${item.price.toFixed(2)}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onReviewAndAdd(item)}
              disabled={!isReadyToOrder}
              className="font-bold px-4 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-text-dark)] hover:bg-[var(--color-primary-dark)] focus-visible:ring-[var(--color-primary)] disabled:bg-slate-600 disabled:text-slate-400"
            >
              Revisar/Añadir
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};
