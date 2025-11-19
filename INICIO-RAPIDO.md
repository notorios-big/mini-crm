# 🚀 Guía de Inicio Rápido - Notorios CRM

## ⚡ Inicio Rápido (Un Solo Comando)

### Paso 1: Instalar concurrently (solo la primera vez)

```bash
cd /Users/sam/Desktop/mini-crm
npm install
```

### Paso 2: Correr TODO con un solo comando

```bash
npm run dev
```

✅ Esto iniciará automáticamente:
- **Backend** en http://localhost:3011
- **Frontend** en http://localhost:3010

Verás los logs de ambos servidores en la misma terminal con colores:
- 🔵 BACKEND (cyan)
- 🟣 FRONTEND (magenta)

---

## 📝 Opción Alternativa: Terminales Separadas

Si prefieres ver los logs por separado:

### Terminal 1 - Backend
```bash
cd /Users/sam/Desktop/mini-crm
npm run backend
```

### Terminal 2 - Frontend (nueva terminal)
```bash
cd /Users/sam/Desktop/mini-crm
npm run frontend
```

---

## 🌐 Acceder al Sistema

### Landing Page
👉 **http://localhost:3010**

Prueba el funnel completo:
1. Click en el botón Play
2. Llena el formulario
3. Ve el video
4. Llega a la página de agradecimiento

### Panel de Administración (CRM)
👉 **http://localhost:3010/admin/login**

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

```bash
# Correr todo (backend + frontend) en una terminal
npm run dev

# Instalar todas las dependencias
npm install
npm run install:all

# Solo backend
npm run backend

# Solo frontend
npm run frontend

# Construir para producción
npm run build
```

---

## ❓ Problemas Comunes

### Error: "Port already in use"
```bash
# Encuentra y mata el proceso del puerto 3010
lsof -ti:3010 | xargs kill -9

# Encuentra y mata el proceso del puerto 3011
lsof -ti:3011 | xargs kill -9
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

1. ✅ `npm run dev` - Inicia todo
2. ✅ Accede al admin panel (http://localhost:3010/admin/login)
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

---

¡Disfruta tu nuevo sistema CRM! 🎉
