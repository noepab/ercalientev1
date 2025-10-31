import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Modal {
  id: string;
  type: string;
  isOpen: boolean;
  data?: Record<string, any>;
}

export interface ModalContextType {
  modals: Modal[];
  openModal: (id: string, type: string, data?: Record<string, any>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  getModal: (id: string) => Modal | undefined;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const initialModals: Modal[] = [];

const createModalInitializer = (modals: Modal[]): Modal[] => {
  return modals.map(modal => ({
    ...modal,
    isOpen: false,
  }));
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<Modal[]>(
    createModalInitializer(initialModals)
  );

  const openModal = useCallback(
    (id: string, type: string, data?: Record<string, any>) => {
      setModals(prevModals => {
        const existingModal = prevModals.find(m => m.id === id);
        if (existingModal) {
          return prevModals.map(m =>
            m.id === id ? { ...m, isOpen: true, data } : m
          );
        }
        return [...prevModals, { id, type, isOpen: true, data }];
      });
    },
    []
  );

  const closeModal = useCallback((id: string) => {
    setModals(prevModals =>
      prevModals.map(m =>
        m.id === id ? { ...m, isOpen: false } : m
      )
    );
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(prevModals =>
      prevModals.map(m => ({ ...m, isOpen: false }))
    );
  }, []);

  const getModal = useCallback(
    (id: string) => modals.find(m => m.id === id),
    [modals]
  );

  const value: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    getModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
