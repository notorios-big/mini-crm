#!/bin/bash

echo "╔═══════════════════════════════════════════╗"
echo "║                                           ║"
echo "║   🚀 Notorios CRM - Inicio Rápido        ║"
echo "║                                           ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Este script debe ejecutarse desde la carpeta raíz del proyecto (mini-crm)"
    echo "   Usa: cd /Users/sam/Desktop/mini-crm"
    exit 1
fi

echo "📦 Verificando dependencias..."
echo ""

# Check backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📥 Instalando dependencias del backend..."
    cd backend && npm install && cd ..
else
    echo "✅ Backend - Dependencias OK"
fi

# Check frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "📥 Instalando dependencias del frontend..."
    cd frontend && npm install && cd ..
else
    echo "✅ Frontend - Dependencias OK"
fi

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║   ✅ Todo listo para ejecutar             ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "Para iniciar el sistema, necesitas 2 terminales:"
echo ""
echo "📍 Terminal 1 (Backend):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "📍 Terminal 2 (Frontend):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "Luego abre tu navegador en:"
echo "   🌐 Landing Page: http://localhost:3010"
echo "   🔐 Admin Panel:  http://localhost:3010/admin/login"
echo ""
echo "Credenciales por defecto:"
echo "   Email:    admin@notorios.com"
echo "   Password: admin123"
echo ""
