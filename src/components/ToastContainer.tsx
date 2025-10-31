import React from 'react';
import { AnimatePresence } from 'framer-motion';
// Fix: Corrected import path for types.
import { Toast as ToastType } from '../types';
import { Toast } from './Toast';

export const ToastContainer: React.FC<{ toasts: ToastType[] }> = ({ toasts }) => {
    return (
        <ul className="fixed top-20 right-4 z-50 space-y-2">
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </ul>
    );
};