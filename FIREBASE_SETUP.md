# Configuración de Firebase para Habit Tracker

## Pasos para configurar Firebase:

### 1. Ve a [Firebase Console](https://console.firebase.google.com/)

### 2. Selecciona tu proyecto `habit-tracker-a9c01`

### 3. Configurar Authentication:
- Ve a **Authentication** > **Sign-in method**
- Habilita **Google** como proveedor
- En **Authorized domains**, asegúrate que esté:
  - `localhost` (para desarrollo)
  - Tu dominio de producción (cuando despliegues)

### 4. Configurar Firestore Database:
- Ve a **Firestore Database**
- Haz click en **Create database**
- Selecciona **Start in test mode** (por ahora)
- Elige una ubicación (recomendado: us-central1)

### 5. Reglas de Firestore (IMPORTANTE):
Ve a **Firestore Database** > **Rules** y reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para usuarios - solo el propietario puede leer/escribir
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reglas para hábitos - solo el propietario puede leer/escribir
    match /habits/{habitId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 6. Después de configurar:
- Reinicia el servidor de desarrollo (`npm run dev`)
- El error 400 Bad Request debería desaparecer
- La app funcionará completamente con Firebase

## Troubleshooting:

Si sigues viendo errores:
1. Verifica que las reglas de Firestore estén publicadas
2. Asegúrate que Authentication esté habilitado
3. Revisa que localhost esté en authorized domains
4. Verifica que las variables de entorno en .env sean correctas
