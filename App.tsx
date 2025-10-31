import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';

// Types and Data
import { AppState, MenuItem, DrinkItem, Toast, CartItem } from './src/types';

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
        menuItems: menuHook.menuItems,
        customersOnBill: orderHook.customersOnBill,
        handleAddToCart: orderHook.handleAddToCart,
    });

    // Modal State & Flow Control
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [isQrModalOpen, setQrModalOpen] = useState(false);
    const [isCustomerNameModalOpen, setCustomerNameModalOpen] = useState(false);
    const [isTableSelectionModalOpen, setTableSelectionModalOpen] = useState(false);
    const [isAllergyModalOpen, setAllergyModalOpen] = useState(false);
    const [isCustomizationModalOpen, setCustomizationModalOpen] = useState(false);
    const [isMoreDrinksModalOpen, setMoreDrinksModalOpen] = useState(false);
    const [isRecommendationModalOpen, setRecommendationModalOpen] = useState(false);
    const [isImageAnalysisModalOpen, setImageAnalysisModalOpen] = useState(false);
    const [isImageEditorModalOpen, setImageEditorModalOpen] = useState(false);
    const [isOrderHistoryModalOpen, setOrderHistoryModalOpen] = useState(false);
    const [isModelGenerationModalOpen, setModelGenerationModalOpen] = useState(false);
    const [isChatbotModalOpen, setChatbotModalOpen] = useState(false);
    const [isImagenModalOpen, setImagenModalOpen] = useState(false);
    const [isVideoGenModalOpen, setVideoGenModalOpen] = useState(false);
    const [isVideoAnalysisModalOpen, setVideoAnalysisModalOpen] = useState(false);
    const [isDashboardOpen, setDashboardOpen] = useState(false);
    const [isConnectionsMapOpen, setConnectionsMapOpen] = useState(false);
    
    // Helper state for modals
    const [itemToCustomize, setItemToCustomize] = useState<MenuItem | DrinkItem | null>(null);

    const isReadyToOrder = orderHook.diningOption !== null && (orderHook.diningOption === 'takeout' || (orderHook.diningOption === 'dine-in' && orderHook.tableNumber !== null));
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationStatus(`Ubicación: ${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
                setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude });
            },
            () => { setLocationStatus('No se pudo obtener la ubicación.'); }
        );

        const urlParams = new URLSearchParams(window.location.search);
        const joinTableCode = urlParams.get('join');
        if (joinTableCode && joinTableCode.startsWith('TABLE-')) {
            const tableNum = joinTableCode.replace('TABLE-', '');
            orderHook.setDiningOption('dine-in');
            orderHook.setTableNumber(tableNum);
            const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
            window.history.replaceState({path:newUrl},'',newUrl);
        }
    }, [orderHook.setDiningOption, orderHook.setTableNumber]);

    const handleAddItemFlow = (item: MenuItem | DrinkItem) => {
        setItemToCustomize(item);
        setCustomizationModalOpen(true);
    };
    
    const handleConfirmCustomization = (customizations: CartItem['customizations'], quantity: number) => {
        if (!itemToCustomize) return;
        orderHook.handleInitiateAddToCart(itemToCustomize, quantity, customizations, () => setCustomerNameModalOpen(true));
        setCustomizationModalOpen(false);
        setItemToCustomize(null);
    };

    const handleCustomerNameSelected = (name: string) => {
        orderHook.handleFinalizeAddToCart(name);
        setCustomerNameModalOpen(false);
    };

    const handleDiningOptionSelect = (option: 'dine-in' | 'takeout') => {
        orderHook.setDiningOption(option);
        if (option !== 'takeout') {
            setTableSelectionModalOpen(true);
        }
    };

    const handleTableSelect = (table: string) => {
        orderHook.setTableNumber(table);
        setTableSelectionModalOpen(false);
    };

    const handleOpenImageEditorFlow = (item?: MenuItem | DrinkItem) => {
        menuHook.handleOpenImageEditor(item);
        setImageEditorModalOpen(true);
    };
    
    const handleOpenModelGeneratorFlow = (item: MenuItem) => {
        menuHook.handleOpenModelGenerator(item);
        setModelGenerationModalOpen(true);
    };
    
    return (
        <div className="min-h-screen antialiased relative">
          <Header 
            onOpenAllergyModal={() => setAllergyModalOpen(true)} 
            onOpenOrderHistoryModal={() => setOrderHistoryModalOpen(true)} 
            locationStatus={locationStatus} 
            onOpenChatModal={() => setChatbotModalOpen(true)}
            onOpenDashboard={() => setDashboardOpen(true)}
            onOpenConnectionsMap={() => setConnectionsMapOpen(true)}
          />
          <ToastContainer toasts={toasts} />

          <main className="container mx-auto p-4 pt-20 pb-32">
            <StatusDisplay appState={liveSessionHook.appState} statusMessage={statusMessage} transcription={liveSessionHook.transcription} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <DrinksGallery 
                    drinks={menuHook.filteredDrinkItems} 
                    onReviewAndAdd={handleAddItemFlow} 
                    isReadyToOrder={isReadyToOrder} 
                    onOpenMoreDrinks={() => setMoreDrinksModalOpen(true)}
                    onEditImage={handleOpenImageEditorFlow}
                />
                <MenuGallery 
                    isLoading={menuHook.isMenuLoading}
                    items={menuHook.filteredAndSortedMenuItems} 
                    onReviewAndAdd={handleAddItemFlow} 
                    isReadyToOrder={isReadyToOrder}
                    selectedCategory={menuHook.selectedCategory}
                    onSelectCategory={menuHook.handleSelectCategory}
                    selectedAllergies={menuHook.selectedAllergies}
                    onOpenRecommendationModal={() => setRecommendationModalOpen(true)}
                    onOpenImageAnalysisModal={() => setImageAnalysisModalOpen(true)}
                    onOpenImageEditor={handleOpenImageEditorFlow}
                    canEditAnyImage={menuHook.canEditAnyImage}
                    onOpenImagenModal={() => setImagenModalOpen(true)}
                    onOpenVideoGenerationModal={() => setVideoGenModalOpen(true)}
                    onOpenVideoAnalysisModal={() => setVideoAnalysisModalOpen(true)}
                    onGenerateModel={handleOpenModelGeneratorFlow}
                    onResetMenu={menuHook.handleResetMenu}
                    searchTerm={menuHook.searchTerm}
                    onSearchChange={menuHook.setSearchTerm}
                />
              </div>
              
              <div className="relative">
                <div className="sticky top-24">
                  <MemoizedTableBill 
                    items={orderHook.cartItems} 
                    tableNumber={orderHook.tableNumber} 
                    onPay={() => setPaymentModalOpen(true)} 
                    onClear={orderHook.handleClearBill}
                    diningOption={orderHook.diningOption}
                    cartUpdateIndicator={orderHook.cartUpdateIndicator}
                    onShowQrCode={() => setQrModalOpen(false)}
                    onCancelItem={orderHook.handleCancelOrderItem}
                    onReadAloud={orderHook.handleReadBillAloud}
                    isGeneratingAudio={orderHook.isGeneratingAudio}
                    onReassignItem={orderHook.handleReassignCartItem}
                    onAddNewItemToCustomer={orderHook.handleAddNewItemToCustomer}
                    customersOnBill={orderHook.customersOnBill}
                  />
                </div>
              </div>
            </div>
          </main>
          
          <RecordButton appState={liveSessionHook.appState} onToggle={liveSessionHook.handleToggleLiveConnection} />

          {!orderHook.diningOption && <DiningOptionsModal onSelect={handleDiningOptionSelect} />}
          
          {isPaymentModalOpen && <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} total={orderHook.billTotal} onPaymentSuccess={orderHook.handlePaymentSuccess} />}
          {isQrModalOpen && <QrCodeModal isOpen={isQrModalOpen} onClose={() => setQrModalOpen(false)} tableNumber={orderHook.tableNumber} />}
          {isCustomerNameModalOpen && <CustomerNameModal isOpen={isCustomerNameModalOpen} onClose={() => setCustomerNameModalOpen(false)} onConfirm={handleCustomerNameSelected} />}
          {isTableSelectionModalOpen && <TableSelectionModal isOpen={isTableSelectionModalOpen} onClose={() => setTableSelectionModalOpen(false)} onSelect={handleTableSelect} />}
          {isAllergyModalOpen && <AllergySelectionModal isOpen={isAllergyModalOpen} onClose={() => setAllergyModalOpen(false)} selectedAllergies={menuHook.selectedAllergies} onAllergyToggle={menuHook.handleAllergyToggle} />}
          {isCustomizationModalOpen && <CustomizationModal isOpen={isCustomizationModalOpen} onClose={() => setCustomizationModalOpen(false)} onConfirm={handleConfirmCustomization} item={itemToCustomize} />}
          {isMoreDrinksModalOpen && <MoreDrinksModal isOpen={isMoreDrinksModalOpen} onClose={() => setMoreDrinksModalOpen(false)} onReviewAndAdd={handleAddItemFlow} drinks={menuHook.filteredMoreDrinkItems} onEditImage={handleOpenImageEditorFlow} />}
          {isRecommendationModalOpen && <RecommendationModal isOpen={isRecommendationModalOpen} onClose={() => setRecommendationModalOpen(false)} onReviewAndAdd={handleAddItemFlow} diningOption={orderHook.diningOption} />}
          {isImageAnalysisModalOpen && <ImageAnalysisModal isOpen={isImageAnalysisModalOpen} onClose={() => setImageAnalysisModalOpen(false)} onMatch={handleAddItemFlow} menuItems={menuHook.menuItems} />}
          {isImageEditorModalOpen && <ImageGenerationModal isOpen={isImageEditorModalOpen} onClose={() => setImageEditorModalOpen(false)} onUpdateImage={menuHook.handleUpdateItemImage} itemToEdit={menuHook.editingItemImage} onNavigateNext={menuHook.handleNavigateToNextItem} onNavigatePrev={menuHook.handleNavigateToPrevItem} />}
          {isOrderHistoryModalOpen && <OrderHistoryModal isOpen={isOrderHistoryModalOpen} onClose={() => setOrderHistoryModalOpen(false)} orders={orderHook.orderHistory} onReorder={orderHook.handleReorder} />}
          {isModelGenerationModalOpen && <ModelGenerationModal isOpen={isModelGenerationModalOpen} onClose={() => setModelGenerationModalOpen(false)} item={menuHook.generatingModelForItem} onUpdateModel={menuHook.handleUpdateMenuItemModel} />}
          {isChatbotModalOpen && <ChatbotModal isOpen={isChatbotModalOpen} onClose={() => setChatbotModalOpen(false)} userLocation={coordinates} />}
          {isImagenModalOpen && <ImagenGenerationModal isOpen={isImagenModalOpen} onClose={() => setImagenModalOpen(false)} onAddToMenu={menuHook.handleAddGeneratedItem} />}
          {isVideoGenModalOpen && <VideoGenerationModal isOpen={isVideoGenModalOpen} onClose={() => setVideoGenModalOpen(false)} />}
          {isVideoAnalysisModalOpen && <VideoAnalysisModal isOpen={isVideoAnalysisModalOpen} onClose={() => setVideoAnalysisModalOpen(false)} />}
          {isDashboardOpen && <DashboardPanel isOpen={isDashboardOpen} onClose={() => setDashboardOpen(false)} orders={orderHook.orderHistory} />}
          {isConnectionsMapOpen && <ConnectionsMapModal isOpen={isConnectionsMapOpen} onClose={() => setConnectionsMapOpen(false)} userLocation={coordinates} />}
        </div>
    );
}

export default App;