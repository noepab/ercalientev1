import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { XIcon, SendIcon, BotIcon, UserIcon, ExternalLinkIcon } from './icons';
import { ChatMessage, Coordinates } from '../types';

interface ChatbotModalProps {
    isOpen: boolean;
    onClose: () => void;
    userLocation: Coordinates | null;
}

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose, userLocation }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 0, sender: 'ai', text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte? Puedo buscar información en la web o encontrar lugares cercanos." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMessage: ChatMessage = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const config: any = {
                tools: [{ googleSearch: {} }, { googleMaps: {} }],
            };
            if(userLocation) {
                config.toolConfig = {
                    retrievalConfig: {
                        latLng: {
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }
                    }
                }
            }

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: input,
                config,
            });

            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            const sources = groundingChunks
                ?.map(chunk => (chunk.web || chunk.maps))
                .filter(source => source?.uri)
                .map(source => ({ uri: source.uri, title: source.title || 'Fuente' })) ?? [];

            const aiMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                text: response.text,
                sources: sources.length > 0 ? sources : undefined,
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: 'error',
                text: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="bg-[var(--color-surface)] rounded-lg shadow-xl max-w-lg w-full h-[80vh] flex flex-col text-white border border-[var(--color-surface-light)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-[var(--color-surface-light)]">
                    <h2 className="text-xl font-bold font-heading">Asistente IA</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                            >
                                {msg.sender !== 'user' && (
                                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-600">
                                        <BotIcon className="w-5 h-5" />
                                    </div>
                                )}
                                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-800' : msg.sender === 'error' ? 'bg-red-800' : 'bg-slate-600'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-slate-500/50">
                                            <h4 className="text-xs font-semibold text-slate-300 mb-1">Fuentes:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((source, index) => (
                                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" key={index} className="text-xs bg-slate-700 hover:bg-slate-500 rounded-full px-2 py-1 flex items-center gap-1 transition-colors">
                                                        <span>{source.title}</span>
                                                        <ExternalLinkIcon className="w-3 h-3"/>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {msg.sender === 'user' && (
                                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-800">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-600"> <BotIcon className="w-5 h-5" /> </div>
                            <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-slate-600 flex items-center space-x-1.5">
                                <span className="h-2 w-2 bg-[var(--color-primary)] rounded-full animate-pulse-dot-1"></span>
                                <span className="h-2 w-2 bg-[var(--color-primary)] rounded-full animate-pulse-dot-2"></span>
                                <span className="h-2 w-2 bg-[var(--color-primary)] rounded-full animate-pulse-dot-3"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t border-[var(--color-surface-light)]">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder="Escribe tu pregunta..."
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-3 bg-blue-800 rounded-full text-white hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
