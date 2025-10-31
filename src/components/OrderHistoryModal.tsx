import React from 'react';
import { motion } from 'framer-motion';
import { XIcon, HistoryIcon } from './icons';
import { Order, CartItem } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onReorder: (order: Order) => void;
}

const OrderItem: React.FC<{ item: CartItem }> = ({ item }) => (
    <div className="flex justify-between items-center text-sm py-1">
        <span className="text-slate-300">{item.name} x{item.quantity}</span>
        <span className="text-slate-400">${(item.price * item.quantity).toFixed(2)}</span>
    </div>
);

const OrderCard: React.FC<{ order: Order, onReorder: (order: Order) => void }> = ({ order, onReorder }) => (
    <div className="bg-[var(--color-surface-light)] p-4 rounded-lg">
        <div className="flex justify-between items-center border-b border-slate-600 pb-2 mb-2">
            <div>
                <p className="font-bold text-white">Pedido #{order.id.slice(-5)}</p>
                <p className="text-xs text-slate-400">{new Date(order.date).toLocaleString()}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-[var(--color-primary)]">${order.total.toFixed(2)}</p>
                <p className="text-xs text-slate-400">{order.diningOption === 'dine-in' ? `Mesa ${order.tableNumber}` : 'Para llevar'}</p>
            </div>
        </div>
        <div className="space-y-1 mb-3">
            {order.items.slice(0, 3).map(item => <OrderItem key={item.cartItemId} item={item} />)}
            {order.items.length > 3 && <p className="text-xs text-slate-500 text-center">... y {order.items.length - 3} más</p>}
        </div>
        <button onClick={() => onReorder(order)} className="w-full bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-semibold py-1.5 rounded-md transition-colors">
            Volver a Pedir
        </button>
    </div>
);

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose, orders, onReorder }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--color-surface)] rounded-lg shadow-xl p-8 max-w-lg w-full relative text-white border border-[var(--color-surface-light)] h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center font-heading">Historial de Pedidos</h2>
        
        <div className="flex-grow overflow-y-auto pr-2 -mr-4">
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map(order => <OrderCard key={order.id} order={order} onReorder={onReorder} />)}
                </div>
            ) : (
                <div className="text-center pt-16">
                    <HistoryIcon className="w-16 h-16 mx-auto text-slate-500 mb-4" />
                    <p className="text-slate-400">Aún no has hecho ningún pedido.</p>
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
};