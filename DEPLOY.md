# Deploy a Render.com

## Pasos para desplegar en Render:

### 1. Preparación local ✅
- [x] `render.yaml` configurado
- [x] `public/_redirects` creado para SPA routing
- [x] Build de producción probado

### 2. En GitHub:
```bash
git add .
git commit -m "feat: add Render deployment configuration"
git push origin main
```

### 3. En Render.com:
1. Ve a [render.com](https://render.com) y conecta tu cuenta GitHub
2. Click **"New +"** > **"Web Service"**
3. Conecta tu repositorio `alexcamachogz/habit-tracker`
4. Render detectará automáticamente `render.yaml`
5. Configura las variables de entorno:
   - `VITE_FIREBASE_API_KEY`: Tu API key de Firebase
   - `VITE_FIREBASE_AUTH_DOMAIN`: habit-tracker-a9c01.firebaseapp.com
   - `VITE_FIREBASE_PROJECT_ID`: habit-tracker-a9c01
   - `VITE_FIREBASE_STORAGE_BUCKET`: habit-tracker-a9c01.firebasestorage.app
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: 984086946826
   - `VITE_FIREBASE_APP_ID`: 1:984086946826:web:f217d55448d86379deabf3

### 4. En Firebase Console:
1. Ve a **Authentication** > **Settings** > **Authorized domains**
2. Agrega tu dominio de Render: `tu-app-name.onrender.com`

### 5. Verificación:
- El deploy toma ~5-10 minutos
- Render te dará una URL tipo: `https://habit-tracker-abc123.onrender.com`
- Prueba el login y las funcionalidades

## Notas importantes:
- Render free tier: La app puede "dormir" después de 15 min de inactividad
- El primer acceso después de dormir toma ~30 segundos en despertar
- Para apps críticas considera el plan pago de Render
