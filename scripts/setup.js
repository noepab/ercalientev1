#!/usr/bin/env node

/**
 * Script de configuración interactiva para Bocateria Er'caliente
 * Este script guía al usuario a través del proceso de setup del proyecto
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Comando falló con código ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', reject);
  });
}

async function checkNodeVersion() {
  console.log('\n🔍 Verificando versión de Node.js...');
  const version = process.version;
  const majorVersion = parseInt(version.split('.')[0].substring(1));

  if (majorVersion < 18) {
    console.error('❌ Error: Se requiere Node.js 18 o superior');
    console.error(`   Versión actual: ${version}`);
    process.exit(1);
  }

  console.log(`✅ Node.js ${version} detectado`);
}

async function installDependencies() {
  console.log('\n📦 Instalando dependencias...');
  console.log('   Esto puede tomar unos minutos...\n');

  try {
    await runCommand('npm', ['install', '--legacy-peer-deps']);
    console.log('\n✅ Dependencias instaladas correctamente');
  } catch (error) {
    console.error('❌ Error instalando dependencias:', error.message);
    throw error;
  }
}

async function setupEnvironment() {
  console.log('\n🔑 Configuración de Variables de Entorno');

  if (existsSync('.env.local')) {
    const overwrite = await question(
      '⚠️  El archivo .env.local ya existe. ¿Deseas sobrescribirlo? (s/n): '
    );
    if (overwrite.toLowerCase() !== 's') {
      console.log('⏭️  Saltando configuración de entorno');
      return;
    }
  }

  console.log('\n📝 Para usar la funcionalidad de AI, necesitas una API key de Google Gemini.');
  console.log('   Puedes obtenerla en: https://ai.google.dev/');
  console.log('   Si no la tienes ahora, puedes dejarla en blanco y configurarla después.\n');

  const apiKey = await question('Ingresa tu GEMINI_API_KEY (o presiona Enter para omitir): ');

  let envContent = "# Variables de Entorno para Bocateria Er'caliente\n\n";
  envContent += '# Google Gemini API Key\n';
  envContent += '# Obtén tu API key en: https://ai.google.dev/\n';
  envContent += `VITE_GEMINI_API_KEY=${apiKey || 'tu_api_key_aqui'}\n`;

  writeFileSync('.env.local', envContent);
  console.log('✅ Archivo .env.local creado');

  if (!apiKey) {
    console.log(
      '⚠️  Recuerda configurar tu GEMINI_API_KEY en .env.local antes de usar las funciones de AI'
    );
  }
}

async function verifyBuild() {
  console.log('\n🏗️  Verificando que el proyecto compila...');

  try {
    await runCommand('npm', ['run', 'type-check']);
    console.log('✅ Verificación de tipos completada');
  } catch (error) {
    console.log('⚠️  Advertencia: La verificación de tipos falló');
    console.log('   Esto puede ser normal si hay errores de TypeScript en el código');
  }
}

async function showNextSteps() {
  console.log('\n\n🎉 ¡Setup completado exitosamente!\n');
  console.log('📚 Próximos pasos:\n');
  console.log('   1. Si no lo hiciste, configura tu GEMINI_API_KEY en .env.local');
  console.log('   2. Ejecuta: npm run dev');
  console.log('   3. Abre tu navegador en: http://localhost:5173\n');
  console.log('📖 Documentación disponible:');
  console.log('   - README.md - Información general');
  console.log('   - DEVELOPMENT.md - Guía de desarrollo');
  console.log('   - CONTRIBUTING.md - Guía para contribuir\n');
  console.log('💡 Comandos útiles:');
  console.log('   npm run dev        - Inicia servidor de desarrollo');
  console.log('   npm run build      - Construye para producción');
  console.log('   npm run lint       - Verifica código con ESLint');
  console.log('   npm run format     - Formatea código con Prettier');
  console.log('   npm run type-check - Verifica tipos de TypeScript\n');
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║                                                      ║');
  console.log("║       🍔 Bocateria Er'caliente - Setup 🍔          ║");
  console.log('║                                                      ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  try {
    await checkNodeVersion();
    await installDependencies();
    await setupEnvironment();
    await verifyBuild();
    await showNextSteps();
  } catch (error) {
    console.error('\n❌ Error durante el setup:', error.message);
    console.error('\n💡 Si el problema persiste:');
    console.error('   1. Verifica que tienes Node.js 18+ instalado');
    console.error('   2. Intenta borrar node_modules y package-lock.json');
    console.error('   3. Ejecuta: npm install --legacy-peer-deps\n');
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
