

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { CartItem, MenuItem, DrinkItem, Order, MENU_ITEMS, DRINK_ITEMS, MORE_DRINK_ITEMS } from '../types';

export interface UseOrderProps {
    addToast: (message: string, type?: 'success' | 'error') => void;
}

export const useOrder = ({ addToast }: UseOrderProps) => {
    const [diningOption, setDiningOption] = useState<'dine-in' | 'takeout' | null>(null);
    const [tableNumber, setTableNumber] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartUpdateIndicator, setCartUpdateIndicator] = useState(0);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [pendingItemForNameAssignment, setPendingItemForNameAssignment] = useState<{ item: MenuItem | DrinkItem; quantity: number, customizations?: CartItem['customizations'] } | null>(null);
    
    const billTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const customersOnBill = useMemo(() => [...new Set(cartItems.map(item => item.customerName))].sort(), [cartItems]);

    useEffect(() => { try { const storedHistory = localStorage.getItem('orderHistory'); if (storedHistory) setOrderHistory(JSON.parse(storedHistory)); } catch (error) { console.error("Failed to load order history", error); } }, []);
    
    useEffect(() => { 
        const timer = setInterval(() => { 
            setCartItems(prevItems => { 
                const needsUpdate = prevItems.some(item => item.status === 'pending' && Date.now() - item.addedAt > 20000); 
                if (!needsUpdate) return prevItems; 
                return prevItems.map(item => (item.status === 'pending' && Date.now() - item.addedAt > 20000) ? { ...item, status: 'ordered' } : item ); 
            }); 
        }, 1000); 
        return () => clearInterval(timer); 
    }, []);

    const handleAddToCart = useCallback((item: MenuItem | DrinkItem, customerName: string, quantity: number = 1, customizations?: CartItem['customizations']) => {
        const basePrice = item.price;
        let finalPrice = basePrice;
        if (customizations?.added) {
            finalPrice += customizations.added.reduce((sum, extra) => sum + extra.price, 0);
        }

        const newCartItem: CartItem = {
            cartItemId: `${Date.now()}-${item.id}`,
            id: item.id,
            name: item.name,
            basePrice,
            price: finalPrice,
            quantity,
            customerName,
            status: 'pending',
            itemType: 'description' in item ? 'menu' : 'drink',
            addedAt: Date.now(),
            customizations
        };

        setCartItems(prev => [...prev, newCartItem]);
        setCartUpdateIndicator(c => c + 1);
        addToast(`${item.name} añadido para ${customerName}`);
    }, [addToast]);

    const handleInitiateAddToCart = (item: MenuItem | DrinkItem, quantity: number, customizations: CartItem['customizations'] | undefined, promptForName: () => void) => {
        if (customersOnBill.length > 0) {
            handleAddToCart(item, customersOnBill[0], quantity, customizations);
        } else {
            setPendingItemForNameAssignment({ item, quantity, customizations });
            promptForName();
        }
    };

    const handleFinalizeAddToCart = (name: string) => {
        if (pendingItemForNameAssignment) {
            const { item, quantity, customizations } = pendingItemForNameAssignment;
            handleAddToCart(item, name, quantity, customizations);
            setPendingItemForNameAssignment(null);
        }
    };

    const handleCancelOrderItem = useCallback((cartItemId: string) => { 
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId)); 
    }, []);

    const handlePaymentSuccess = (tip: number) => { 
        const newOrder: Order = { id: Date.now().toString(), date: new Date().toISOString(), items: cartItems, total: billTotal + tip, diningOption, tableNumber }; 
        setOrderHistory(prevHistory => { 
            const updatedHistory = [newOrder, ...prevHistory].slice(0, 20); 
            localStorage.setItem('orderHistory', JSON.stringify(updatedHistory)); 
            return updatedHistory; 
        }); 
        setCartItems([]); 
        setDiningOption(null); 
        setTableNumber(null); 
    };
    
    const handleClearBill = () => setCartItems([]);
    
    const handleReorder = useCallback((order: Order) => { 
        const customerForReorder = customersOnBill[0] || "Cliente"; 
        order.items.forEach(item => { 
            const allItems = [...MENU_ITEMS, ...DRINK_ITEMS, ...MORE_DRINK_ITEMS]; 
            const fullItem = allItems.find(i => i.id === item.id && i.name === item.name); 
            if (fullItem) handleAddToCart(fullItem, customerForReorder, item.quantity, item.customizations); 
        }); 
    }, [customersOnBill, handleAddToCart]);
    
    const handleReassignCartItem = (cartItemId: string, newCustomerName: string) => { 
        setCartItems(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, customerName: newCustomerName } : item)); 
        setCartUpdateIndicator(c => c + 1); 
    };

    const handleAddNewItemToCustomer = (itemType: 'menu' | 'drink', itemId: number, customerName: string | null) => { 
        let itemToAdd = itemType === 'menu' ? MENU_ITEMS.find(i => i.id === itemId) : [...DRINK_ITEMS, ...MORE_DRINK_ITEMS].find(i => i.id === itemId); 
        if (itemToAdd) { 
            if (customerName) handleAddToCart(itemToAdd, customerName, 1, { removed: [], added: [] }); 
            else handleInitiateAddToCart(itemToAdd, 1, { removed: [], added: [] }, () => { console.log("Prompting for name for new diner"); }); 
        } 
    };

    const handleReadBillAloud = async () => { 
        if (isGeneratingAudio || cartItems.length === 0) return; 
        setIsGeneratingAudio(true); 
        try { 
            const itemsByCustomer = cartItems.reduce((acc, item) => { (acc[item.customerName] = acc[item.customerName] || []).push(item); return acc; }, {} as Record<string, CartItem[]>); 
            let prompt = "Resumen del pedido. "; 
            for (const customerName of Object.keys(itemsByCustomer).sort()) { 
                prompt += `Para ${customerName}: ${itemsByCustomer[customerName].map(item => `${item.quantity} ${item.name}`).join(', ')}. `; 
            } 
            prompt += `El total es ${billTotal.toFixed(2)} euros.`; 
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash-preview-tts", contents: [{ parts: [{ text: prompt }] }], config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } }, }); 
            
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data; 
            if (typeof base64Audio === 'string') { 
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000}); 
                const decode = (base64: string): Uint8Array => { const binaryString = atob(base64); const len = binaryString.length; const bytes = new Uint8Array(len); for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i); return bytes; }; 
                const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => { const dataInt16 = new Int16Array(data.buffer); const frameCount = dataInt16.length / 1; const buffer = ctx.createBuffer(1, frameCount, 24000); const channelData = buffer.getChannelData(0); for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * 1 + 0] / 32768.0; return buffer; }; 
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx); 
                const source = audioCtx.createBufferSource(); 
                source.buffer = audioBuffer; 
                source.connect(audioCtx.destination); 
                source.start(); 
                source.onended = () => audioCtx.close(); 
            } else throw new Error("No audio data received."); 
        } catch (error) { 
            console.error("Error generating speech:", error); 
            addToast("Error al generar el audio.", 'error'); 
        } finally { 
            setIsGeneratingAudio(false); 
        } 
    };

    return { 
        diningOption, setDiningOption, 
        tableNumber, setTableNumber, 
        cartItems, setCartItems, 
        cartUpdateIndicator, 
        billTotal, 
        customersOnBill, 
        orderHistory, 
        isGeneratingAudio, 
        pendingItemForNameAssignment, setPendingItemForNameAssignment, 
        handleAddToCart, 
        handleInitiateAddToCart, 
        handleFinalizeAddToCart, 
        handleCancelOrderItem, 
        handlePaymentSuccess, 
        handleClearBill, 
        handleReorder, 
        handleReassignCartItem, 
        handleAddNewItemToCustomer, 
        handleReadBillAloud 
    };
};