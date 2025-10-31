import React from 'react';
// Fix: Corrected import path for types.
import { DrinkItem } from '../types';
import { DrinkIcon } from './DrinkIcon';

interface DrinksGalleryProps {
    drinks: DrinkItem[];
    onReviewAndAdd: (drink: DrinkItem) => void;
    isReadyToOrder: boolean;
    onOpenMoreDrinks: () => void;
    onEditImage: (drink: DrinkItem) => void;
}

export const DrinksGallery: React.FC<DrinksGalleryProps> = ({ drinks, onReviewAndAdd, isReadyToOrder, onOpenMoreDrinks, onEditImage }) => {
    return (
        <div className="my-8">
            <h2 className="text-3xl font-bold mb-6 text-slate-100 font-heading">Bebidas</h2>
            <div className="flex justify-start items-center space-x-6 overflow-x-auto pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {drinks.map((drink) => (
                    <DrinkIcon key={`${drink.id}-${drink.name}`} drink={drink} onReviewAndAdd={onReviewAndAdd} isReadyToOrder={isReadyToOrder} onEditImage={onEditImage} />
                ))}
                <button
                    onClick={onOpenMoreDrinks}
                    disabled={!isReadyToOrder}
                    className="flex flex-col items-center space-y-2 group disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)] rounded-full"
                    aria-label="Ver más bebidas"
                >
                    <div className="w-20 h-20 bg-[var(--color-surface)] rounded-full flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform border-2 border-dashed border-[var(--color-surface-light)] group-hover:border-[var(--color-primary)]">
                        <span className="text-3xl font-bold text-slate-400 group-hover:text-[var(--color-primary)] transition-colors">+</span>
                    </div>
                    <span className="text-sm font-medium text-slate-300">Más Bebidas</span>
                </button>
                {drinks.length === 0 && <p className="text-slate-500">No hay bebidas que coincidan con tus filtros de alergia.</p>}
            </div>
        </div>
    );
};