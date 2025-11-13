# Estructura del Proyecto TravelCRM

## 📁 Árbol de Directorios

```
windTravel/
│
├── 📄 schema.sql                    # Definición de tablas PostgreSQL
├── 📄 datos_prueba.sql              # Datos iniciales para pruebas
├── 📄 README.md                     # Documentación principal
├── 📄 SETUP.md                      # Guía de configuración
├── 📄 ESTRUCTURA.md                 # Este archivo
│
├── 📁 backend/                      # API Node.js/Express
│   ├── 📁 routes/                   # Rutas de la API
│   │   ├── auth.js                  # Login y registro
│   │   ├── usuarios.js              # CRUD usuarios
│   │   ├── clientes.js              # CRUD clientes
│   │   ├── empleados.js             # CRUD empleados
│   │   ├── proveedores.js           # CRUD proveedores
│   │   ├── paquetes.js              # CRUD paquetes turísticos
│   │   └── reservas.js              # CRUD reservas
│   │
│   ├── 📁 middleware/               # Middlewares
│   │   └── auth.js                  # Validación de JWT
│   │
│   ├── 📄 db.js                     # Conexión a PostgreSQL
│   ├── 📄 server.js                 # Punto de entrada
│   ├── 📄 package.json              # Dependencias
│   ├── 📄 .env.example              # Plantilla de variables
│   ├── 📄 .gitignore                # Archivos a ignorar
│   └── 📄 .env                      # ⚠️ Variables de entorno (crear)
│
└── 📁 frontend/                     # Aplicación React
    ├── 📁 public/                   # Archivos estáticos
    │   └── index.html               # HTML principal
    │
    ├── 📁 src/                      # Código fuente
    │   ├── 📁 pages/                # Páginas/Vistas
    │   │   ├── Login.js             # Página de login
    │   │   ├── Register.js          # Página de registro
    │   │   ├── Dashboard.js         # Panel principal
    │   │   ├── Usuarios.js          # Gestión de usuarios
    │   │   ├── Clientes.js          # Gestión de clientes
    │   │   ├── Empleados.js         # Gestión de empleados
    │   │   ├── Proveedores.js       # Gestión de proveedores
    │   │   ├── Paquetes.js          # Gestión de paquetes
    │   │   └── Reservas.js          # Gestión de reservas
    │   │
    │   ├── 📁 components/           # Componentes reutilizables
    │   │   └── Navbar.js            # Barra de navegación
    │   │
    │   ├── 📄 App.js                # Componente principal
    │   ├── 📄 api.js                # Cliente HTTP (axios)
    │   ├── 📄 index.js              # Punto de entrada React
    │   └── 📄 index.css             # Estilos globales
    │
    ├── 📄 package.json              # Dependencias
    ├── 📄 .env                      # Variables de entorno
    ├── 📄 .gitignore                # Archivos a ignorar
    ├── 📄 tailwind.config.js        # Configuración Tailwind
    ├── 📄 postcss.config.js         # Configuración PostCSS
    └── 📄 .gitignore                # Archivos a ignorar
```

## 🗄️ Base de Datos

### Tablas PostgreSQL

```
usuarios
├── id (PK)
├── nombre
├── apellido
├── email (UNIQUE)
├── telefono
├── fecha_registro
└── activo

clientes
├── id (PK)
├── usuario_id (FK → usuarios)
├── documento_identidad (UNIQUE)
├── tipo_documento
├── fecha_nacimiento
├── direccion
├── ciudad
├── pais
├── codigo_postal
├── preferencias
└── fecha_creacion

empleados
├── id (PK)
├── usuario_id (FK → usuarios)
├── numero_empleado (UNIQUE)
├── departamento
├── puesto
├── salario
├── fecha_contratacion
├── fecha_terminacion
└── activo

proveedores
├── id (PK)
├── nombre
├── tipo_proveedor
├── contacto_nombre
├── contacto_email
├── contacto_telefono
├── direccion
├── ciudad
├── pais
├── codigo_postal
├── sitio_web
├── calificacion
├── activo
└── fecha_registro

paquetes_turisticos
├── id (PK)
├── nombre
├── descripcion
├── destino
├── duracion_dias
├── precio_base
├── precio_actual
├── capacidad_maxima
├── disponibles
├── fecha_inicio
├── fecha_fin
├── incluye_transporte
├── incluye_alojamiento
├── incluye_comidas
├── incluye_tours
├── nivel_dificultad
├── tipo_paquete
├── proveedor_id (FK → proveedores)
├── activo
└── fecha_creacion

reservas
├── id (PK)
├── cliente_id (FK → clientes)
├── paquete_id (FK → paquetes_turisticos)
├── numero_reserva (UNIQUE)
├── fecha_reserva
├── cantidad_personas
├── precio_total
├── estado
├── fecha_viaje_inicio
├── fecha_viaje_fin
├── comentarios
├── empleado_id (FK → empleados)
├── fecha_confirmacion
├── fecha_cancelacion
└── razon_cancelacion
```

## 🔌 API Endpoints

### Autenticación (Público)
```
POST   /api/auth/login              # Iniciar sesión
POST   /api/auth/register           # Registrarse
```

### Usuarios (Protegido)
```
GET    /api/usuarios                # Listar todos
GET    /api/usuarios/:id            # Obtener uno
POST   /api/usuarios                # Crear
PUT    /api/usuarios/:id            # Actualizar
DELETE /api/usuarios/:id            # Eliminar
```

### Clientes (Protegido)
```
GET    /api/clientes                # Listar todos
GET    /api/clientes/:id            # Obtener uno
POST   /api/clientes                # Crear
PUT    /api/clientes/:id            # Actualizar
DELETE /api/clientes/:id            # Eliminar
```

### Empleados (Protegido)
```
GET    /api/empleados               # Listar todos
GET    /api/empleados/:id           # Obtener uno
POST   /api/empleados               # Crear
PUT    /api/empleados/:id           # Actualizar
DELETE /api/empleados/:id           # Eliminar
```

### Proveedores (Protegido)
```
GET    /api/proveedores             # Listar todos
GET    /api/proveedores/:id         # Obtener uno
POST   /api/proveedores             # Crear
PUT    /api/proveedores/:id         # Actualizar
DELETE /api/proveedores/:id         # Eliminar
```

### Paquetes (Protegido)
```
GET    /api/paquetes                # Listar todos
GET    /api/paquetes/:id            # Obtener uno
POST   /api/paquetes                # Crear
PUT    /api/paquetes/:id            # Actualizar
DELETE /api/paquetes/:id            # Eliminar
```

### Reservas (Protegido)
```
GET    /api/reservas                # Listar todos
GET    /api/reservas/:id            # Obtener uno
POST   /api/reservas                # Crear
PUT    /api/reservas/:id            # Actualizar
DELETE /api/reservas/:id            # Eliminar
```

## 🎨 Componentes Frontend

### Páginas
- **Login.js** - Autenticación de usuarios
- **Register.js** - Registro de nuevos usuarios
- **Dashboard.js** - Panel principal con acceso a módulos
- **Usuarios.js** - CRUD de usuarios
- **Clientes.js** - CRUD de clientes
- **Empleados.js** - CRUD de empleados
- **Proveedores.js** - CRUD de proveedores
- **Paquetes.js** - CRUD de paquetes turísticos
- **Reservas.js** - CRUD de reservas

### Componentes
- **Navbar.js** - Barra de navegación con menú y logout

## 🚀 Flujo de Autenticación

1. Usuario ingresa credenciales en Login.js
2. Se envía POST a `/api/auth/login`
3. Backend valida y retorna JWT + datos usuario
4. Frontend almacena token en localStorage
5. Interceptor de axios agrega token a cada request
6. Si token expira, se redirige a login

## 📦 Dependencias Principales

### Backend
- express@^4.18.2
- pg@^8.10.0
- jsonwebtoken@^9.1.0
- bcryptjs@^2.4.3
- cors@^2.8.5
- dotenv@^16.3.1

### Frontend
- react@^18.2.0
- react-router-dom@^6.16.0
- axios@^1.5.0
- tailwindcss@^3.3.0
- lucide-react@^0.263.1
