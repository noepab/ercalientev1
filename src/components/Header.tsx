import React from 'react';
import { Logo } from './Logo';
import { HistoryIcon, AlertTriangleIcon, ChatIcon, LayoutDashboardIcon, MapIcon } from './icons';

interface HeaderProps {
    onOpenAllergyModal: () => void;
    onOpenOrderHistoryModal: () => void;
    onOpenChatModal: () => void;
    locationStatus: string;
    onOpenDashboard: () => void;
    onOpenConnectionsMap: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAllergyModal, onOpenOrderHistoryModal, onOpenChatModal, locationStatus, onOpenDashboard, onOpenConnectionsMap }) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-[var(--color-bg)]/80 backdrop-blur-sm z-30 border-b border-[var(--color-surface-light)]">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Logo className="w-10 h-10" />
                    <div>
                        <h1 className="text-xl font-bold text-white font-heading tracking-wider">Er'caliente</h1>
                        <p className="text-xs text-slate-400 -mt-1">{locationStatus}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onOpenDashboard} className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-gray-400">
                        <LayoutDashboardIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </button>
                     <button onClick={onOpenConnectionsMap} className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-green-800 hover:bg-green-700 text-white flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-green-500">
                        <MapIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Mapa</span>
                    </button>
                    <button onClick={onOpenChatModal} className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-blue-800 hover:bg-blue-700 text-white flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-500">
                        <ChatIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Chat</span>
                    </button>
                    <button onClick={onOpenOrderHistoryModal} className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-indigo-800 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-indigo-500">
                        <HistoryIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Historial</span>
                    </button>
                    <button onClick={onOpenAllergyModal} className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-red-800 hover:bg-red-700 text-white flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-red-500">
                        <AlertTriangleIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Alergias</span>
                    </button>
                </div>
            </div>
        </header>
    );
};