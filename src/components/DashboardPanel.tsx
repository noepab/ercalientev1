import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Added missing icons to the import statement.
import { XIcon, HistoryIcon, UserIcon, SettingsIcon, BarChartIcon, UtensilsIcon, LayoutDashboardIcon, StarIcon } from './icons'; 
import { Order } from '../types';

interface DashboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg">
        <div className="flex items-center">
            <div className="p-2 bg-slate-600 rounded-md mr-4">{icon}</div>
            <div>
                <p className="text-sm text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

export const DashboardPanel: React.FC<DashboardPanelProps> = ({ isOpen, onClose, orders }) => {
    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const allItems = orders.flatMap(order => order.items);
        const mostPopularItem = allItems
            .reduce((acc, item) => {
                acc[item.name] = (acc[item.name] || 0) + item.quantity;
                return acc;
            }, {} as Record<string, number>);

        const mostPopular = Object.entries(mostPopularItem).sort((a, b) => b[1] - a[1])[0];
        
        const revenueByDiningOption = orders.reduce((acc, order) => {
            if (order.diningOption) {
                acc[order.diningOption] = (acc[order.diningOption] || 0) + order.total;
            }
            return acc;
        }, {} as Record<'dine-in' | 'takeout', number>);

        return {
            totalRevenue,
            totalOrders,
            mostPopularItem: mostPopular ? `${mostPopular[0]} (${mostPopular[1]})` : 'N/A',
            revenueByDiningOption
        };
    }, [orders]);
    
    const totalRevenueForChart = (stats.revenueByDiningOption['dine-in'] || 0) + (stats.revenueByDiningOption['takeout'] || 0);

  return (
    <AnimatePresence>
        {isOpen && (
             <div className="fixed inset-0 z-50">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute top-0 left-0 h-full w-full max-w-md bg-[var(--color-surface)] border-r border-[var(--color-surface-light)] shadow-2xl flex flex-col"
                >
                    <div className="flex justify-between items-center p-4 border-b border-[var(--color-surface-light)] flex-shrink-0">
                        <h2 className="text-2xl font-bold font-heading text-white">Dashboard de Admin</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="flex-grow flex">
                        {/* Sidebar */}
                        <div className="w-48 bg-slate-800/50 p-4 flex flex-col space-y-2">
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-white bg-slate-700 rounded-md"><LayoutDashboardIcon className="w-5 h-5"/> Visión General</a>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md"><UserIcon className="w-5 h-5"/> Usuarios</a>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md"><UtensilsIcon className="w-5 h-5"/> Menú</a>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md"><BarChartIcon className="w-5 h-5"/> Analíticas</a>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md mt-auto"><SettingsIcon className="w-5 h-5"/> Ajustes</a>
                        </div>

                        {/* Main Content */}
                        <div className="flex-grow p-6 overflow-y-auto">
                           <div className="grid grid-cols-1 gap-4 mb-6">
                                <StatCard title="Ingresos Totales" value={`$${stats.totalRevenue.toFixed(2)}`} icon={<BarChartIcon className="w-6 h-6 text-green-400"/>} />
                                <StatCard title="Total Pedidos" value={stats.totalOrders.toString()} icon={<HistoryIcon className="w-6 h-6 text-blue-400"/>} />
                                <StatCard title="Plato Más Vendido" value={stats.mostPopularItem} icon={<StarIcon className="w-6 h-6 text-yellow-400"/>} />
                           </div>

                            <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
                                <h3 className="font-semibold text-white mb-3">Ingresos por Tipo</h3>
                                <div className="space-y-2">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">Comer Aquí</span>
                                            <span className="text-white font-medium">${(stats.revenueByDiningOption['dine-in'] || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="w-full bg-slate-600 rounded-full h-2.5">
                                            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${totalRevenueForChart > 0 ? ((stats.revenueByDiningOption['dine-in'] || 0) / totalRevenueForChart) * 100 : 0}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">Para Llevar</span>
                                            <span className="text-white font-medium">${(stats.revenueByDiningOption['takeout'] || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="w-full bg-slate-600 rounded-full h-2.5">
                                            <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: `${totalRevenueForChart > 0 ? ((stats.revenueByDiningOption['takeout'] || 0) / totalRevenueForChart) * 100 : 0}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                            <div>
                                <h3 className="font-semibold text-white mb-3">Pedidos Recientes</h3>
                                <div className="space-y-2">
                                    {orders.slice(0, 5).map(order => (
                                        <div key={order.id} className="bg-slate-700/50 p-3 rounded-md text-sm">
                                            <div className="flex justify-between">
                                                <span className="font-bold text-white">Pedido #{order.id.slice(-5)}</span>
                                                <span className="font-semibold text-[var(--color-primary)]">${order.total.toFixed(2)}</span>
                                            </div>
                                            <p className="text-xs text-slate-400">{order.items.length} artículos &bull; {new Date(order.date).toLocaleTimeString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
             </div>
        )}
    </AnimatePresence>
  );
};