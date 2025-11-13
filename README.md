# TravelCRM - Sistema de Gestión de Paquetes Turísticos

Sistema completo de gestión de paquetes turísticos y reservas construido con React, Node.js y PostgreSQL.

## 📋 Características

- ✅ Autenticación de usuarios con JWT
- ✅ Gestión completa de usuarios, clientes y empleados
- ✅ Administración de proveedores de servicios
- ✅ Catálogo de paquetes turísticos
- ✅ Sistema de reservas con seguimiento de estado
- ✅ Interfaz moderna con Tailwind CSS
- ✅ API RESTful con Node.js/Express
- ✅ Base de datos PostgreSQL

## 🚀 Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### 1. Configurar la Base de Datos

```bash
# Conectar a PostgreSQL
sudo -iu postgres psql

# Crear base de datos y usuario (si no existen)
CREATE DATABASE windtravel;
CREATE USER lordarien3456 WITH PASSWORD 'mishina123';
GRANT ALL PRIVILEGES ON DATABASE windtravel TO lordarien3456;

# Otorgar permisos de creación
\c windtravel
GRANT CREATE ON SCHEMA public TO lordarien3456;
GRANT USAGE ON SCHEMA public TO lordarien3456;

# Ejecutar scripts SQL
\i /ruta/a/schema.sql
\i /ruta/a/datos_prueba.sql
```

### 2. Configurar Backend

```bash
cd backend

# Copiar archivo de configuración
cp .env.example .env

# Instalar dependencias
npm install

# Iniciar servidor
npm start
# O en modo desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

El frontend estará disponible en `http://localhost:3000`

## 📝 Credenciales de Prueba

**Email:** juan.garcia@email.com  
**Contraseña:** password123

## 🗂️ Estructura del Proyecto

```
windTravel/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── usuarios.js
│   │   ├── clientes.js
│   │   ├── empleados.js
│   │   ├── proveedores.js
│   │   ├── paquetes.js
│   │   └── reservas.js
│   ├── middleware/
│   │   └── auth.js
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Usuarios.js
│   │   │   ├── Clientes.js
│   │   │   ├── Empleados.js
│   │   │   ├── Proveedores.js
│   │   │   ├── Paquetes.js
│   │   │   └── Reservas.js
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── App.js
│   │   ├── api.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── schema.sql
├── datos_prueba.sql
└── README.md
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse

### Usuarios
- `GET /api/usuarios` - Obtener todos
- `GET /api/usuarios/:id` - Obtener uno
- `POST /api/usuarios` - Crear
- `PUT /api/usuarios/:id` - Actualizar
- `DELETE /api/usuarios/:id` - Eliminar

### Clientes, Empleados, Proveedores, Paquetes, Reservas
- Mismos endpoints que Usuarios pero con sus respectivas rutas

## 🛠️ Tecnologías Utilizadas

### Backend
- Express.js - Framework web
- PostgreSQL - Base de datos
- JWT - Autenticación
- bcryptjs - Hashing de contraseñas
- CORS - Control de acceso

### Frontend
- React - Librería UI
- React Router - Enrutamiento
- Axios - Cliente HTTP
- Tailwind CSS - Estilos
- Lucide React - Iconos

## 📚 Notas de Desarrollo

- Todas las rutas excepto `/api/auth/login` y `/api/auth/register` requieren autenticación
- El token JWT se envía en el header `Authorization: Bearer <token>`
- La contraseña de prueba es simple (password123) - en producción usar bcrypt
- Los datos de prueba incluyen 12 usuarios, 5 clientes, 7 empleados, 6 proveedores, 8 paquetes y 10 reservas

## 🤝 Contribuir

Este es un proyecto educativo. Siéntete libre de modificar y mejorar el código.

## 📄 Licencia

MIT
