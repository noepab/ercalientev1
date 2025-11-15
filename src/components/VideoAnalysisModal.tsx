import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { XIcon, UploadCloudIcon, ClapperboardIcon } from './icons';

interface VideoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const VideoAnalysisModal: React.FC<VideoAnalysisModalProps> = ({ isOpen, onClose }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setPreview(URL.createObjectURL(file));
      setResponse(null);
      setError(null);
    }
  };

  const analyzeVideo = async () => {
    if (!videoFile || !prompt) return;
    setIsLoading(true);
    setError(null);
    setResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const videoPart = await fileToGenerativePart(videoFile);

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [videoPart, { text: prompt }] },
      });

      setResponse(result.text);
    } catch (e) {
      console.error(e);
      setError('Error al analizar el vídeo. Asegúrate de que no sea muy largo.');
    } finally {
      setIsLoading(false);
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
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center font-heading">Analizar Vídeo con IA</h2>

        <div
          className="w-full h-48 bg-slate-800 border-2 border-dashed border-[var(--color-surface-light)] rounded-lg flex items-center justify-center text-center cursor-pointer hover:border-purple-500 mb-4"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {preview ? (
            <video src={preview} controls className="w-full h-full object-contain rounded-lg" />
          ) : (
            <div>
              <UploadCloudIcon className="w-12 h-12 mx-auto text-slate-500 mb-2" />
              <p>Haz clic para subir un vídeo</p>
            </div>
          )}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          placeholder="Haz una pregunta sobre el vídeo..."
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={!videoFile}
        />

        <button
          onClick={analyzeVideo}
          disabled={isLoading || !videoFile || !prompt}
          className="w-full mt-4 bg-purple-800 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            'Analizando...'
          ) : (
            <>
              <ClapperboardIcon className="w-5 h-5" /> Analizar Vídeo
            </>
          )}
        </button>

        {isLoading && <div className="text-center mt-4 text-purple-300">Procesando vídeo...</div>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        {response && (
          <div className="mt-4 p-4 bg-slate-800/50 rounded-lg max-h-40 overflow-y-auto">
            <h3 className="font-bold text-lg text-purple-300 mb-2">Respuesta de la IA:</h3>
            <p className="text-slate-300 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
