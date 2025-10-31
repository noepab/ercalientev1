import { useState, useMemo, useCallback, useRef, type Dispatch, type SetStateAction } from 'react';
import { GoogleGenAI, Type, Modality, FunctionDeclaration, LiveServerMessage } from '@google/genai';
import { AppState, MenuItem, DrinkItem, DRINK_ITEMS, MORE_DRINK_ITEMS } from '../types';

export interface UseLiveSessionProps {
    setAppState: Dispatch<SetStateAction<AppState>>;
    setStatusMessage: Dispatch<SetStateAction<string>>;
    menuItems: MenuItem[];
    customersOnBill: string[];
    handleAddToCart: (item: MenuItem | DrinkItem, customerName: string, quantity?: number) => void;
}

export const useLiveSession = ({ setAppState, setStatusMessage, menuItems, customersOnBill, handleAddToCart }: UseLiveSessionProps) => {
    const [appState, setLocalAppState] = useState<AppState>(AppState.IDLE);
    const [transcription, setTranscription] = useState('');
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');

    const addToCartFunctionDeclaration: FunctionDeclaration = useMemo(() => ({
        name: 'addToCart',
        parameters: {
            type: Type.OBJECT,
            description: 'Añade uno o más artículos a la comanda del cliente. Utiliza esto cuando el cliente pida comida o bebida.',
            properties: {
                items: {
                    type: Type.ARRAY,
                    description: 'Una lista de artículos para añadir.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            itemId: { type: Type.NUMBER, description: 'El ID del producto.' },
                            quantity: { type: Type.NUMBER, description: 'La cantidad del artículo. Por defecto 1.' },
                        },
                        required: ['itemId', 'quantity']
                    }
                },
                customerName: {
                    type: Type.STRING,
                    description: 'El nombre del cliente para quien es el pedido. Si no se especifica, se preguntará o asignará al cliente por defecto.'
                }
            },
            required: ['items'],
        },
    }), []);

    const systemInstruction = useMemo(() => {
        const allItems = [...menuItems, ...DRINK_ITEMS, ...MORE_DRINK_ITEMS];
        const menuForPrompt = allItems.map(item => ({
            id: item.id,
            name: item.name,
            description: 'description' in item ? item.description : '',
            price: item.price,
            category: 'category' in item ? item.category : 'Bebida',
            allergens: item.allergens || []
        }));
        return `Eres un camarero simpático y servicial en la 'Bocateria Er'caliente'. Tu objetivo es tener una conversación natural con los clientes, responder sus preguntas sobre el menú y ayudarles a hacer su pedido. Eres un experto en la carta. Sé conciso y amigable. No menciones que eres un modelo de IA. Responde siempre en español. La carta es la siguiente:\n${JSON.stringify(menuForPrompt, null, 2)}\n\nCuando un cliente pida explícitamente uno o más artículos, utiliza la herramienta 'addToCart'. Asegúrate de usar los IDs correctos de la carta. Si no especifican para quién es el pedido, no incluyas el campo 'customerName'.`;
    }, [menuItems]);

    const updateGlobalState = useCallback((state: AppState) => {
        setLocalAppState(state);
        setAppState(state);
    }, [setAppState]);

    const cleanupLiveSession = useCallback(() => {
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        inputSourceRef.current?.disconnect();
        inputSourceRef.current = null;
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        inputAudioContextRef.current?.close().catch(console.error);
        inputAudioContextRef.current = null;
        outputAudioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current = null;
        sessionPromiseRef.current = null;
        nextStartTimeRef.current = 0;
        sourcesRef.current.clear();
        setTranscription('');
        if (appState !== AppState.ERROR) {
             setStatusMessage('Conexión terminada. Puedes volver a pulsar el micrófono para reconectar.');
             updateGlobalState(AppState.IDLE);
             setTimeout(() => setStatusMessage(''), 4000);
        }
    }, [appState, updateGlobalState, setStatusMessage]);

    const handleToggleLiveConnection = useCallback(async () => {
        if (appState === AppState.RECORDING) {
            if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => session.close());
            }
            cleanupLiveSession();
            return;
        }

        if (appState !== AppState.IDLE) return;

        updateGlobalState(AppState.PROCESSING);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: async () => {
                        updateGlobalState(AppState.RECORDING);
                        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                        inputSourceRef.current = source;
                        const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        const createBlob = (data: Float32Array): { data: string; mimeType: string } => {
                            const l = data.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) int16[i] = data[i] * 32768;
                            const encode = (bytes: Uint8Array): string => {
                                let binary = '';
                                for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
                                return btoa(binary);
                            };
                            return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
                        };

                        scriptProcessor.onaudioprocess = (e) => sessionPromiseRef.current?.then((s) => s.sendRealtimeInput({ media: createBlob(e.inputBuffer.getChannelData(0)) }));
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (typeof base64Audio === 'string') {
                            const ctx = outputAudioContextRef.current;
                            if (!ctx) return;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                            const decode = (base64: string): Uint8Array => {
                                const binaryString = atob(base64);
                                const len = binaryString.length;
                                const bytes = new Uint8Array(len);
                                for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
                                return bytes;
                            };
                            const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
                                const dataInt16 = new Int16Array(data.buffer);
                                const frameCount = dataInt16.length / 1;
                                const buffer = ctx.createBuffer(1, frameCount, 24000);
                                const channelData = buffer.getChannelData(0);
                                for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * 1 + 0] / 32768.0;
                                return buffer;
                            };
                            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx);
                            const source = ctx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(ctx.destination);
                            source.addEventListener('ended', () => sourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                        
                        // Handle transcription
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                        }
                        setTranscription(`Tú: ${currentInputTranscriptionRef.current}\nIA: ${currentOutputTranscriptionRef.current}`);

                        if (message.serverContent?.turnComplete) {
                            // Optionally, do something with the full turn transcription
                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                        }


                        if (message.toolCall) {
                            for (const fc of message.toolCall.functionCalls) {
                                if (fc.name === 'addToCart') {
                                    const { items, customerName } = fc.args as { items?: { itemId: number, quantity: number }[], customerName?: string };
                                    let resultMessage = '';
                                    if (items && Array.isArray(items)) {
                                        let finalCustomerName = customerName || customersOnBill[0];
                                        if (!finalCustomerName) {
                                            resultMessage = "Error: Pregunta para quién es el pedido.";
                                        } else {
                                            for (const orderItem of items) {
                                                const { itemId, quantity } = orderItem;
                                                const allItems = [...menuItems, ...DRINK_ITEMS, ...MORE_DRINK_ITEMS];
                                                const itemToAdd = allItems.find(i => i.id === itemId);
                                                if (itemToAdd) {
                                                    handleAddToCart(itemToAdd, finalCustomerName, quantity);
                                                    resultMessage += `Añadido ${quantity} ${itemToAdd.name} para ${finalCustomerName}. `;
                                                } else {
                                                    resultMessage += `Error: No se encontró el artículo ID ${itemId}. `;
                                                }
                                            }
                                        }
                                    } else {
                                        resultMessage = "Error: Faltan los artículos.";
                                    }
                                    sessionPromiseRef.current?.then((session) => session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: resultMessage } } }));
                                }
                            }
                        }

                        if (message.serverContent?.interrupted) {
                            for (const source of sourcesRef.current.values()) source.stop();
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e.message, e);
                        setStatusMessage('Error en la conexión. Intenta reconectar.');
                        updateGlobalState(AppState.ERROR);
                        cleanupLiveSession();
                        setTimeout(() => {
                            updateGlobalState(AppState.IDLE);
                            setStatusMessage('');
                        }, 5000);
                    },
                    onclose: () => cleanupLiveSession(),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: systemInstruction,
                    tools: [{ functionDeclarations: [addToCartFunctionDeclaration] }],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                }
            });
        } catch (error) {
            console.error("Failed to start Live session:", error);
            let errorMessage = "No se pudo iniciar la sesión de voz.";
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') errorMessage = "Permiso de micrófono denegado.";
                else if (error.message.toLowerCase().includes('network')) errorMessage = "Error de red.";
            }
            setStatusMessage(errorMessage);
            updateGlobalState(AppState.ERROR);
            cleanupLiveSession();
            setTimeout(() => {
                updateGlobalState(AppState.IDLE);
                setStatusMessage('');
            }, 5000);
        }
    }, [appState, systemInstruction, cleanupLiveSession, customersOnBill, handleAddToCart, addToCartFunctionDeclaration, menuItems, updateGlobalState, setStatusMessage]);

    return { appState, transcription, handleToggleLiveConnection };
};