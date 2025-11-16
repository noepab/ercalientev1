<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🍔 Bocateria Er'caliente

### Aplicación web interactiva con IA para pedidos de comida

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[English](#english-version) | [Características](#-características) | [Instalación](#-instalación-rápida) | [Documentación](#-documentación)

</div>

---

## 📖 Tabla de Contenidos

- [Características](#-características)
- [Instalación Rápida](#-instalación-rápida)
- [Comandos Disponibles](#-comandos-disponibles)
- [Configuración](#-configuración)
- [Arquitectura](#-arquitectura)
- [Desarrollo](#-desarrollo)
- [Troubleshooting](#-troubleshooting)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### 🎤 Interacción por Voz

- **Pedidos por voz** con Google Gemini AI
- **Procesamiento en tiempo real** de comandos hablados
- **Confirmación inteligente** de pedidos

### 🍽️ Gestión de Pedidos

- **Menú interactivo** con galería visual
- **Personalización de items** (ingredientes, alergias)
- **Carrito de compras** dinámico
- **División de cuenta** para grupos
- **Historial de pedidos** con persistencia local

### 🎨 Experiencia de Usuario

- **Animaciones fluidas** con Framer Motion
- **Diseño responsive** para móvil, tablet y desktop
- **Tema oscuro/claro** adaptable
- **QR codes** para confirmación de pedidos
- **Mapa de conexiones** de clientes

### 🤖 Integraciones de IA

- **Google Gemini API** para procesamiento de lenguaje natural
- **Análisis de imágenes** de comida
- **Generación de imágenes** personalizadas
- **Generación de videos** promocionales
- **Chatbot inteligente** para asistencia

### 🔧 Características Técnicas

- **TypeScript** para type safety
- **React Hooks** para gestión de estado
- **Context API** para estado global
- **IndexedDB** para almacenamiento local
- **WebRTC** para audio bidireccional

## 🚀 Instalación Rápida

### Opción 1: Setup Automático (Recomendado)

```bash
# Clona el repositorio
git clone https://github.com/noepab/ercalientev1.git
cd ercalientev1

# Ejecuta el script de setup interactivo
npm run setup
```

El script te guiará a través de:

- ✅ Verificación de Node.js
- ✅ Instalación de dependencias
- ✅ Configuración de variables de entorno
- ✅ Verificación del proyecto

### Opción 2: Setup Manual

```bash
# 1. Clona el repositorio
git clone https://github.com/noepab/ercalientev1.git
cd ercalientev1

# 2. Instala dependencias
npm install --legacy-peer-deps

# 3. Configura variables de entorno
cp .env.example .env.local
# Edita .env.local y añade tu GEMINI_API_KEY

# 4. Inicia el servidor de desarrollo
npm run dev
```

### Requisitos Previos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **npm** o **yarn**
- **Google Gemini API Key** ([Obtener gratis](https://ai.google.dev/))

## 🛠️ Comandos Disponibles

### Desarrollo

```bash
npm run dev          # Inicia servidor de desarrollo (http://localhost:5173)
npm run build        # Construye para producción
npm run preview      # Vista previa del build de producción
```

### Calidad de Código

```bash
npm run lint         # Verifica código con ESLint
npm run lint:fix     # Auto-corrige problemas de linting
npm run format       # Formatea código con Prettier
npm run format:check # Verifica formato sin modificar
npm run type-check   # Verifica tipos TypeScript
```

### Setup

```bash
npm run setup        # Script interactivo de configuración
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Google Gemini API Key (REQUERIDA)
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

> 💡 **Tip:** Usa `.env.example` como plantilla

### VSCode (Recomendado)

El proyecto incluye configuración para VSCode:

- **Extensiones recomendadas** (se instalan automáticamente)
- **Format on save** habilitado
- **ESLint** integrado
- **Debugging** configurado (F5 para iniciar)

## 🏗️ Arquitectura

```
ercalientev1/
├── src/
│   ├── components/       # Componentes React
│   │   ├── Header.tsx
│   │   ├── MenuGallery.tsx
│   │   ├── DashboardPanel.tsx
│   │   └── ...
│   ├── hooks/           # Custom hooks
│   │   ├── useOrder.ts
│   │   ├── useMenu.ts
│   │   └── useLiveSession.ts
│   ├── context/         # React Context
│   ├── utils/           # Utilidades
│   └── types.ts         # Tipos TypeScript
├── public/              # Assets estáticos
├── scripts/             # Scripts de automatización
└── docs/                # Documentación adicional
```

### Stack Tecnológico

| Categoría   | Tecnología                |
| ----------- | ------------------------- |
| Framework   | React 19.2                |
| Lenguaje    | TypeScript 5.8            |
| Build Tool  | Vite 6.2                  |
| Animaciones | Framer Motion 11          |
| IA          | Google Gemini API         |
| Estado      | React Hooks + Context API |
| Storage     | IndexedDB                 |
| Estilo      | CSS Modules               |

## 💻 Desarrollo

### Flujo de Trabajo

1. **Crea una rama** para tu feature:

   ```bash
   git checkout -b feature/mi-feature
   ```

2. **Haz tus cambios** siguiendo las guías de estilo

3. **Verifica tu código**:

   ```bash
   npm run lint
   npm run format
   npm run type-check
   npm run build
   ```

4. **Commit y push**:

   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   git push origin feature/mi-feature
   ```

5. **Abre un Pull Request**

### Debugging

#### En VSCode

1. Presiona `F5` para iniciar debugging
2. Coloca breakpoints en tu código
3. Usa la consola integrada

#### En Browser

1. Abre DevTools (F12)
2. Instala [React DevTools](https://react.dev/learn/react-developer-tools)
3. Inspecciona componentes y estado

## 🐛 Troubleshooting

### Problema: Error de peer dependencies

```bash
# Solución: Usa --legacy-peer-deps
npm install --legacy-peer-deps
```

### Problema: API Key no funciona

1. Verifica que `.env.local` existe
2. Verifica que la variable empieza con `VITE_`
3. Reinicia el servidor de desarrollo

### Problema: Build falla

```bash
# Limpia y reinstala
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Problema: TypeScript errors

```bash
# Verifica tipos sin compilar
npm run type-check
```

## 📚 Documentación

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guía para contribuidores
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Documentación técnica detallada
- **[CHANGELOG.md](CHANGELOG.md)** - Historial de cambios

### Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Vite](https://vitejs.dev/)
- [Google Gemini API Docs](https://ai.google.dev/docs)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre:

- Código de conducta
- Proceso de desarrollo
- Cómo enviar pull requests
- Guías de estilo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- Google Gemini por la API de IA
- La comunidad de React y TypeScript
- Todos los contribuidores

---

<div align="center">

**[⬆ Volver arriba](#-bocateria-ercaliente)**

View your app in AI Studio: https://ai.studio/apps/drive/14stTXgNfL5AryffougMhtnkjMZn4EcKO

Hecho con ❤️ por [noepab](https://github.com/noepab)

</div>
