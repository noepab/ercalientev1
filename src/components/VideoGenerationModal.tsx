import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
// FIX: Corrected the import of 'GenerateVideosOperation' from '@google/genai' as 'GenerateVideosOperationResponse' is not an exported member.
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import { XIcon, VideoIcon, KeyIcon, AlertTriangleIcon, UploadCloudIcon, MusicNoteIcon } from './icons';

interface VideoGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const aspectRatios = ["16:9", "9:16"];
const resolutions = ["720p", "1080p"];
const musicTracks = [
    { name: 'Sin música', url: '' },
    { name: 'Lofi Relajante', url: 'https://cdn.pixabay.com/audio/2022/02/07/audio_a088929763.mp3' },
    { name: 'Ambiente Inspirador', url: 'https://cdn.pixabay.com/audio/2022/08/04/audio_29b28b9728.mp3' },
    { name: 'Electrónica Animada', url: 'https://cdn.pixabay.com/audio/2022/11/17/audio_8746f3488f.mp3' },
    { name: 'Motivación Acústica', url: 'https://cdn.pixabay.com/audio/2022/11/11/audio_a270776f8e.mp3' },
];

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const VideoGenerationModal: React.FC<VideoGenerationModalProps> = ({ isOpen, onClose }) => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<{file: File, base64: string, mimeType: string} | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [resolution, setResolution] = useState('720p');
    const [selectedMusic, setSelectedMusic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if(isOpen) {
            checkApiKey();
            setPrompt('');
            setImage(null);
            setPreview(null);
            setAspectRatio('16:9');
            setResolution('720p');
            setIsLoading(false);
            setLoadingMessage('');
            setGeneratedVideoUrl(null);
            setError(null);
            setSelectedMusic('');
        }
    }, [isOpen]);

    useEffect(() => {
        const videoEl = videoRef.current;
        const audioEl = audioRef.current;

        if (videoEl && audioEl) {
            const handlePlay = () => audioEl.play().catch(e => console.error("Audio play failed:", e));
            const handlePause = () => audioEl.pause();
            const handleSeeking = () => {
                if (Math.abs(videoEl.currentTime - audioEl.currentTime) > 0.5) {
                    audioEl.currentTime = videoEl.currentTime;
                }
            };
            const handleVolumeChange = () => {
                audioEl.volume = videoEl.volume;
            };

            videoEl.addEventListener('play', handlePlay);
            videoEl.addEventListener('pause', handlePause);
            videoEl.addEventListener('seeking', handleSeeking);
            videoEl.addEventListener('volumechange', handleVolumeChange);
            
            audioEl.volume = videoEl.volume;
            if (!videoEl.paused) {
                audioEl.currentTime = videoEl.currentTime;
                handlePlay();
            }

            return () => {
                videoEl.removeEventListener('play', handlePlay);
                videoEl.removeEventListener('pause', handlePause);
                videoEl.removeEventListener('seeking', handleSeeking);
                videoEl.removeEventListener('volumechange', handleVolumeChange);
            };
        }
    }, [generatedVideoUrl]);

    const checkApiKey = async () => {
        const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
        setApiKeySelected(hasKey);
    };

    const handleSelectKey = async () => {
        await (window as any).aistudio?.openSelectKey();
        setApiKeySelected(true); // Assume success to avoid race condition
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            const base64 = await blobToBase64(file);
            setImage({ file, base64, mimeType: file.type });
        }
    };

    const generateVideo = async () => {
        if (!prompt && !image) {
            setError("Se requiere un texto o una imagen para generar el vídeo.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);
        setLoadingMessage('Iniciando generación de vídeo...');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // FIX: Updated the type annotation for the 'operation' variable to use the correct 'GenerateVideosOperation' type.
            let operation: GenerateVideosOperation = await ai.models.generateVideos({
              model: 'veo-3.1-fast-generate-preview',
              prompt,
              ...(image && { image: { imageBytes: image.base64, mimeType: image.mimeType } }),
              config: { numberOfVideos: 1, resolution: resolution as '720p' | '1080p', aspectRatio: aspectRatio as '16:9' | '9:16' }
            });

            setLoadingMessage('Generando vídeo... Esto puede tardar varios minutos.');

            while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 10000));
              try {
                operation = await ai.operations.getVideosOperation({operation: operation});
              } catch(e: any) {
                if(e.message?.includes("Requested entity was not found")) {
                    setError("Clave API no válida. Por favor, selecciona una clave válida para continuar.");
                    setApiKeySelected(false);
                    setIsLoading(false);
                    return;
                }
                throw e;
              }
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if(downloadLink) {
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const videoBlob = await response.blob();
                setGeneratedVideoUrl(URL.createObjectURL(videoBlob));
            } else {
                throw new Error("La operación finalizó pero no se encontró la URL del vídeo.")
            }

        } catch (e: any) {
            console.error(e);
            setError(`Error al generar el vídeo: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderContent = () => {
        if (!apiKeySelected) {
            return (
                <div className="text-center">
                     <KeyIcon className="w-16 h-16 mx-auto text-amber-500 mb-4"/>
                    <h3 className="text-xl font-bold mb-2">Se requiere una clave API</h3>
                    <p className="text-slate-400 mb-6">Para usar la generación de vídeo con Veo, necesitas seleccionar una clave API. Esto puede incurrir en costes.</p>
                    <p className="text-xs text-slate-500 mb-6">Consulta la <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-400">documentación de facturación</a> para más detalles.</p>
                    <button onClick={handleSelectKey} className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-lg">Seleccionar Clave API</button>
                </div>
            );
        }

        if (isLoading) {
            return (
                 <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-lg font-semibold">{loadingMessage}</p>
                </div>
            )
        }

        if (generatedVideoUrl) {
            return (
                <div className="space-y-4">
                    <video ref={videoRef} src={generatedVideoUrl} controls autoPlay loop className="w-full rounded-lg" />
                    {selectedMusic && <audio ref={audioRef} src={selectedMusic} loop />}
                    <button onClick={() => setGeneratedVideoUrl(null)} className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg">Generar otro vídeo</button>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div 
                    className="w-full h-40 border-2 border-dashed border-[var(--color-surface-light)] rounded-lg flex items-center justify-center text-center cursor-pointer hover:border-indigo-500"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    {preview ? <img src={preview} alt="Vista previa" className="w-full h-full object-contain rounded-lg p-1" /> : 
                    <div>
                        <UploadCloudIcon className="w-10 h-10 mx-auto text-slate-500 mb-2"/>
                        <p className="text-sm">Subir imagen (opcional)</p>
                    </div>
                    }
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Describe tu vídeo:</label>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="Ej: Un dron vuela lentamente alrededor de este plato." className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className="block text-sm font-medium text-slate-300 mb-1">Formato:</label>
                        <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                        </select>
                    </div>
                     <div>
                         <label className="block text-sm font-medium text-slate-300 mb-1">Resolución:</label>
                        <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {resolutions.map(res => <option key={res} value={res}>{res}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1">
                        <MusicNoteIcon className="w-4 h-4" />
                        Música de Fondo:
                    </label>
                    <select value={selectedMusic} onChange={(e) => setSelectedMusic(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {musicTracks.map(track => <option key={track.name} value={track.url}>{track.name}</option>)}
                    </select>
                </div>
                 <button onClick={generateVideo} className="w-full bg-indigo-800 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <VideoIcon className="w-5 h-5"/> Generar Vídeo con Veo
                </button>
                 {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[var(--color-surface)] rounded-lg shadow-xl p-8 max-w-lg w-full relative text-white border border-[var(--color-surface-light)]"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold mb-6 text-center font-heading">Generador de Vídeo IA</h2>
                {renderContent()}
            </motion.div>
        </div>
    );
};