# Guía de Desarrollo

Esta guía proporciona información detallada sobre la arquitectura y el desarrollo de Bocateria Er'caliente.

## 📐 Arquitectura del Proyecto

### Stack Tecnológico

- **Frontend Framework**: React 19.2
- **Lenguaje**: TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Animations**: Framer Motion 11
- **AI Integration**: Google Gemini API
- **QR Codes**: react-qr-code

### Estructura del Proyecto

```
ercalientev1/
├── src/                          # Código fuente principal
│   ├── components/               # Componentes React
│   │   ├── Header.tsx           # Cabecera de la app
│   │   ├── MenuGallery.tsx      # Galería del menú
│   │   ├── DrinksGallery.tsx    # Galería de bebidas
│   │   ├── TableBill.tsx        # Cuenta/factura
│   │   ├── DashboardPanel.tsx   # Panel de control
│   │   └── *Modal.tsx           # Varios modales
│   ├── hooks/                   # Custom React hooks
│   │   ├── useOrder.ts          # Gestión de pedidos
│   │   ├── useMenu.ts           # Gestión del menú
│   │   └── useLiveSession.ts    # Sesión en vivo con Gemini
│   ├── context/                 # React Context
│   │   └── ModalContext.tsx     # Gestión de modales
│   ├── utils/                   # Utilidades
│   │   └── idb.ts              # IndexedDB wrapper
│   └── types.ts                # Definiciones TypeScript
├── components/                  # Componentes legacy (deprecated)
├── public/                      # Archivos estáticos
├── App.tsx                      # Componente principal
├── index.tsx                    # Entry point
├── data.ts                      # Datos del menú
├── constants.ts                 # Constantes
├── speechParser.ts              # Parser de voz
└── vite.config.ts              # Configuración de Vite
```

## 🏗️ Arquitectura de Componentes

### Componente Principal (App.tsx)

El componente `App` es el centro de la aplicación y gestiona:

- **Estado global**: AppState (IDLE, LISTENING, PROCESSING, etc.)
- **Pedidos**: Carrito de compra y pedidos
- **Menú**: Items del menú y bebidas
- **Sesión en vivo**: Integración con Gemini AI
- **Ubicación**: Geolocalización del usuario

### Hooks Personalizados

#### useOrder
Gestiona la lógica del carrito y pedidos:
- Añadir/quitar items
- Cálculos de totales
- Historial de pedidos
- Persistencia en IndexedDB

#### useMenu
Gestiona el menú de comida:
- Búsqueda y filtrado
- Categorías
- Disponibilidad

#### useLiveSession
Gestiona la integración con Google Gemini:
- Conexión WebRTC
- Audio bidireccional
- Procesamiento de respuestas

### Context API

#### ModalContext
Gestiona el estado de todos los modales de la aplicación:
- Apertura/cierre
- Estado compartido
- Prevención de múltiples modales

## 🎯 Flujos Principales

### Flujo de Pedido

1. **Usuario selecciona opción de comida** (comer aquí/llevar)
2. **Selecciona mesa** (si come aquí)
3. **Navega por el menú**
4. **Añade items al carrito**
5. **Personaliza items** (ingredientes, alergias)
6. **Confirma pedido**
7. **Procesa pago**
8. **Genera QR de confirmación**

### Flujo de Voz

1. **Usuario presiona botón de grabación**
2. **Captura audio** (WebRTC)
3. **Envía a Gemini Live API**
4. **Procesa respuesta**
5. **Parsea comando** (speechParser.ts)
6. **Ejecuta acción** (añadir al carrito, búsqueda, etc.)

### Flujo de Pago

1. **Usuario revisa cuenta**
2. **Selecciona método de pago** (efectivo/tarjeta)
3. **Para grupos: División de cuenta**
4. **Confirmación**
5. **Generación de QR/recibo**

## 🔧 APIs y Servicios

### Google Gemini API

```typescript
// Inicialización
const genai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

// Live Session
const session = await genai.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  // ...config
});
```

### IndexedDB

Almacenamiento local para:
- Historial de pedidos
- Preferencias de usuario
- Cache del menú
- Datos de sesión

```typescript
// Uso
import { openDB } from './utils/idb';

const db = await openDB('bocateria-db');
await db.put('orders', orderData);
```

### Geolocalización

```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    setCoordinates({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }
);
```

## 🎨 Patrones de Diseño

### Componentes Presentacionales vs Contenedores

- **Presentacionales**: Solo UI, reciben props
- **Contenedores**: Lógica de negocio, hooks

### Custom Hooks Pattern

Encapsula lógica reutilizable:

```typescript
export function useOrder() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const addItem = useCallback((item: MenuItem) => {
    // lógica
  }, []);
  
  return { cart, addItem, /* ... */ };
}
```

### Context Pattern

Para estado global compartido:

```typescript
const ModalContext = createContext<ModalContextType>({});

export const useModal = () => useContext(ModalContext);
```

## 🚀 Optimizaciones

### Performance

1. **Memoización**
   ```typescript
   const MemoizedTableBill = React.memo(TableBill);
   ```

2. **Lazy Loading**
   ```typescript
   const Modal = lazy(() => import('./Modal'));
   ```

3. **useCallback/useMemo**
   ```typescript
   const filteredItems = useMemo(() => 
     items.filter(/* ... */), 
     [items, filter]
   );
   ```

### Build Optimization

- Code splitting automático con Vite
- Tree shaking de dependencias
- Minificación
- Asset optimization

## 🧪 Testing (Pendiente)

Estructura sugerida para tests:

```
src/
  components/
    __tests__/
      Header.test.tsx
      MenuGallery.test.tsx
  hooks/
    __tests__/
      useOrder.test.ts
```

## 🔐 Variables de Entorno

```env
# .env.local
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

**Importante**: Nunca commitees el archivo `.env.local`

## 📱 Responsive Design

La app está optimizada para:
- 📱 Mobile (320px - 767px)
- 📱 Tablet (768px - 1023px)
- 💻 Desktop (1024px+)

## 🐛 Debugging

### VSCode

Usa la configuración de launch (ver `.vscode/launch.json`):
- F5 para iniciar debugging
- Breakpoints en TypeScript
- Console integrada

### React DevTools

1. Instala React DevTools extension
2. Inspecciona componentes
3. Ve state y props en tiempo real

### Vite DevTools

- HMR (Hot Module Replacement)
- Error overlay
- Source maps

## 📊 Performance Monitoring

### Metrics importantes

- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Largest Contentful Paint (LCP)

### Tools

```bash
# Análisis de bundle
npm run build -- --mode analyze
```

## 🔄 Estado de la Aplicación

```typescript
enum AppState {
  IDLE,           // Estado inicial
  LISTENING,      // Escuchando entrada de voz
  PROCESSING,     // Procesando con AI
  ORDERING,       // En proceso de pedido
  PAYMENT,        // Procesando pago
  COMPLETED       // Pedido completado
}
```

## 📚 Recursos Adicionales

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Framer Motion](https://www.framer.com/motion/)

## 🆘 Troubleshooting

### Problemas Comunes

**1. Error de peer dependencies**
```bash
npm install --legacy-peer-deps
```

**2. API Key no funciona**
- Verifica que `.env.local` existe
- Verifica que la variable empieza con `VITE_`
- Reinicia el dev server

**3. Build falla**
```bash
# Limpia y reinstala
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

**4. Problemas con TypeScript**
```bash
# Verifica tipos
npx tsc --noEmit
```

## 🔮 Roadmap

Ver `CHANGELOG.md` para features planificadas y completadas.

---

¿Preguntas? Abre un issue o consulta `CONTRIBUTING.md`
