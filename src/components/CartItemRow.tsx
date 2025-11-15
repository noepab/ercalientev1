import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
// Fix: Corrected import path for types.
import { CartItem } from '../types';
import { XIcon, MoreVerticalIcon } from './icons';

interface CartItemRowProps {
  item: CartItem;
  onCancel: (cartItemId: string) => void;
  onReassign: (cartItemId: string, newCustomerName: string) => void;
  customersOnBill: string[];
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onCancel,
  onReassign,
  customersOnBill,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isPending = item.status === 'pending';

  useEffect(() => {
    if (!isPending) return;
    const calculateTimeLeft = () =>
      Math.max(0, 20 - Math.floor((Date.now() - item.addedAt) / 1000));
    setTimeLeft(calculateTimeLeft());
    const intervalId = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining <= 0) clearInterval(intervalId);
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isPending, item.addedAt]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const progressPercent = useMemo(() => (timeLeft / 20) * 100, [timeLeft]);
  const showTimer = isPending && timeLeft > 0;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', `cartItem-${item.cartItemId}`);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };

  const renderCustomizations = () => {
    if (
      !item.customizations ||
      (!item.customizations.removed.length && !item.customizations.added.length)
    ) {
      return null;
    }
    return (
      <div className="text-xs text-slate-400 pl-1 mt-1">
        {item.customizations.removed.length > 0 && (
          <div>
            <span className="text-red-400">Sin:</span> {item.customizations.removed.join(', ')}
          </div>
        )}
        {item.customizations.added.length > 0 && (
          <div>
            <span className="text-green-400">Extra:</span>{' '}
            {item.customizations.added.map((e) => e.name).join(', ')}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
    >
      <div
        className="py-2 border-b border-slate-700/50 last:border-b-0 group"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-between items-start">
          <div className="flex-grow pr-2">
            <div>
              <span className="text-slate-200">{item.name}</span>
              <span className="text-slate-400"> x{item.quantity}</span>
            </div>
            {renderCustomizations()}
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0 mt-1">
            <span className="font-semibold text-slate-200 w-16 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <div className="w-6 h-6 flex items-center justify-center relative" ref={menuRef}>
              {isPending ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel(item.cartItemId);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors z-10 relative"
                  aria-label="Cancelar"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <MoreVerticalIcon className="w-5 h-5" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-[var(--color-surface-light)] rounded-md shadow-lg z-20 border border-slate-600">
                      <div className="p-1">
                        <p className="px-2 py-1 text-xs text-slate-400">Mover a:</p>
                        {customersOnBill
                          .filter((c) => c !== item.customerName)
                          .map((customer) => (
                            <button
                              key={customer}
                              onClick={() => {
                                onReassign(item.cartItemId, customer);
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left px-2 py-1.5 text-sm text-slate-200 hover:bg-slate-700 rounded-sm"
                            >
                              {customer}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {showTimer && (
          <div className="mt-2">
            <div className="w-full bg-slate-600 rounded-full h-1 overflow-hidden">
              <div
                className="bg-red-500 h-1 rounded-full"
                style={{ width: `${progressPercent}%`, transition: 'width 1s linear' }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
