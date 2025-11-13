# Guía de Configuración - TravelCRM

## Paso 1: Configurar Variables de Entorno

### Backend (.env)

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=windtravel
DB_USER=lordarien3456
DB_PASSWORD=mishina123

JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiar_en_produccion
PORT=5000
NODE_ENV=development
```

### Frontend (.env)

El archivo `.env` ya existe en `frontend/` con:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Paso 2: Instalar Dependencias

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Paso 3: Iniciar los Servidores

### Terminal 1 - Backend

```bash
cd backend
npm start
# O para desarrollo con auto-reload:
npm run dev
```

Debería ver:
```
🚀 Servidor TravelCRM ejecutándose en puerto 5000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

Se abrirá automáticamente en `http://localhost:3000`

## Paso 4: Acceder a la Aplicación

1. Abre `http://localhost:3000` en tu navegador
2. Usa las credenciales de prueba:
   - Email: `juan.garcia@email.com`
   - Contraseña: `password123`

## Solución de Problemas

### Error de conexión a la base de datos

Verifica que:
- PostgreSQL está corriendo: `sudo systemctl status postgresql`
- La base de datos existe: `psql -U lordarien3456 -d windtravel -c "SELECT 1"`
- Las credenciales en `.env` son correctas

### Error de puerto en uso

Si el puerto 5000 o 3000 está en uso:

```bash
# Cambiar puerto del backend en .env
PORT=5001

# O matar el proceso
lsof -ti:5000 | xargs kill -9
```

### CORS errors

Asegúrate de que:
- El backend está corriendo en `http://localhost:5000`
- El frontend está corriendo en `http://localhost:3000`
- La URL en `frontend/.env` es correcta

## Notas Importantes

- ⚠️ Cambiar `JWT_SECRET` en producción
- ⚠️ Implementar hashing de contraseñas con bcrypt en producción
- ⚠️ No compartir credenciales de base de datos
- ⚠️ Usar variables de entorno para configuración sensible
