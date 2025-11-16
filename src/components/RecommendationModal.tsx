import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XIcon, SparklesIcon, BrainCircuitIcon, ImageIcon } from './icons';
import { DrinkItem, MenuItem, MENU_ITEMS, DRINK_ITEMS, MORE_DRINK_ITEMS } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAndAdd: (item: MenuItem | DrinkItem) => void;
  diningOption: 'dine-in' | 'takeout' | null;
}

type Recommendation = MenuItem | DrinkItem;

const findFullItem = (rec: Recommendation): MenuItem | DrinkItem | undefined => {
  const allItems = [...MENU_ITEMS, ...DRINK_ITEMS, ...MORE_DRINK_ITEMS];
  return allItems.find((item) => item.name.toLowerCase() === rec.name.toLowerCase());
};

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  onReviewAndAdd,
  diningOption,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [expertPrompt, setExpertPrompt] = useState('');
  const [expertResponse, setExpertResponse] = useState('');

  const getRecommendations = async () => {
    setIsLoading(true);
    setRecommendations([]);
    setExpertResponse('');
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      if (isExpertMode && expertPrompt) {
        const menuString = [...MENU_ITEMS, ...DRINK_ITEMS, ...MORE_DRINK_ITEMS]
          .map((item) => `${item.name} - ${'description' in item ? item.description : 'Bebida'}`)
          .join('\n');
        const prompt = `Soy un cliente pidiendo para ${diningOption === 'dine-in' ? 'comer aquí' : 'llevar'}. Mi petición es: "${expertPrompt}".\nBasado en esta petición y la siguiente carta, dame una recomendación razonada y detallada. No me des solo una lista, explícame por qué son buenas opciones.\n\nCARTA:\n${menuString}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingBudget: 32768 },
          },
        });
        setExpertResponse(response.text);
      } else {
        const prompt = `Basado en que estoy pidiendo para ${diningOption === 'dine-in' ? 'comer aquí' : 'llevar'}, recomiéndame 3 items populares (comida o bebida) de la carta. Devuelve solo un array JSON con los objetos de los items recomendados. Incluye el 'id', 'name', 'price' y 'imageUrl' exactos de la carta.`;
        const allItems = [...MENU_ITEMS, ...DRINK_ITEMS, ...MORE_DRINK_ITEMS];
        const contextPrompt = `CONTEXTO DE LA CARTA:\n${JSON.stringify(allItems.map(({ id, name, price, imageUrl }) => ({ id, name, price, imageUrl })))} \n\nPETICIÓN: ${prompt}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contextPrompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  imageUrl: { type: Type.STRING },
                },
              },
            },
          },
        });
        setRecommendations(JSON.parse(response.text));
      }
    } catch (e) {
      console.error(e);
      setError('No se pudieron obtener recomendaciones. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCartClick = (item: Recommendation) => {
    const fullItem = findFullItem(item);
    if (fullItem) {
      onReviewAndAdd(fullItem);
    } else {
      console.error('No se encontró el artículo completo para:', item.name);
    }
  };

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
        className="bg-[var(--color-surface)] rounded-lg shadow-xl p-8 max-w-2xl w-full relative text-white border border-[var(--color-surface-light)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center font-heading">
          Recomendaciones de la IA
        </h2>

        <div className="flex justify-center mb-6">
          <label className="flex items-center cursor-pointer">
            <span
              className={`mr-3 font-semibold ${!isExpertMode ? 'text-[var(--color-primary)]' : 'text-slate-400'}`}
            >
              Sugerencias Rápidas
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={isExpertMode}
                onChange={() => setIsExpertMode(!isExpertMode)}
                className="sr-only"
              />
              <div className="block bg-slate-600 w-14 h-8 rounded-full"></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isExpertMode ? 'transform translate-x-6 bg-purple-400' : ''}`}
              ></div>
            </div>
            <span
              className={`ml-3 font-semibold ${isExpertMode ? 'text-purple-400' : 'text-slate-400'}`}
            >
              Modo Experto
            </span>
            <BrainCircuitIcon
              className={`w-5 h-5 ml-2 ${isExpertMode ? 'text-purple-400' : 'text-slate-400'}`}
            />
          </label>
        </div>

        {recommendations.length === 0 && !expertResponse && !isLoading && !error && (
          <div className="text-center py-8">
            {isExpertMode ? (
              <>
                <p className="text-slate-400 mb-4">
                  Describe tu petición para una recomendación detallada. <br /> (Ej: "Busco algo
                  ligero y sin gluten para cenar")
                </p>
                <textarea
                  value={expertPrompt}
                  onChange={(e) => setExpertPrompt(e.target.value)}
                  rows={3}
                  className="w-full max-w-md mx-auto p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="¿Qué te apetece?"
                />
              </>
            ) : (
              <p className="text-slate-400 mb-6">
                ¿No sabes qué pedir? Deja que la IA te sugiera algo delicioso.
              </p>
            )}
            <button
              onClick={getRecommendations}
              disabled={isExpertMode && !expertPrompt}
              className="bg-sky-800 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto mt-4 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <SparklesIcon className="w-5 h-5" />
              {isExpertMode ? 'Obtener Análisis Experto' : 'Obtener Sugerencias'}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[var(--color-primary)] mx-auto mb-4"></div>
            <p>{isExpertMode ? 'Analizando tu petición...' : 'Buscando las mejores opciones...'}</p>
          </div>
        )}

        {error && <p className="text-center text-red-500 py-8">{error}</p>}

        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--color-surface-light)] rounded-lg p-4 text-center"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-700 rounded-md mb-2 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-slate-500" />
                  </div>
                )}
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-[var(--color-primary)]">${item.price.toFixed(2)}</p>
                <button
                  onClick={() => handleAddToCartClick(item)}
                  className="mt-2 w-full bg-[var(--color-primary)] text-sm text-[var(--color-text-dark)] py-1.5 rounded-md font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Revisar/Añadir
                </button>
              </div>
            ))}
          </div>
        )}

        {expertResponse && (
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg max-h-80 overflow-y-auto">
            <h3 className="font-bold text-lg text-purple-300 mb-2">Recomendación Experta:</h3>
            <div className="prose prose-invert prose-sm text-slate-300 whitespace-pre-wrap">
              {expertResponse}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
