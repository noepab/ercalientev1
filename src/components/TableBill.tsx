import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Fix: Corrected import path for types.
import { CartItem } from '../types';
import { MicIcon, CheckCircleIcon, Volume2Icon, QrCodeIcon } from './icons';
import { CartItemRow } from './CartItemRow';

interface TableBillProps {
    items: CartItem[];
    tableNumber: string | null;
    onPay: () => void;
    onClear: () => void;
    diningOption: 'dine-in' | 'takeout' | null;
    cartUpdateIndicator: number;
    onShowQrCode: () => void;
    onCancelItem: (cartItemId: string) => void;
    onReadAloud: () => void;
    isGeneratingAudio: boolean;
    onReassignItem: (cartItemId: string, newCustomerName: string) => void;
    onAddNewItemToCustomer: (itemType: 'menu' | 'drink', itemId: number, customerName: string | null) => void;
    customersOnBill: string[];
}

const TableBillComponent: React.FC<TableBillProps> = ({ items, tableNumber, onPay, onClear, diningOption, cartUpdateIndicator, onShowQrCode, onCancelItem, onReadAloud, isGeneratingAudio, onReassignItem, onAddNewItemToCustomer, customersOnBill }) => {
    const [isGlowing, setIsGlowing] = useState(false);
    const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [displayTotal, setDisplayTotal] = useState(total);
    const prevTotalRef = useRef(total);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const previousTotal = prevTotalRef.current;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (previousTotal === total) {
            setDisplayTotal(total);
            return;
        }
        const duration = 500;
        const startTime = performance.now();
        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeOutQuad = (t: number) => t * (2 - t);
            const easedProgress = easeOutQuad(progress);
            setDisplayTotal(previousTotal + (total - previousTotal) * easedProgress);
            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayTotal(total);
            }
        };
        animationFrameRef.current = requestAnimationFrame(animate);
        prevTotalRef.current = total;
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [total]);

    const itemsByCustomer = useMemo(() => items.reduce((acc: Record<string, CartItem[]>, item) => {
        (acc[item.customerName] = acc[item.customerName] || []).push(item);
        return acc;
    }, {} as Record<string, CartItem[]>), [items]);

    const sortedCustomerNames = useMemo(() => Object.keys(itemsByCustomer).sort(), [itemsByCustomer]);

    useEffect(() => {
        if (cartUpdateIndicator > 0) {
            setIsGlowing(true);
            const timer = setTimeout(() => setIsGlowing(false), 500);
            return () => clearTimeout(timer);
        }
    }, [cartUpdateIndicator]);

    const diningTitle = diningOption === 'dine-in' ? `Mesa ${tableNumber || '...'}` : 'Pedido para Llevar';

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCustomer: string | null) => {
        e.preventDefault();
        e.stopPropagation();
        const data = e.dataTransfer.getData('text/plain');
        setDragOverTarget(null);
        if (!data) return;
        const [type, ...idParts] = data.split(/-(.+)/);
        const id = idParts[0];
        if (type === 'cartItem') {
            if (targetCustomer) {
                const draggedItem = items.find(i => i.cartItemId === id);
                if (draggedItem && draggedItem.customerName !== targetCustomer) {
                    onReassignItem(id, targetCustomer);
                }
            }
        } else if (type === 'menu' || type === 'drink') {
            onAddNewItemToCustomer(type as 'menu' | 'drink', parseInt(id, 10), targetCustomer);
        }
    };

    return (
        <div className={`bg-[var(--color-surface)] rounded-xl shadow-lg border border-[var(--color-surface-light)] transition-all duration-300 ${isGlowing ? 'shadow-amber-500/30 border-amber-500/50 animate-heartbeat' : ''} ${dragOverTarget ? 'ring-2 ring-[var(--color-primary)]/80 ring-offset-2 ring-offset-[var(--color-bg)]' : ''}`}>
            <div className="p-5 border-b border-[var(--color-surface-light)] flex justify-between items-center">
                <h2 className="text-2xl font-bold font-heading">{diningTitle}</h2>
                <div className="flex items-center gap-2">
                    <button onClick={onReadAloud} disabled={isGeneratingAudio || items.length === 0} className="text-slate-400 hover:text-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Leer la cuenta en voz alta">
                        {isGeneratingAudio ? (
                            <div className="w-6 h-6 flex items-center justify-center">
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse-dot-1"></div>
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse-dot-2 mx-0.5"></div>
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse-dot-3"></div>
                            </div>
                        ) : <Volume2Icon className="w-6 h-6" />}
                    </button>
                    {diningOption === 'dine-in' && tableNumber && (
                        <button onClick={onShowQrCode} className="text-slate-400 hover:text-[var(--color-primary)] transition-colors" aria-label="Mostrar código QR para unirse a la mesa">
                            <QrCodeIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
            <div className="p-5">
                {items.length === 0 ? (
                    <div className={`text-center py-10 transition-all border-2 border-dashed rounded-lg ${dragOverTarget ? 'border-[var(--color-primary)] bg-slate-700/50 scale-105' : 'border-transparent'}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOverTarget('__NEW_DINER__'); }}
                        onDragLeave={() => setDragOverTarget(null)}
                        onDrop={(e) => handleDrop(e, null)}>
                        <div className={`w-16 h-16 bg-slate-700/50 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform ${dragOverTarget ? 'scale-110' : ''}`}>
                            {dragOverTarget ? <CheckCircleIcon className="w-8 h-8 text-[var(--color-primary)]" /> : <MicIcon className="w-8 h-8 text-slate-400" />}
                        </div>
                        <p className="font-semibold text-slate-300">{dragOverTarget ? '¡Suelta para añadir!' : 'Tu comanda está vacía'}</p>
                        <p className="text-slate-400 text-sm">{dragOverTarget ? 'Se te pedirá un nombre.' : '¡Pulsa el micrófono o arrastra un plato aquí!'}</p>
                    </div>
                ) : (
                    <div className="max-h-[50vh] overflow-y-auto pr-2 -mr-2">
                        <AnimatePresence>
                            {sortedCustomerNames.map(customerName => (
                                <motion.div
                                    key={customerName}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className={`mb-4 last:mb-0 p-2 -m-2 rounded-lg transition-all duration-200 ${dragOverTarget === customerName ? 'bg-amber-500/10 ring-1 ring-amber-500' : ''}`}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverTarget(customerName); }}
                                    onDragLeave={() => setDragOverTarget(null)}
                                    onDrop={(e) => handleDrop(e, customerName)}
                                >
                                    <h3 className="font-semibold text-[var(--color-primary)] text-xl mb-1 px-2 font-heading">{customerName}</h3>
                                    {itemsByCustomer[customerName].map(item => (
                                        <CartItemRow key={item.cartItemId} item={item} onCancel={onCancelItem} onReassign={onReassignItem} customersOnBill={customersOnBill} />
                                    ))}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <div className="p-5 border-t border-[var(--color-surface-light)] space-y-4">
                <div className="flex justify-between items-center text-2xl font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-[var(--color-primary)]">${displayTotal.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={onClear} disabled={items.length === 0} className="w-full bg-slate-600 text-white py-3 rounded-lg font-bold hover:bg-slate-500 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed">Limpiar</button>
                    <button onClick={onPay} disabled={items.length === 0} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-500 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed">Pagar</button>
                </div>
            </div>
        </div>
    );
};

export const MemoizedTableBill = React.memo(TableBillComponent);