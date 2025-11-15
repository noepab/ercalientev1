import React from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { XIcon } from './icons';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string | null;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, tableNumber }) => {
  if (!isOpen) return null;
  const joinUrl = `${window.location.origin}${window.location.pathname}?join=TABLE-${tableNumber}`;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--color-surface)] rounded-lg shadow-xl p-8 max-w-sm w-full relative text-white border border-[var(--color-surface-light)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center font-heading">
          Unirse a la Mesa {tableNumber}
        </h2>
        <p className="text-center text-slate-400 mb-6">
          Escanea este código QR para añadir tus pedidos a la cuenta de esta mesa.
        </p>
        <div className="bg-white p-4 rounded-lg">
          <QRCode
            value={joinUrl}
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            viewBox={`0 0 256 256`}
          />
        </div>
        <input
          type="text"
          readOnly
          value={joinUrl}
          className="w-full mt-6 bg-slate-700 text-slate-300 text-center px-2 py-1 text-xs rounded border border-slate-600"
          onFocus={(e) => e.target.select()}
        />
      </motion.div>
    </div>
  );
};
