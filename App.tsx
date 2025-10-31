import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import { ModalProvider } from './src/context/ModalContext';
// Types and Data
import {
  AppState,
  MenuItem,
  DrinkItem,
  Toast,
  CartItem
} from './src/types';
// Hooks
import { useOrder } from './src/hooks/useOrder';
import { useMenu } from './src/hooks/useMenu';
import { useLiveSession } from './src/hooks/useLiveSession';
// Components
import { Header } from './src/components/Header';
import { ToastContainer } from './src/components/ToastContainer';
import { StatusDisplay } from './src/components/StatusDisplay';
import { DrinksGallery } from './src/components/DrinksGallery';
import { MenuGallery } from './src/components/MenuGallery';
import { MemoizedTableBill } from './src/components/TableBill';
import { RecordButton } from './src/components/RecordButton';
import { DiningOptionsModal } from './src/components/DiningOptionsModal';
import { PaymentModal } from './src/components/PaymentModal';
import { QrCodeModal } from './src/components/QrCodeModal';
import { CustomerNameModal } from './src/components/CustomerNameModal';
import { TableSelectionModal } from './src/components/TableSelectionModal';
import { AllergySelectionModal } from './src/components/AllergySelectionModal';
import { CustomizationModal } from './src/components/ConfirmationModal';
import { MoreDrinksModal } from './src/components/MoreDrinksModal';
import { RecommendationModal } from './src/components/RecommendationModal';
import { ImageAnalysisModal } from './src/components/ImageAnalysisModal';
import { ImageGenerationModal } from './src/components/ImageGenerationModal';
import { OrderHistoryModal } from './src/components/OrderHistoryModal';
import { ModelGenerationModal } from './src/components/ModelGenerationModal';
import { ChatbotModal } from './src/components/ChatbotModal';
import { ImagenGenerationModal } from './src/components/ImagenGenerationModal';
import { VideoGenerationModal } from './src/components/VideoGenerationModal';
import { VideoAnalysisModal } from './src/components/VideoAnalysisModal';
import { DashboardPanel } from './src/components/DashboardPanel';
import { ConnectionsMapModal } from './src/components/ConnectionsMapModal';

const App: React.FC = () => {
  // App State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [locationStatus, setLocationStatus] = useState<string>('Obteniendo ubicación...');
  const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const orderHook = useOrder({ addToast });
  const menuHook = useMenu({ setStatusMessage });
  const liveSessionHook = useLiveSession({
    setAppState,
    setStatusMessage,
    addToast
  });

  return (
    <ModalProvider>
      <div className="app-container">
        <Header />
        <StatusDisplay message={statusMessage} />
        <ToastContainer toasts={toasts} />
        <div className="main-content">
          <MenuGallery items={menuHook.menu} onAddItem={orderHook.addItem} />
          <DrinksGallery items={menuHook.drinks} onAddItem={orderHook.addItem} />
          <MemoizedTableBill cartItems={orderHook.cartItems} onRemoveItem={orderHook.removeItem} />
        </div>
        <RecordButton onRecord={liveSessionHook.handleRecord} />
        <DiningOptionsModal />
        <PaymentModal />
        <QrCodeModal />
        <CustomerNameModal />
        <TableSelectionModal />
        <AllergySelectionModal />
        <CustomizationModal />
        <MoreDrinksModal />
        <RecommendationModal />
        <ImageAnalysisModal />
        <ImageGenerationModal />
        <OrderHistoryModal />
        <ModelGenerationModal />
        <ChatbotModal />
        <ImagenGenerationModal />
        <VideoGenerationModal />
        <VideoAnalysisModal />
        <DashboardPanel />
        <ConnectionsMapModal />
      </div>
    </ModalProvider>
  );
};

export default App;
