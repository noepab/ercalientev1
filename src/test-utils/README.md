# Test Utilities

Utilidades para facilitar el testing de componentes y funcionalidades del proyecto.

## 📋 Contenido

Este directorio contiene herramientas y mocks para hacer testing más fácil y consistente:

- **LocalStorageMock**: Mock de localStorage para tests
- **Mock Data**: Datos de ejemplo para testing (items del menú, carrito, pedidos)
- **Helpers**: Funciones auxiliares para simular interacciones
- **State Creators**: Funciones para crear estados mock

## 🚀 Uso Rápido

### Importar Utilities

```typescript
import { mockMenuItem, mockCartItem, createMockAppState, LocalStorageMock } from './test-utils';
```

### Mock Data

```typescript
// Usar datos mock en tus tests
const testItem = mockMenuItem;
const testCart = [mockCartItem];
const testState = createMockAppState({ cartItems: testCart });
```

### LocalStorage Mock

```typescript
// Usar localStorage mock
const storage = new LocalStorageMock();
storage.setItem('key', 'value');
expect(storage.getItem('key')).toBe('value');
```

### Simular Interacciones

```typescript
// Simular click en un botón
const button = document.querySelector('button');
simulateClick(button);

// Simular input de texto
const input = document.querySelector('input');
simulateTextInput(input, 'texto de prueba');
```

## 📚 API Reference

### Mock Data

#### `mockMenuItem`

Item de menú completo con todos los campos necesarios.

```typescript
{
  id: '1',
  name: 'Bocadillo de Jamón',
  price: 5.99,
  category: 'Bocadillos',
  ingredients: ['pan', 'jamón serrano', 'tomate', 'aceite'],
  allergens: ['gluten'],
  available: true,
}
```

#### `mockDrinkItem`

Bebida de ejemplo.

#### `mockCartItem`

Item en el carrito con personalizaciones.

#### `mockOrderHistory`

Array de pedidos históricos.

### State Creators

#### `createMockAppState(overrides?)`

Crea un estado completo de la aplicación con valores por defecto.

```typescript
const state = createMockAppState({
  cartItems: [mockCartItem],
  diningOption: 'eat-here',
});
```

### Helpers

#### `simulateClick(element: HTMLElement)`

Simula un click en un elemento.

#### `simulateTextInput(element: HTMLInputElement, value: string)`

Simula input de texto en un campo.

#### `simulateSelectChange(element: HTMLSelectElement, value: string)`

Simula cambio de selección en un select.

#### `waitForPromises()`

Espera a que se resuelvan todas las promesas pendientes.

#### `delay(ms: number)`

Crea un delay en milisegundos.

### Mocks

#### `LocalStorageMock`

Mock completo de la API de localStorage.

```typescript
class LocalStorageMock {
  clear(): void;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  get length(): number;
  key(index: number): string | null;
}
```

## 🔧 Ejemplo Completo

```typescript
import { describe, it, expect } from 'vitest'; // o jest
import { mockMenuItem, createMockAppState, simulateClick, LocalStorageMock } from './test-utils';

describe('MenuItemCard', () => {
  it('should render item correctly', () => {
    const item = mockMenuItem;
    // Tu código de test aquí
  });

  it('should handle click', () => {
    const button = document.querySelector('.add-to-cart');
    simulateClick(button);
    // Verificaciones aquí
  });
});
```

## 📝 Notas

- Estas utilities están diseñadas para ser framework-agnostic
- Pueden usarse con Jest, Vitest, o cualquier otro framework de testing
- Son especialmente útiles con React Testing Library
- Se pueden extender fácilmente según las necesidades del proyecto

## 🔮 Futuras Mejoras

- [ ] Mocks para APIs (Gemini, geolocalización, etc.)
- [ ] Helpers para testing de hooks
- [ ] Utilities para testing de animaciones
- [ ] Factories para generar datos aleatorios
- [ ] Setup helpers para diferentes escenarios de testing

## 🤝 Contribuir

Si añades nuevas utilities:

1. Documéntalas en este README
2. Añade JSDoc comments en el código
3. Proporciona ejemplos de uso
4. Mantén la consistencia con las utilities existentes
