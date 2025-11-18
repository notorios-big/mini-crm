# Notorios - Landing Page + Mini CRM

Sistema completo de landing page con embudo de conversión y mini CRM para gestión de leads, diseñado específicamente para Notorios - empresa de automatizaciones con inteligencia artificial.

## 🚀 Características

### Landing Page (3 Pasos)

1. **Paso 1 - Captura de Leads**
   - Imagen de portada personalizable con botón play falso
   - Formulario de captura (Nombre, Email, Teléfono, Ciudad, País)
   - Validación en tiempo real
   - Diseño responsive y mobile-first

2. **Paso 2 - Video de Presentación**
   - Soporte para YouTube y Vimeo
   - Video responsive
   - Tracking de visualización

3. **Paso 3 - Página de Agradecimiento**
   - Mensaje personalizable
   - Integración con Meta Pixel (Facebook Ads)
   - CTAs para siguiente paso

### Mini CRM / Back Office

- **Dashboard con métricas**: Total de leads, tasa de conversión, embudo de ventas
- **Gestión de Leads**:
  - Lista con búsqueda y filtros
  - Estados: Nuevo, Contactado, Calificado, Cliente, Descartado
  - Sistema de etiquetas personalizables
  - Notas internas
  - Timeline de interacciones
- **Automatización de Emails**:
  - Secuencias de emails automatizados
  - Triggers configurables
  - Editor de plantillas con variables
- **Configuración**:
  - Personalización de textos del landing
  - Upload de imagen de portada
  - Configuración de video
  - Integración SMTP
  - Meta Pixel ID

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: SQLite (local, fácil de desplegar)
- **Autenticación**: JWT
- **Email**: Nodemailer
- **Estado**: Zustand
- **Iconos**: Lucide React

## 📦 Instalación

### Opción 1: Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd mini-crm

# 2. Configurar variables de entorno (opcional)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Construir y ejecutar con Docker
docker-compose up -d

# La aplicación estará disponible en:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Opción 2: Instalación Manual

#### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env (opcional)
cp .env.example .env

# Modo desarrollo
npm run dev

# O construir para producción
npm run build
npm start
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env (opcional)
cp .env.example .env

# Modo desarrollo
npm run dev

# O construir para producción
npm run build
npm run preview
```

## 🔐 Credenciales por Defecto

- **Email**: admin@notorios.com
- **Contraseña**: admin123

⚠️ **IMPORTANTE**: Cambia estas credenciales en producción desde el panel de administración.

## 📝 Configuración Inicial

### 1. Acceder al Panel de Administración

1. Visita `http://localhost:3000/admin/login`
2. Inicia sesión con las credenciales por defecto
3. Ve a **Configuración**

### 2. Configurar Landing Page

- **Título y Subtítulo**: Personaliza los textos principales
- **Imagen de Portada**: Sube una imagen atractiva (recomendado: 1920x1080px)
- **Video**: Ingresa la URL de YouTube o Vimeo

### 3. Configurar Email (Opcional pero Recomendado)

Para Gmail:
1. Ve a Configuración → SMTP
2. Configura:
   - Host: `smtp.gmail.com`
   - Puerto: `587`
   - Usuario: tu email de Gmail
   - Contraseña: [Contraseña de aplicación](https://support.google.com/accounts/answer/185833)
   - Email de origen: tu email

### 4. Crear Secuencias de Email

1. Ve a **Secuencias de Email**
2. Crea secuencias automatizadas para nuevos leads
3. Usa variables: `{nombre}`, `{email}`, `{phone}`, `{ciudad}`, `{pais}`

Ejemplo:
```
Asunto: Hola {nombre}, gracias por tu interés

Cuerpo:
Hola {nombre},

Gracias por tu interés en Notorios. Nos pondremos en contacto contigo pronto al {phone}.

Saludos,
El equipo de Notorios
```

### 5. Configurar Meta Pixel (Opcional)

1. Obtén tu Pixel ID de Facebook Business Manager
2. Ingresa el ID en Configuración → Meta Pixel
3. Los eventos `Lead` y `CompleteRegistration` se trackearán automáticamente

## 🎨 Personalización

### Colores del Brand

Edita `frontend/tailwind.config.js`:

```js
colors: {
  primary: {
    // Tus colores primarios
  },
  secondary: {
    // Tus colores secundarios
  },
}
```

### Textos y Mensajes

Todos los textos son configurables desde el panel de **Configuración**.

## 📊 Uso del CRM

### Gestión de Leads

1. **Dashboard**: Vista general de métricas
2. **Leads**: Lista completa con filtros por estado, búsqueda y etiquetas
3. **Detalle de Lead**:
   - Cambiar estado
   - Agregar/quitar etiquetas
   - Agregar notas internas
   - Ver historial

### Estados de Leads

- **Nuevo**: Lead recién capturado
- **Contactado**: Ya se estableció contacto
- **Calificado**: Lead con potencial de conversión
- **Cliente**: Lead convertido
- **Descartado**: Lead no interesado

### Etiquetas

Crea etiquetas personalizadas para organizar tus leads:
- Por industria (e.g., "E-commerce", "SaaS")
- Por interés (e.g., "Chatbots", "Automatización")
- Por prioridad (e.g., "Alta", "Media", "Baja")

## 🔄 Automatización de Emails

### Cómo Funciona

1. Un usuario completa el formulario del landing
2. El sistema programa automáticamente los emails configurados
3. Un cron job (cada minuto) envía los emails pendientes según el delay configurado
4. Puedes ver el estado de envío en el dashboard

### Configurar Delays

- **Delay días**: Número de días después del registro
- **Delay horas**: Horas adicionales (0-23)

Ejemplos:
- Email inmediato: 0 días, 0 horas
- Email al día siguiente: 1 día, 0 horas
- Email después de 3 días: 3 días, 0 horas

## 🚀 Despliegue en Producción

### Requisitos

- Node.js 18+ o Docker
- Dominio (recomendado)
- Servidor VPS o servicio cloud (AWS, DigitalOcean, etc.)

### Pasos

1. **Configurar variables de entorno**:
   - Cambiar `JWT_SECRET` en backend/.env
   - Actualizar `FRONTEND_URL`

2. **Desplegar con Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Configurar Reverse Proxy (Nginx/Caddy)**:
   - Apuntar dominio al servidor
   - Configurar SSL con Let's Encrypt

4. **Cambiar credenciales por defecto**:
   - Inicia sesión y cambia la contraseña de admin

### Recomendaciones de Seguridad

- [ ] Cambiar contraseña de admin
- [ ] Configurar JWT_SECRET único
- [ ] Habilitar HTTPS
- [ ] Configurar firewall
- [ ] Backups automáticos de database.sqlite

## 📁 Estructura del Proyecto

```
mini-crm/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de DB
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Tipos TypeScript
│   │   ├── routes/         # Rutas API
│   │   ├── middleware/     # Auth middleware
│   │   ├── services/       # Servicios (email)
│   │   └── server.ts       # Servidor Express
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── services/      # API calls
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # CSS global
│   ├── package.json
│   └── vite.config.ts
├── uploads/               # Archivos subidos
├── docker-compose.yml
└── README.md
```

## 🐛 Troubleshooting

### El backend no inicia

- Verifica que el puerto 3001 esté disponible
- Revisa los logs: `docker-compose logs backend`

### No se envían emails

- Verifica la configuración SMTP en Configuración
- Para Gmail, asegúrate de usar contraseña de aplicación
- Revisa los logs del backend

### Error al subir imagen

- Verifica permisos de la carpeta `uploads/`
- Tamaño máximo: 5MB
- Formatos permitidos: JPG, PNG, GIF, WEBP

### La base de datos está vacía

- La base de datos se crea automáticamente al iniciar
- Usuario admin se crea automáticamente
- Si necesitas resetear: elimina `backend/database.sqlite` y reinicia

## 📈 Roadmap

- [ ] Integración con WhatsApp API
- [ ] Integración con Chatwoot
- [ ] Dashboard de analíticas avanzadas
- [ ] Export de leads a CSV/Excel
- [ ] Webhooks para integraciones
- [ ] Multi-idioma
- [ ] Temas personalizables
- [ ] Email builder visual

## 🤝 Soporte

Para soporte técnico o consultas:
- Email: info@notorios.com
- WhatsApp: [Tu número]

## 📄 Licencia

MIT License - Ver LICENSE file para más detalles

---

Desarrollado con ❤️ para Notorios
