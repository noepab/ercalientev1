/**
 * Test Utilities - Utilidades para facilitar el testing de componentes
 * 
 * Este archivo proporciona funciones helper para probar componentes React
 * de manera más sencilla y mantener consistencia en los tests.
 * 
 * Nota: Estas utilities están diseñadas para ser usadas con testing frameworks
 * como Jest, Vitest, o React Testing Library cuando se implementen.
 */

// Mock para localStorage
export class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

// Helper para esperar a que se resuelvan las promesas
export const waitForPromises = () => {
  return new Promise((resolve) => setImmediate(resolve));
};

// Helper para simular delay
export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Mock data para testing

export const mockMenuItem = {
  id: '1',
  name: 'Bocadillo de Jamón',
  description: 'Delicioso bocadillo de jamón serrano',
  price: 5.99,
  category: 'Bocadillos',
  image: '/images/jamon.jpg',
  ingredients: ['pan', 'jamón serrano', 'tomate', 'aceite'],
  allergens: ['gluten'],
  available: true,
};

export const mockDrinkItem = {
  id: 'd1',
  name: 'Coca-Cola',
  price: 2.5,
  category: 'Refrescos',
  image: '/images/cocacola.jpg',
  available: true,
};

export const mockCartItem = {
  ...mockMenuItem,
  quantity: 1,
  customizations: {
    removedIngredients: [],
    addedIngredients: [],
    notes: '',
  },
};

export const mockOrderHistory = [
  {
    id: 'order-1',
    date: new Date('2024-01-15T12:30:00'),
    items: [mockCartItem],
    total: 5.99,
    status: 'completed',
  },
];

// Helper para crear un mock de AppState
export const createMockAppState = (overrides = {}) => {
  return {
    appState: 'IDLE',
    locationStatus: 'Ubicación obtenida',
    coordinates: { latitude: 51.1, longitude: 45.3 },
    statusMessage: '',
    toasts: [],
    diningOption: null,
    tableNumber: null,
    customerName: '',
    cartItems: [],
    billTotal: 0,
    customersOnBill: [],
    orderHistory: [],
    ...overrides,
  };
};

// Helper para simular clicks en elementos
export const simulateClick = (element: HTMLElement) => {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  element.dispatchEvent(event);
};

// Helper para simular input de texto
export const simulateTextInput = (element: HTMLInputElement, value: string) => {
  element.value = value;
  const event = new Event('input', { bubbles: true });
  element.dispatchEvent(event);
};

// Helper para simular cambio de select
export const simulateSelectChange = (element: HTMLSelectElement, value: string) => {
  element.value = value;
  const event = new Event('change', { bubbles: true });
  element.dispatchEvent(event);
};

// Export todo como default también
export default {
  LocalStorageMock,
  waitForPromises,
  delay,
  mockMenuItem,
  mockDrinkItem,
  mockCartItem,
  mockOrderHistory,
  createMockAppState,
  simulateClick,
  simulateTextInput,
  simulateSelectChange,
};
