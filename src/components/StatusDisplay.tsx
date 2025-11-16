import React from 'react';
// Fix: Corrected import path for types.
import { AppState } from '../types';

interface StatusDisplayProps {
  appState: AppState;
  statusMessage: string;
  transcription: string;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  appState,
  statusMessage,
  transcription,
}) => {
  const getStatusText = () => {
    if (statusMessage) return statusMessage;
    switch (appState) {
      case AppState.IDLE:
        return 'Pulsa para hablar con el camarero virtual';
      case AppState.RECORDING:
        return 'Conectado. ¡Habla ahora!';
      case AppState.PROCESSING:
        return 'Conectando...';
      case AppState.SUCCESS:
        return '¡Añadido!';
      case AppState.ERROR:
        return 'Se ha producido un error.';
      default:
        return '';
    }
  };

  const statusColorClass = () => {
    if (statusMessage && appState === AppState.ERROR) return 'text-red-400';
    switch (appState) {
      case AppState.RECORDING:
        return 'text-green-400';
      case AppState.SUCCESS:
        return 'text-green-400';
      case AppState.ERROR:
        return 'text-red-400';
      default:
        return 'text-[var(--color-primary)]';
    }
  };

  const isRecording = appState === AppState.RECORDING;
  const isLoading = isRecording || appState === AppState.PROCESSING;

  return (
    <div
      className={`fixed top-16 left-1/2 -translate-x-1/2 bg-[var(--color-surface)]/80 backdrop-blur-sm p-3 text-center z-20 w-auto max-w-md rounded-xl transition-all duration-500 shadow-lg ${isRecording ? 'bg-green-900/40 animate-pulse' : ''}`}
    >
      <div className="flex justify-center items-center gap-2" aria-live="polite" aria-atomic="true">
        <p className={`font-semibold transition-colors duration-300 text-sm ${statusColorClass()}`}>
          {getStatusText()}
        </p>
        {isLoading && (
          <div className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 bg-[var(--color-primary)] rounded-full animate-pulse-dot-1"></span>
            <span className="h-1.5 w-1.5 bg-[var(--color-primary)] rounded-full animate-pulse-dot-2"></span>
            <span className="h-1.5 w-1.5 bg-[var(--color-primary)] rounded-full animate-pulse-dot-3"></span>
          </div>
        )}
      </div>
      {transcription && <p className="text-xs text-slate-300 mt-1 italic px-2">{transcription}</p>}
    </div>
  );
};
