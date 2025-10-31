import React from 'react';
import { motion } from 'framer-motion';
import { XIcon, MapIcon } from './icons';
import { Coordinates } from '../types';

interface ConnectionsMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: Coordinates | null;
}

export const ConnectionsMapModal: React.FC<ConnectionsMapModalProps> = ({ isOpen, onClose, userLocation }) => {
  if (!isOpen) return null;

  const getMapUrl = () => {
      if (!userLocation) return '';
      const { latitude: lat, longitude: lon } = userLocation;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lon}`;
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--color-surface)] rounded-lg shadow-xl p-6 max-w-2xl w-full relative text-white border border-[var(--color-surface-light)] h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center font-heading">Mapa de Conexiones</h2>
        
        <div className="flex-grow bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
            {userLocation ? (
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={getMapUrl()}
                ></iframe>
            ) : (
                <div className="text-center text-slate-400">
                    <MapIcon className="w-12 h-12 mx-auto mb-2"/>
                    <p>Obteniendo ubicación del usuario...</p>
                    <p className="text-xs">(Asegúrate de haber concedido los permisos de geolocalización)</p>
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
};
