import React from 'react';
import { motion } from 'framer-motion';
import { XIcon, ImageIcon, BrainCircuitIcon } from './icons';
import { MenuItem, DrinkItem, CartItem, ALLERGIES_DATA } from '../types';
import { GoogleGenAI } from '@google/genai';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customizations: CartItem['customizations'], quantity: number) => void;
  item: MenuItem | DrinkItem | null;
}

// Custom hook for debouncing
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  item,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedIngredients, setSelectedIngredients] = React.useState<Set<string>>(new Set());
  const [selectedExtras, setSelectedExtras] = React.useState<Set<string>>(new Set());
  const [finalPrice, setFinalPrice] = React.useState(item?.price || 0);
  const [allergenInfo, setAllergenInfo] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const allSelectedItems = React.useMemo(() => {
    return [...Array.from(selectedIngredients), ...Array.from(selectedExtras)];
  }, [selectedIngredients, selectedExtras]);

  const debouncedSelectedItems = useDebounce(allSelectedItems, 500);

  React.useEffect(() => {
    if (item?.ingredients) {
      setSelectedIngredients(new Set(item.ingredients.filter((i) => i.default).map((i) => i.name)));
    } else {
      setSelectedIngredients(new Set());
    }
    setSelectedExtras(new Set());
  }, [item]);

  React.useEffect(() => {
    if (!item) return;
    const extrasPrice =
      item.extras?.filter((e) => selectedExtras.has(e.name)).reduce((sum, e) => sum + e.price, 0) ||
      0;
    setFinalPrice((item.price + extrasPrice) * quantity);
  }, [item, selectedExtras, quantity]);

  React.useEffect(() => {
    if (debouncedSelectedItems.length > 0) {
      analyzeAllergens(debouncedSelectedItems.join(', '));
    } else {
      setAllergenInfo(null);
    }
  }, [debouncedSelectedItems]);

  const analyzeAllergens = async (ingredientsList: string) => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const allKnownAllergens = Object.values(ALLERGIES_DATA).join(', ');
      const prompt = `De la siguiente lista de ingredientes: "${ingredientsList}", ¿cuáles de estos alérgenos comunes podrían estar presentes: ${allKnownAllergens}? Responde solo con la lista de alérgenos, separados por comas. Si no hay ninguno, responde "Ninguno".`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setAllergenInfo(response.text);
    } catch (error) {
      console.error('Error analyzing allergens:', error);
      setAllergenInfo('No se pudo analizar.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    const customizations: CartItem['customizations'] = {
      removed:
        item.ingredients
          ?.filter((i) => i.default && !selectedIngredients.has(i.name))
          .map((i) => i.name) || [],
      added: item.extras?.filter((e) => selectedExtras.has(e.name)) || [],
    };
    onConfirm(customizations, quantity);
  };

  const handleIngredientToggle = (name: string) => {
    setSelectedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) newSet.delete(name);
      else newSet.add(name);
      return newSet;
    });
  };

  const handleExtraToggle = (name: string) => {
    setSelectedExtras((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) newSet.delete(name);
      else newSet.add(name);
      return newSet;
    });
  };

  const handleQuantityChange = (amount: number) =>
    setQuantity((prev) => Math.max(1, prev + amount));

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--color-surface)] rounded-lg shadow-xl p-6 max-w-md w-full relative text-white border border-[var(--color-surface-light)] flex flex-col h-[90vh] max-h-[700px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          >
            <XIcon className="w-6 h-6" />
          </button>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-40 bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-slate-500" />
            </div>
          )}
          <h2 className="text-2xl font-bold font-heading">{item.name}</h2>
          <p className="text-lg text-slate-400 font-bold mb-4">
            Precio base: ${item.price.toFixed(2)}
          </p>
        </div>

        <div className="flex-grow overflow-y-auto space-y-4 pr-2 -mr-2">
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Ingredientes</h3>
              <div className="space-y-2">
                {item.ingredients.map((ing) => (
                  <label
                    key={ing.name}
                    className="flex items-center justify-between p-2 bg-[var(--color-surface-light)] rounded-md cursor-pointer"
                  >
                    <span className="text-slate-200">{ing.name}</span>
                    <input
                      type="checkbox"
                      checked={selectedIngredients.has(ing.name)}
                      onChange={() => handleIngredientToggle(ing.name)}
                      className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
          {item.extras && item.extras.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Añadir Extras</h3>
              <div className="space-y-2">
                {item.extras.map((extra) => (
                  <label
                    key={extra.name}
                    className="flex items-center justify-between p-2 bg-[var(--color-surface-light)] rounded-md cursor-pointer"
                  >
                    <span className="text-slate-200">
                      {extra.name}{' '}
                      <span className="text-xs text-green-400">(+${extra.price.toFixed(2)})</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedExtras.has(extra.name)}
                      onChange={() => handleExtraToggle(extra.name)}
                      className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 pt-4">
          <div className="p-3 bg-slate-800/50 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-300">
              {' '}
              <BrainCircuitIcon className="w-5 h-5" /> Análisis de Alérgenos IA{' '}
            </div>
            <div className="text-slate-300 text-sm mt-1 h-5">
              {isAnalyzing
                ? 'Analizando...'
                : allergenInfo || 'Selecciona ingredientes para analizar.'}
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 bg-[var(--color-surface-light)] rounded-full font-bold text-xl flex-shrink-0"
            >
              -
            </button>
            <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 bg-[var(--color-surface-light)] rounded-full font-bold text-xl flex-shrink-0"
            >
              +
            </button>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full bg-[var(--color-primary)] text-[var(--color-text-dark)] py-3 rounded-lg font-bold hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Añadir {quantity} por ${finalPrice.toFixed(2)}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
