#!/usr/bin/env node

/**
 * Script para instalar Husky solo en entornos de desarrollo
 * No se ejecuta en CI/CD o en instalaciones de producción
 */

import { execSync } from 'child_process';

// Solo instalar Husky si no estamos en CI y no es una instalación de producción
if (!process.env.CI && !process.env.NODE_ENV === 'production') {
  try {
    console.log('📦 Configurando Husky...');
    execSync('npx husky install', { stdio: 'inherit' });
    console.log('✅ Husky configurado correctamente');
  } catch (error) {
    console.log('⚠️  No se pudo configurar Husky (esto es normal en CI/CD)');
  }
}
