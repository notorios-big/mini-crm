# 🚀 Guía de Inicio Rápido - Notorios CRM

## ⚡ Opción 1: Scripts Automáticos (Más Fácil)

### Paso 1: Verificar e instalar dependencias

```bash
cd /Users/sam/Desktop/mini-crm
./start.sh
```

Este script verifica que todo esté instalado correctamente.

### Paso 2: Iniciar Backend (Terminal 1)

```bash
cd /Users/sam/Desktop/mini-crm
npm run backend
```

✅ El backend correrá en: **http://localhost:3001**

### Paso 3: Iniciar Frontend (Terminal 2 - NUEVA)

Abre **otra terminal** y ejecuta:

```bash
cd /Users/sam/Desktop/mini-crm
npm run frontend
```

✅ El frontend correrá en: **http://localhost:3000**

---

## 📝 Opción 2: Manual (Paso a Paso)

### Terminal 1 - Backend

```bash
cd /Users/sam/Desktop/mini-crm/backend
npm install          # Solo la primera vez
npm run dev          # Inicia el servidor
```

Deberías ver:
```
╔═══════════════════════════════════════════╗
║   🚀 Notorios CRM Backend                ║
║   Server: http://localhost:3001          ║
║   Status: ✓ Running                      ║
╚═══════════════════════════════════════════╝
✓ Database connected
✓ Database tables initialized
```

### Terminal 2 - Frontend (NUEVA TERMINAL)

```bash
cd /Users/sam/Desktop/mini-crm/frontend
npm install          # Solo la primera vez
npm run dev          # Inicia el servidor
```

Deberías ver:
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

---

## 🌐 Acceder al Sistema

### Landing Page
👉 **http://localhost:3000**

Prueba el funnel completo:
1. Click en el botón Play
2. Llena el formulario
3. Ve el video
4. Llega a la página de agradecimiento

### Panel de Administración
👉 **http://localhost:3000/admin/login**

**Credenciales por defecto:**
- Email: `admin@notorios.com`
- Password: `admin123`

⚠️ **Importante:** Cambia estas credenciales en producción.

---

## 🎯 Primeros Pasos en el Admin

1. **Dashboard** - Ver métricas generales
2. **Configuración** - Personalizar textos, subir imagen, configurar video
3. **Etiquetas** - Crear tags para organizar leads
4. **Secuencias de Email** - Configurar emails automáticos
5. **Leads** - Ver todos los leads capturados

---

## 🛠️ Comandos Útiles

### Desde la raíz del proyecto:

```bash
# Instalar todas las dependencias
npm run install:all

# Iniciar backend
npm run backend

# Iniciar frontend
npm run frontend

# Construir para producción
npm run build
```

### Comandos individuales:

```bash
# Backend
cd backend
npm run dev          # Modo desarrollo
npm run build        # Construir
npm start            # Producción

# Frontend
cd frontend
npm run dev          # Modo desarrollo
npm run build        # Construir
npm run preview      # Preview de producción
```

---

## ❓ Problemas Comunes

### Error: "Port 3001 already in use"
Ya hay algo corriendo en el puerto 3001.
```bash
# Encuentra y mata el proceso
lsof -ti:3001 | xargs kill -9
```

### Error: "Port 3000 already in use"
Ya hay algo corriendo en el puerto 3000.
```bash
# Encuentra y mata el proceso
lsof -ti:3000 | xargs kill -9
```

### No aparece el admin user
La base de datos se crea automáticamente al iniciar el backend.
Si tienes problemas:
```bash
cd backend
rm database.sqlite  # Elimina la DB
npm run dev         # Reinicia (se crea automáticamente)
```

### No se envían emails
1. Ve a **Configuración → SMTP**
2. Configura tu servidor SMTP
3. Para Gmail, usa una [contraseña de aplicación](https://support.google.com/accounts/answer/185833)

---

## 📊 Flujo de Trabajo Recomendado

1. ✅ Inicia backend y frontend
2. ✅ Accede al admin panel
3. ✅ Ve a **Configuración** y personaliza todo
4. ✅ Sube tu imagen de portada
5. ✅ Configura la URL del video (YouTube/Vimeo)
6. ✅ Crea etiquetas
7. ✅ Configura secuencias de email
8. ✅ Prueba el landing page en modo incógnito
9. ✅ Verifica que el lead apareció en el CRM

---

## 🎨 Personalización

### Cambiar colores del brand
Edita: `frontend/tailwind.config.js`

### Cambiar textos
Todo desde el panel de **Configuración** (no necesitas tocar código)

### Cambiar estructura
- Backend: `backend/src/`
- Frontend: `frontend/src/`

---

## 📞 Soporte

¿Necesitas ayuda? El código está 100% comentado y documentado.

Revisa el **README.md** completo para más información.

---

¡Disfruta tu nuevo sistema CRM! 🎉
