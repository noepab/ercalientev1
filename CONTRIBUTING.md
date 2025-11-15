# Guía de Contribución

¡Gracias por tu interés en contribuir a Bocateria Er'caliente! Esta guía te ayudará a empezar.

## 🚀 Inicio Rápido

1. **Fork y Clone**
   ```bash
   git clone https://github.com/tu-usuario/ercalientev1.git
   cd ercalientev1
   ```

2. **Instalar Dependencias**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configurar Variables de Entorno**
   ```bash
   # Copia el archivo de ejemplo
   cp .env.example .env.local
   # Añade tu GEMINI_API_KEY en .env.local
   ```

4. **Ejecutar en Modo Desarrollo**
   ```bash
   npm run dev
   ```

## 📝 Proceso de Desarrollo

### 1. Crear una Rama
```bash
git checkout -b feature/nombre-de-tu-feature
# o
git checkout -b fix/descripcion-del-bug
```

### 2. Hacer Cambios

- Mantén los cambios pequeños y enfocados
- Sigue las convenciones de código existentes
- Añade comentarios cuando sea necesario para claridad

### 3. Probar tus Cambios

```bash
# Ejecuta el linter
npm run lint

# Formatea el código
npm run format

# Construye el proyecto
npm run build

# Prueba en el navegador
npm run dev
```

### 4. Commit y Push

```bash
git add .
git commit -m "tipo: descripción breve del cambio"
git push origin feature/nombre-de-tu-feature
```

#### Tipos de Commits

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (sin cambios de código)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

### 5. Crear Pull Request

1. Ve a tu fork en GitHub
2. Haz clic en "New Pull Request"
3. Proporciona una descripción clara de tus cambios
4. Espera revisión y feedback

## 🎨 Estilo de Código

### TypeScript/React

- Usa componentes funcionales con hooks
- Usa TypeScript para todo el código nuevo
- Prefiere `const` sobre `let`
- Usa nombres descriptivos para variables y funciones
- Mantén componentes pequeños y enfocados

### Estructura de Archivos

```
src/
  components/     # Componentes React
  hooks/         # Custom hooks
  utils/         # Funciones utilitarias
  context/       # Context providers
  types.ts       # Definiciones de tipos
```

### Nombres de Archivos

- Componentes: `PascalCase.tsx`
- Hooks: `camelCase.ts` (empezando con `use`)
- Utilities: `camelCase.ts`

## 🐛 Reportar Bugs

Al reportar un bug, incluye:

1. **Descripción clara** del problema
2. **Pasos para reproducir**
3. **Comportamiento esperado**
4. **Comportamiento actual**
5. **Capturas de pantalla** (si es visual)
6. **Información del sistema**
   - Navegador y versión
   - Sistema operativo
   - Versión de Node.js

## 💡 Proponer Features

Al proponer una nueva característica:

1. **Verifica** que no exista ya un issue similar
2. **Explica** el problema que resuelve
3. **Describe** la solución propuesta
4. **Considera** alternativas
5. **Incluye** mockups o ejemplos si es posible

## ✅ Checklist antes de PR

- [ ] El código compila sin errores (`npm run build`)
- [ ] El linter pasa sin errores (`npm run lint`)
- [ ] El código está formateado (`npm run format`)
- [ ] Los cambios funcionan en el navegador
- [ ] Actualicé documentación si es necesario
- [ ] Los commits tienen mensajes descriptivos
- [ ] El PR tiene una descripción clara

## 🤝 Código de Conducta

- Sé respetuoso y constructivo
- Acepta críticas constructivas
- Enfócate en lo mejor para el proyecto
- Ayuda a otros contribuidores

## 📚 Recursos

- [Documentación de React](https://react.dev/)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Vite](https://vitejs.dev/)
- [Google Gemini API](https://ai.google.dev/)

## 🆘 ¿Necesitas Ayuda?

- Abre un issue con la etiqueta `question`
- Revisa los issues existentes
- Consulta la documentación en `/docs`

¡Gracias por contribuir! 🎉
