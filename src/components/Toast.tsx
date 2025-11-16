import React from 'react';
import { motion } from 'framer-motion';
// Fix: Corrected import path for types.
import { Toast as ToastType } from '../types';
import { CheckCircleIcon, AlertTriangleIcon } from './icons';

export const Toast: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const isSuccess = toast.type === 'success';
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 p-3 rounded-lg shadow-lg border w-full max-w-sm ${isSuccess ? 'bg-green-600 border-green-700 text-white' : 'bg-red-600 border-red-700 text-white'}`}
    >
      {isSuccess ? (
        <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
      ) : (
        <AlertTriangleIcon className="w-6 h-6 flex-shrink-0" />
      )}
      <span className="text-sm font-semibold">{toast.message}</span>
    </motion.li>
  );
};
