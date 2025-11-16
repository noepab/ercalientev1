import React from 'react';
import { motion } from 'framer-motion';
// Fix: Corrected import path for types.
import { MenuItem, Allergy, CATEGORIES, ALLERGIES_DATA } from '../types';
import { MenuItemCard } from './MenuItemCard';
import {
  Wand2Icon,
  UploadCloudIcon,
  SparklesIcon,
  AlertTriangleIcon,
  SearchIcon,
  ListIcon,
  SaladIcon,
  SandwichIcon,
  FishIcon,
  MeatIcon,
  CakeIcon,
  VideoIcon,
  ClapperboardIcon,
} from './icons';

interface MenuGalleryProps {
  isLoading: boolean;
  items: MenuItem[];
  onReviewAndAdd: (item: MenuItem) => void;
  isReadyToOrder: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedAllergies: Allergy[];
  onOpenRecommendationModal: () => void;
  onOpenImageAnalysisModal: () => void;
  onOpenImageEditor: (item?: MenuItem) => void;
  canEditAnyImage: boolean;
  onOpenImagenModal: () => void;
  onOpenVideoGenerationModal: () => void;
  onOpenVideoAnalysisModal: () => void;
  onGenerateModel: (item: MenuItem) => void;
  onResetMenu: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const categoryIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  Todos: ListIcon,
  Ensaladas: SaladIcon,
  Bocadillos: SandwichIcon,
  'Pescaito Frito': FishIcon,
  Carnes: MeatIcon,
  Postres: CakeIcon,
};

const MenuItemCardSkeleton: React.FC = () => (
  <div className="bg-[var(--color-surface)] rounded-xl shadow-lg overflow-hidden border border-[var(--color-surface-light)] flex flex-col animate-pulse">
    <div className="relative w-full h-56 bg-slate-700">
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <div className="w-9 h-9 bg-slate-600/50 rounded-full"></div>
        <div className="w-9 h-9 bg-slate-600/50 rounded-full"></div>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <div className="h-6 bg-slate-700 rounded w-3/4"></div>
        <div className="h-5 bg-slate-700 rounded-full w-1/4 ml-4"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
      </div>
      <div className="flex-grow mt-4">
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-8 bg-slate-700 rounded w-1/3"></div>
        <div className="h-10 bg-slate-700 rounded-lg w-1/3"></div>
      </div>
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export const MenuGallery: React.FC<MenuGalleryProps> = ({
  isLoading,
  items,
  onReviewAndAdd,
  isReadyToOrder,
  selectedCategory,
  onSelectCategory,
  selectedAllergies,
  onOpenRecommendationModal,
  onOpenImageAnalysisModal,
  onOpenImageEditor,
  canEditAnyImage,
  onOpenImagenModal,
  onOpenVideoGenerationModal,
  onOpenVideoAnalysisModal,
  onGenerateModel,
  onResetMenu,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-4xl font-bold text-slate-100 font-heading">Menú</h2>
        <div className="flex-shrink-0 flex items-center gap-2 flex-wrap justify-start md:justify-end">
          <button
            onClick={onOpenRecommendationModal}
            disabled={!isReadyToOrder}
            className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-sky-800 hover:bg-sky-700 text-white flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-sky-500"
          >
            {' '}
            <SparklesIcon className="w-4 h-4" />{' '}
            <span className="hidden sm:inline">Recomendaciones</span>{' '}
          </button>
        </div>
      </div>
      <div className="mb-6 p-4 bg-[var(--color-surface)]/50 border border-slate-700 rounded-lg flex flex-wrap items-center gap-3 justify-center sm:justify-start">
        <span className="text-sm font-semibold text-slate-300 w-full sm:w-auto text-center sm:text-left">
          Herramientas de IA:
        </span>
        <button
          onClick={() => onOpenImageEditor()}
          disabled={!canEditAnyImage}
          className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-pink-800 hover:bg-pink-700 text-white flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-pink-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {' '}
          <Wand2Icon className="w-4 h-4" />{' '}
          <span className="hidden sm:inline">Editar Imagen</span>{' '}
        </button>
        <button
          onClick={onOpenImagenModal}
          className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-teal-800 hover:bg-teal-700 text-white flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-teal-500"
        >
          {' '}
          <SparklesIcon className="w-4 h-4" />{' '}
          <span className="hidden sm:inline">Crear Plato IA</span>{' '}
        </button>
        <button
          onClick={onOpenVideoGenerationModal}
          className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-indigo-800 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-indigo-500"
        >
          {' '}
          <VideoIcon className="w-4 h-4" />{' '}
          <span className="hidden sm:inline">Generar Vídeo</span>{' '}
        </button>
        <button
          onClick={onOpenVideoAnalysisModal}
          className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-purple-800 hover:bg-purple-700 text-white flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-purple-500"
        >
          {' '}
          <ClapperboardIcon className="w-4 h-4" />{' '}
          <span className="hidden sm:inline">Analizar Vídeo</span>{' '}
        </button>
        <button
          onClick={onOpenImageAnalysisModal}
          className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-gray-400"
        >
          {' '}
          <UploadCloudIcon className="w-4 h-4" />{' '}
          <span className="hidden sm:inline">Analizar Imagen</span>{' '}
        </button>
      </div>
      <div className="mb-6 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar en el menú..."
          className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-surface-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-grow flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CATEGORIES.map((category) => {
              const Icon = categoryIcons[category] || SparklesIcon;
              return (
                <motion.button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex-shrink-0 flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${selectedCategory === category ? 'bg-[var(--color-primary)] text-[var(--color-text-dark)] shadow-lg shadow-amber-500/20' : 'bg-[var(--color-surface-light)] hover:bg-slate-600 text-white'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category}</span>
                </motion.button>
              );
            })}
          </div>
          <button
            onClick={onResetMenu}
            className="flex-shrink-0 text-xs text-slate-400 hover:text-[var(--color-primary)] hover:underline transition-colors"
          >
            {' '}
            Restaurar Menú{' '}
          </button>
        </div>
      </div>
      {selectedAllergies.length > 0 && (
        <div className="mb-6 p-3 bg-slate-800/50 border border-slate-700 rounded-lg flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-300">Filtrando alérgenos:</span>
          {selectedAllergies.map((allergy) => (
            <span
              key={allergy}
              className="text-xs font-bold bg-red-200 text-red-800 px-2 py-1 rounded-full"
            >
              {ALLERGIES_DATA[allergy]}
            </span>
          ))}
        </div>
      )}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => <MenuItemCardSkeleton key={index} />)
        ) : items.length > 0 ? (
          items.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <MenuItemCard
                item={item}
                onReviewAndAdd={onReviewAndAdd}
                isReadyToOrder={isReadyToOrder}
                onEditImage={onOpenImageEditor}
                onGenerateModel={onGenerateModel}
              />
            </motion.div>
          ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16 px-6 bg-[var(--color-surface)]/50 rounded-lg">
            <AlertTriangleIcon className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white">No se encontraron resultados</h3>
            <p className="text-slate-400 mt-2">
              Prueba a cambiar la categoría, el término de búsqueda o a ajustar los filtros de
              alérgenos.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
