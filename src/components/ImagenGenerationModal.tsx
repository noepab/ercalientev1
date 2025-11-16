import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { XIcon, SparklesIcon, ImageIcon } from './icons';

interface ImagenGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToMenu: (itemData: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  }) => void;
}

const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];

export const ImagenGenerationModal: React.FC<ImagenGenerationModalProps> = ({
  isOpen,
  onClose,
  onAddToMenu,
}) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const finalPrompt = `${prompt}, sobre un fondo blanco liso, aislado. Fotografía de producto optimizada para la creación de modelos 3D.`;
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio,
        },
      });
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      setGeneratedImage(`data:image/jpeg;base64,${base64ImageBytes}`);
    } catch (e) {
      console.error(e);
      setError('No se pudo generar la imagen. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToMenu = () => {
    if (generatedImage && prompt) {
      onAddToMenu({
        name: prompt.substring(0, 30), // Truncate name for display
        description: `Creación de IA: ${prompt}`,
        price: 15.0, // Default price
        imageUrl: generatedImage,
      });
      onClose();
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
        className="bg-[var(--color-surface)] rounded-lg shadow-xl p-8 max-w-lg w-full relative text-white border border-[var(--color-surface-light)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center font-heading">
          Crear Plato con IA (Imagen 4.0)
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Describe tu plato ideal:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Ej: Hamburguesa gourmet con queso azul y rúcula, en un plato de pizarra."
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Formato de imagen:
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {aspectRatios.map((ar) => (
                <option key={ar} value={ar}>
                  {ar}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={generateImage}
            disabled={isLoading || !prompt}
            className="w-full bg-teal-800 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors disabled:bg-slate-600 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Generando...'
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" /> Generar Imagen
              </>
            )}
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-teal-500 mx-auto"></div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        {generatedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-4">
            <div className="aspect-auto bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={generatedImage}
                alt="Generated dish"
                className="max-w-full max-h-64 object-contain"
              />
            </div>
            <button
              onClick={handleAddToMenu}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-500 transition-colors"
            >
              Añadir al Menú
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
