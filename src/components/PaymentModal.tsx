import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, CheckCircleIcon } from './icons';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onPaymentSuccess: (tip: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total, onPaymentSuccess }) => {
    const [tipPercentage, setTipPercentage] = useState<number | null>(15);
    const [customTip, setCustomTip] = useState<string>('');
    const [tip, setTip] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    useEffect(() => {
        if (tipPercentage !== null) {
            setTip(total * (tipPercentage / 100));
            setCustomTip('');
        } else {
            setTip(parseFloat(customTip) || 0);
        }
    }, [tipPercentage, customTip, total]);

    useEffect(() => {
        if (isOpen) {
            setTipPercentage(15);
            setCustomTip('');
            setPaymentStatus('idle');
        }
    }, [isOpen]);

    const finalTotal = total + tip;
    const tipPercentages = [10, 15, 20];

    const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTipPercentage(null);
        setCustomTip(e.target.value);
    };

    const handlePayment = () => {
        setPaymentStatus('processing');
        setTimeout(() => {
            setPaymentStatus('success');
            setTimeout(() => {
                onPaymentSuccess(tip);
            }, 1500);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[var(--color-surface)] rounded-lg shadow-xl p-8 max-w-sm w-full relative text-white border border-[var(--color-surface-light)]"
                onClick={(e) => e.stopPropagation()}
            >
                <AnimatePresence mode="wait">
                    {paymentStatus === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center justify-center py-8 text-center"
                        >
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.1, type: 'spring', stiffness: 300, damping: 20 } }}>
                                <CheckCircleIcon className="w-24 h-24 text-green-500" />
                            </motion.div>
                            <h2 className="text-2xl font-bold mt-4 font-heading">¡Pago completado!</h2>
                            <p className="text-slate-400 mt-1">Gracias por tu pedido.</p>
                        </motion.div>
                    ) : (
                        <motion.div key="form" exit={{ opacity: 0, transition: { duration: 0.1 } }}>
                            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                                <XIcon className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold mb-4 text-center font-heading">Resumen de Pago</h2>
                            <div className="space-y-2 text-lg my-6">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Subtotal:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Propina:</span>
                                    <span>${tip.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-2xl border-t border-[var(--color-surface-light)] pt-2 mt-2">
                                    <span className="text-[var(--color-primary)]">Total:</span>
                                    <span className="text-[var(--color-primary)]">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 text-center">Añadir Propina</h3>
                                <div className="flex justify-center space-x-2 mb-3">
                                    {tipPercentages.map(p => (
                                        <button key={p} onClick={() => setTipPercentage(p)} className={`px-4 py-2 rounded-lg transition-colors ${tipPercentage === p ? 'bg-[var(--color-primary)] text-[var(--color-text-dark)] font-bold' : 'bg-[var(--color-surface-light)] hover:bg-slate-600'}`}>
                                            {p}%
                                        </button>
                                    ))}
                                </div>
                                <input type="number" value={customTip} onChange={handleCustomTipChange} placeholder="Propina personalizada ($)" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                            </div>
                            <p className="text-xs text-slate-500 mb-6 text-center">(Esto es una simulación. No se realizará ninguna transacción real.)</p>
                            <button onClick={handlePayment} disabled={paymentStatus === 'processing'} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:bg-slate-600 disabled:cursor-wait">
                                {paymentStatus === 'processing' ? 'Procesando...' : 'Confirmar Pago'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};