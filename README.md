# Habit Tracker 📊

Una aplicación moderna para el seguimiento de hábitos construida con React, TypeScript, Vite y Firebase.

## 🚀 Características

- ✅ **Autenticación con Google** - Login seguro con Firebase Auth
- 📱 **Responsive Design** - Optimizada para móvil y desktop
- 📊 **Seguimiento de Progreso** - Estadísticas y visualizaciones
- 🗓️ **Vista de Calendario** - Seguimiento visual por fechas
- 🔥 **Rachas y Métricas** - Motivación con estadísticas de progreso
- 💾 **Persistencia en la Nube** - Datos sincronizados con Firestore

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **Backend**: Firebase (Auth + Firestore)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Instalación

```bash
# Clona el repositorio
git clone <repository-url>
cd habit-tracker

# Instala dependencias
npm install

# Configura Firebase (ver sección Firebase)
cp .env.example .env
# Edita .env con tus credenciales de Firebase
```

## 🔥 Configuración de Firebase

### Prerrequisitos

1. Cuenta de Google/Firebase
2. Proyecto creado en [Firebase Console](https://console.firebase.google.com/)

### Pasos de configuración:

1. **Ve a Firebase Console** y selecciona tu proyecto `habit-tracker-a9c01`

2. **Habilita Authentication:**

   - Authentication > Sign-in method
   - Activa **Google** como proveedor
   - Agrega `localhost` a dominios autorizados

3. **Crea Firestore Database:**

   - Firestore Database > Create database
   - Modo: "Start in test mode"
   - Ubicación: us-central1

4. **Configura las reglas de Firestore:**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /habits/{habitId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```

5. **Actualiza el archivo .env** con tus credenciales

### Verificación:

Ver [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) para detalles completos

## 🚀 Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📱 Funcionalidades

### Páginas:

- **Resumen**: Vista semanal
- **Hoy**: Marcado de hábitos
- **Calendario**: Vista mensual
- **Hábitos**: Gestión CRUD
- **Progreso**: Estadísticas

## 🎯 Estado del Proyecto

### ✅ Completado:

- [x] Proyecto base (React + TypeScript + Vite)
- [x] Firebase Auth + Firestore
- [x] UI responsive y navegación móvil
- [x] Gestión de estado con Context API
- [x] Todas las páginas principales
- [x] Manejo de errores y loading
- [x] Layout full width optimizado

### 🔄 Pendiente:

- [ ] **Firebase Console setup** (Authentication + Firestore rules)
- [ ] Testing completo
- [ ] Deploy

## 📚 Docs

- [Setup Firebase](./FIREBASE_SETUP.md)
- [Dev Instructions](./.github/copilot-instructions.md)
