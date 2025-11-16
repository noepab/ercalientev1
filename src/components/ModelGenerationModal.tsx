import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XIcon, Wand2Icon } from './icons';
import { MenuItem } from '../types';

interface ModelGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onUpdateModel: (itemId: number, newModelUrl: string) => void;
}

export const ModelGenerationModal: React.FC<ModelGenerationModalProps> = ({
  isOpen,
  onClose,
  item,
  onUpdateModel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleGenerateModel = async () => {
    if (!item || !prompt) return;
    setIsLoading(true);
    setError(null);
    // Simulación de una llamada a un backend para generar el modelo.
    // En una implementación real, aquí se llamaría a la API que dispara el notebook de Colab con el 'prompt'.
    console.log(`Iniciando generación de modelo para "${item.name}" con el prompt: "${prompt}"`);

    setTimeout(() => {
      // Esta es una URL de ejemplo. Debería ser la URL devuelta por el backend tras ejecutar el script de Colab.
      // Usamos un modelo pre-existente para la simulación.
      const exampleModelUrl =
        item.id === 1
          ? 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/sandwich.glb?v=1719586327633'
          : 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/salad.glb?v=1719586618171';

      onUpdateModel(item.id, exampleModelUrl);
      setIsLoading(false);
      setPrompt('');
    }, 8000);
  };

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--color-surface)] rounded-lg shadow-xl p-8 max-w-xl w-full relative text-white border border-[var(--color-surface-light)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center font-heading">
          Modelo 3D de {item.name}
        </h2>

        <div className="aspect-square bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
          {item.modelUrl ? (
            // FIX: Use camelCase for custom element props to align with React conventions.
            <model-viewer
              src={item.modelUrl}
              ar
              arModes="webxr scene-viewer quick-look"
              cameraControls
              autoRotate
              style={{ width: '100%', height: '100%' }}
              alt={`Modelo 3D de ${item.name}`}
            ></model-viewer>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-4"
            >
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-teal-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white">Generando tu modelo 3D...</h3>
              <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                Creando "<i>{prompt}</i>". Esto puede tardar unos minutos...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex flex-col items-center justify-center text-center p-4"
            >
              <h3 className="text-xl font-semibold mb-2">Generar Modelo 3D con IA</h3>
              <p className="text-slate-400 mb-4">
                Describe el objeto que quieres crear. Sé lo más detallado posible para un mejor
                resultado.
              </p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Ej: Un ${item.name} realista con semillas de sésamo en el pan...`}
                rows={3}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] mb-4"
              />
              <button
                onClick={handleGenerateModel}
                disabled={!prompt}
                className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                <Wand2Icon className="w-5 h-5" />
                Generar Modelo
              </button>
            </motion.div>
          )}
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </motion.div>
    </div>
  );
};
