import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { XIcon, UploadCloudIcon, ImageIcon } from './icons';
import { MenuItem } from '../types';
import { GoogleGenAI } from '@google/genai';

interface ImageAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatch: (item: MenuItem) => void;
  menuItems: MenuItem[];
}

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const ImageAnalysisModal: React.FC<ImageAnalysisModalProps> = ({ isOpen, onClose, onMatch, menuItems }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MenuItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const imagePart = await fileToGenerativePart(image);
      const menuString = menuItems.map(item => `${item.name} (ID: ${item.id})`).join(', ');
      const prompt = `Observa la imagen. ¿Cuál de los siguientes platos del menú se parece más? Devuelve solo el nombre exacto del plato. Menú: [${menuString}]`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] }
      });

      const matchedItemName = response.text.trim();
      const matchedItem = menuItems.find(item => item.name.toLowerCase() === matchedItemName.toLowerCase());

      if (matchedItem) {
        setResult(matchedItem);
      } else {
        setError("No se pudo encontrar una coincidencia clara en el menú.");
      }
    } catch (e) {
      console.error(e);
      setError("Error al analizar la imagen.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <h2 className="text-3xl font-bold mb-4 text-center font-heading">¿Qué te apetece?</h2>
        <p className="text-center text-slate-400 mb-6">Sube una foto de un plato y te diremos si lo tenemos en la carta.</p>
        
        <div 
            className="w-full h-64 border-2 border-dashed border-[var(--color-surface-light)] rounded-lg flex items-center justify-center text-center cursor-pointer hover:border-[var(--color-primary)]"
            onClick={() => fileInputRef.current?.click()}
        >
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            {preview ? <img src={preview} alt="Vista previa" className="w-full h-full object-contain rounded-lg" /> : 
            <div>
                <UploadCloudIcon className="w-12 h-12 mx-auto text-slate-500 mb-2"/>
                <p>Haz clic para subir una imagen</p>
            </div>
            }
        </div>
        
        {image && <button onClick={analyzeImage} disabled={isLoading} className="w-full mt-4 bg-purple-800 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:bg-slate-600"> {isLoading ? 'Analizando...' : 'Buscar en el menú'} </button>}

        {isLoading && <div className="text-center mt-4">Analizando imagen...</div>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        {result && (
            <div className="mt-6 p-4 bg-[var(--color-surface-light)] rounded-lg flex items-center gap-4">
                {result.imageUrl ? (
                    <img src={result.imageUrl} alt={result.name} className="w-24 h-24 object-cover rounded-md" />
                ) : (
                    <div className="w-24 h-24 bg-slate-700 rounded-md flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-10 h-10 text-slate-500" />
                    </div>
                )}
                <div className="flex-grow">
                    <p className="text-slate-300">¡Lo tenemos!</p>
                    <h3 className="font-bold text-lg">{result.name}</h3>
                    <p className="text-[var(--color-primary)] font-semibold">${result.price.toFixed(2)}</p>
                </div>
                <button onClick={() => onMatch(result)} className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-500">Añadir</button>
            </div>
        )}

      </motion.div>
    </div>
  );
};