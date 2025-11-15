import React from 'react';
// Fix: Corrected import path for types.
import { AppState } from '../types';
import { MicIcon } from './icons';

interface RecordButtonProps {
  appState: AppState;
  onToggle: () => void;
}

export const RecordButton: React.FC<RecordButtonProps> = ({ appState, onToggle }) => {
  const isConnected = appState === AppState.RECORDING;
  const isConnecting = appState === AppState.PROCESSING;

  const getLabel = () => {
    if (isConnecting) return 'Conectando...';
    if (isConnected) return 'Desconectar';
    return 'Hablar con el camarero virtual';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center p-4 bg-gradient-to-t from-[var(--color-bg)] to-transparent pointer-events-none">
      <button
        onClick={onToggle}
        disabled={isConnecting}
        className={`transition-all duration-200 ease-in-out rounded-full p-6 flex items-center justify-center focus:outline-none focus:ring-4 ring-amber-500/50 pointer-events-auto ${isConnected ? 'bg-green-600 shadow-2xl shadow-green-500/50' : isConnecting ? 'bg-slate-600 cursor-not-allowed' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'}`}
        aria-label={getLabel()}
      >
        <MicIcon
          className={`w-10 h-10 transition-colors ${isConnected ? 'text-white' : 'text-[var(--color-text-dark)]'}`}
        />
      </button>
    </div>
  );
};
