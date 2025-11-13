-- ============================================================================
-- Base de datos: windTravel
-- Sistema de gestión de paquetes turísticos y reservas
-- Base de datos: PostgreSQL
-- ============================================================================

-- Tabla de Usuarios (base para clientes y empleados)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE,
    documento_identidad VARCHAR(20) UNIQUE NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    codigo_postal VARCHAR(20),
    preferencias TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Empleados
CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE,
    numero_empleado VARCHAR(20) UNIQUE NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    puesto VARCHAR(100) NOT NULL,
    salario DECIMAL(10, 2),
    fecha_contratacion DATE NOT NULL,
    fecha_terminacion DATE,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Proveedores
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo_proveedor VARCHAR(100) NOT NULL,
    contacto_nombre VARCHAR(100),
    contacto_email VARCHAR(100),
    contacto_telefono VARCHAR(20),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    codigo_postal VARCHAR(20),
    sitio_web VARCHAR(255),
    calificacion DECIMAL(3, 2),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Paquetes Turísticos
CREATE TABLE paquetes_turisticos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    destino VARCHAR(150) NOT NULL,
    duracion_dias INTEGER NOT NULL,
    precio_base DECIMAL(10, 2) NOT NULL,
    precio_actual DECIMAL(10, 2) NOT NULL,
    capacidad_maxima INTEGER NOT NULL,
    disponibles INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    incluye_transporte BOOLEAN DEFAULT FALSE,
    incluye_alojamiento BOOLEAN DEFAULT FALSE,
    incluye_comidas BOOLEAN DEFAULT FALSE,
    incluye_tours BOOLEAN DEFAULT FALSE,
    nivel_dificultad VARCHAR(50),
    tipo_paquete VARCHAR(100),
    proveedor_id INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
);

-- Tabla de Reservas
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    paquete_id INTEGER NOT NULL,
    numero_reserva VARCHAR(50) UNIQUE NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cantidad_personas INTEGER NOT NULL,
    precio_total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha_viaje_inicio DATE NOT NULL,
    fecha_viaje_fin DATE NOT NULL,
    comentarios TEXT,
    empleado_id INTEGER,
    fecha_confirmacion TIMESTAMP,
    fecha_cancelacion TIMESTAMP,
    razon_cancelacion TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (paquete_id) REFERENCES paquetes_turisticos(id) ON DELETE RESTRICT,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE SET NULL
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_clientes_usuario_id ON clientes(usuario_id);
CREATE INDEX idx_clientes_documento ON clientes(documento_identidad);
CREATE INDEX idx_empleados_usuario_id ON empleados(usuario_id);
CREATE INDEX idx_empleados_numero ON empleados(numero_empleado);
CREATE INDEX idx_paquetes_destino ON paquetes_turisticos(destino);
CREATE INDEX idx_paquetes_proveedor ON paquetes_turisticos(proveedor_id);
CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);
CREATE INDEX idx_reservas_paquete ON reservas(paquete_id);
CREATE INDEX idx_reservas_numero ON reservas(numero_reserva);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_fecha ON reservas(fecha_viaje_inicio);
