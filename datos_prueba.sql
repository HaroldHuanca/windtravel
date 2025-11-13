-- ============================================================================
-- Datos de prueba para windTravel
-- ============================================================================

-- ============================================================================
-- INSERTAR USUARIOS
-- ============================================================================

INSERT INTO usuarios (nombre, apellido, email, telefono, activo) VALUES
('Juan', 'García', 'juan.garcia@email.com', '3001234567', TRUE),
('María', 'López', 'maria.lopez@email.com', '3007654321', TRUE),
('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '3009876543', TRUE),
('Ana', 'Martínez', 'ana.martinez@email.com', '3005555555', TRUE),
('Pedro', 'Sánchez', 'pedro.sanchez@email.com', '3004444444', TRUE),
('Laura', 'Fernández', 'laura.fernandez@email.com', '3003333333', TRUE),
('Miguel', 'González', 'miguel.gonzalez@email.com', '3002222222', TRUE),
('Sofia', 'Pérez', 'sofia.perez@email.com', '3001111111', TRUE),
('Roberto', 'Díaz', 'roberto.diaz@email.com', '3008888888', TRUE),
('Elena', 'Torres', 'elena.torres@email.com', '3007777777', TRUE),
('David', 'Ramírez', 'david.ramirez@email.com', '3006666666', TRUE),
('Valentina', 'Castro', 'valentina.castro@email.com', '3009999999', TRUE);

-- ============================================================================
-- INSERTAR CLIENTES
-- ============================================================================

INSERT INTO clientes (usuario_id, documento_identidad, tipo_documento, fecha_nacimiento, direccion, ciudad, pais, codigo_postal, preferencias) VALUES
(1, '1234567890', 'DNI', '1990-05-15', 'Calle 10 #20-30', 'Bogotá', 'Colombia', '110111', 'Playas, aventura'),
(2, '1234567891', 'DNI', '1985-08-22', 'Carrera 5 #15-45', 'Medellín', 'Colombia', '050001', 'Montaña, naturaleza'),
(3, '1234567892', 'DNI', '1992-03-10', 'Avenida 9 #10-20', 'Cali', 'Colombia', '760001', 'Cultura, gastronomía'),
(4, '1234567893', 'DNI', '1988-11-30', 'Calle 50 #25-75', 'Barranquilla', 'Colombia', '080001', 'Playas, relax'),
(5, '1234567894', 'DNI', '1995-07-18', 'Carrera 7 #30-40', 'Bogotá', 'Colombia', '110111', 'Aventura, deportes');

-- ============================================================================
-- INSERTAR EMPLEADOS
-- ============================================================================

INSERT INTO empleados (usuario_id, numero_empleado, departamento, puesto, salario, fecha_contratacion, activo) VALUES
(6, 'EMP001', 'Ventas', 'Asesor de Viajes', 2500000.00, '2022-01-15', TRUE),
(7, 'EMP002', 'Operaciones', 'Coordinador de Reservas', 2800000.00, '2021-06-20', TRUE),
(8, 'EMP003', 'Atención al Cliente', 'Ejecutivo de Servicio', 2200000.00, '2023-03-10', TRUE),
(9, 'EMP004', 'Gerencia', 'Gerente General', 5000000.00, '2020-01-01', TRUE),
(10, 'EMP005', 'Finanzas', 'Contador', 3000000.00, '2022-09-05', TRUE),
(11, 'EMP006', 'Ventas', 'Asesor de Viajes', 2500000.00, '2023-02-14', TRUE),
(12, 'EMP007', 'Operaciones', 'Guía Turístico', 2000000.00, '2023-05-20', TRUE);

-- ============================================================================
-- INSERTAR PROVEEDORES
-- ============================================================================

INSERT INTO proveedores (nombre, tipo_proveedor, contacto_nombre, contacto_email, contacto_telefono, direccion, ciudad, pais, codigo_postal, sitio_web, calificacion, activo) VALUES
('Hoteles Colombia Premium', 'Alojamiento', 'Jorge Mendoza', 'jorge@hotelescp.com', '3001234567', 'Calle 100 #50-25', 'Bogotá', 'Colombia', '110111', 'www.hotelescp.com', 4.8, TRUE),
('Transporte Turístico S.A.', 'Transporte', 'Andrés López', 'andres@transporteturismo.com', '3007654321', 'Avenida 68 #45-30', 'Medellín', 'Colombia', '050001', 'www.transporteturismo.com', 4.5, TRUE),
('Aventura Extrema Tours', 'Tours y Actividades', 'Catalina Ruiz', 'catalina@aventuraextrema.com', '3009876543', 'Carrera 10 #20-15', 'Cali', 'Colombia', '760001', 'www.aventuraextrema.com', 4.7, TRUE),
('Restaurantes Gourmet', 'Alimentación', 'Fernando García', 'fernando@restaurantesgourmet.com', '3005555555', 'Calle 85 #15-50', 'Bogotá', 'Colombia', '110111', 'www.restaurantesgourmet.com', 4.6, TRUE),
('Seguros Viajero Plus', 'Seguros', 'Mariana Díaz', 'mariana@segurosviajero.com', '3004444444', 'Carrera 7 #32-80', 'Bogotá', 'Colombia', '110111', 'www.segurosviajero.com', 4.9, TRUE),
('Excursiones Naturales', 'Tours y Actividades', 'Ricardo Morales', 'ricardo@excursionesnaturales.com', '3003333333', 'Avenida 19 #100-50', 'Bogotá', 'Colombia', '110111', 'www.excursionesnaturales.com', 4.4, TRUE);

-- ============================================================================
-- INSERTAR PAQUETES TURÍSTICOS
-- ============================================================================

INSERT INTO paquetes_turisticos (nombre, descripcion, destino, duracion_dias, precio_base, precio_actual, capacidad_maxima, disponibles, fecha_inicio, fecha_fin, incluye_transporte, incluye_alojamiento, incluye_comidas, incluye_tours, nivel_dificultad, tipo_paquete, proveedor_id, activo) VALUES
('Machu Picchu Clásico', 'Visita guiada a la ciudadela inca de Machu Picchu con tren y bus incluido', 'Cusco - Machu Picchu', 3, 1500.00, 1350.00, 20, 15, '2025-01-15', '2025-01-17', TRUE, TRUE, TRUE, TRUE, 'Moderado', 'Arqueológico', 1, TRUE),
('Valle Sagrado y Pisac', 'Recorrido por Pisac, Ollantaytambo y mercados artesanales del Valle Sagrado', 'Cusco - Valle Sagrado', 2, 800.00, 720.00, 25, 20, '2025-01-20', '2025-01-21', TRUE, TRUE, TRUE, TRUE, 'Fácil', 'Cultural', 6, TRUE),
('Sacsayhuamán y Q’enqo', 'Tour por fortalezas y templos incas en los alrededores de Cusco', 'Cusco - Sacsayhuamán', 1, 300.00, 270.00, 30, 22, '2025-02-10', '2025-02-10', TRUE, TRUE, FALSE, TRUE, 'Fácil', 'Arqueológico', 3, TRUE),
('Moray y Maras', 'Explora las terrazas circulares de Moray y las salineras de Maras', 'Cusco - Moray y Maras', 1, 350.00, 315.00, 40, 35, '2025-01-25', '2025-01-25', TRUE, TRUE, TRUE, TRUE, 'Fácil', 'Cultural', 6, TRUE),
('Choquequirao Trek', 'Caminata de varios días hacia la ciudadela de Choquequirao', 'Cusco - Choquequirao', 4, 1200.00, 1080.00, 12, 5, '2025-02-15', '2025-02-18', TRUE, TRUE, TRUE, TRUE, 'Difícil', 'Aventura', 1, TRUE),
('Ollantaytambo Profundo', 'Explora las ruinas de Ollantaytambo y su historia', 'Cusco - Ollantaytambo', 1, 280.00, 250.00, 20, 18, '2025-02-05', '2025-02-05', TRUE, TRUE, TRUE, TRUE, 'Fácil', 'Arqueológico', 3, TRUE),
('Tipón Hidráulico', 'Conoce los sistemas hidráulicos incas en Tipón', 'Cusco - Tipón', 1, 220.00, 190.00, 15, 12, '2025-02-01', '2025-02-01', TRUE, TRUE, TRUE, TRUE, 'Fácil', 'Arqueológico', 2, TRUE),
('Qorikancha y Centro Histórico', 'Visita al Templo del Sol y principales atractivos del centro de Cusco', 'Cusco - Centro Histórico', 1, 180.00, 160.00, 50, 40, '2025-03-01', '2025-03-01', TRUE, TRUE, TRUE, FALSE, 'Fácil', 'Cultural', 2, TRUE);

-- ============================================================================
-- INSERTAR RESERVAS
-- ============================================================================

INSERT INTO reservas (cliente_id, paquete_id, numero_reserva, cantidad_personas, precio_total, estado, fecha_viaje_inicio, fecha_viaje_fin, comentarios, empleado_id, fecha_confirmacion) VALUES
(1, 1, 'RES-2025-001', 2, 2700000.00, 'Confirmada', '2025-01-15', '2025-01-20', 'Pareja en luna de miel', 1, CURRENT_TIMESTAMP),
(2, 2, 'RES-2025-002', 3, 6750000.00, 'Confirmada', '2025-02-01', '2025-02-08', 'Grupo de amigos aventureros', 2, CURRENT_TIMESTAMP),
(3, 3, 'RES-2025-003', 4, 4400000.00, 'Pendiente', '2025-01-20', '2025-01-24', 'Familia completa', 1, NULL),
(4, 4, 'RES-2025-004', 2, 1600000.00, 'Confirmada', '2025-02-10', '2025-02-13', 'Pareja', 3, CURRENT_TIMESTAMP),
(5, 5, 'RES-2025-005', 3, 2100000.00, 'Confirmada', '2025-01-25', '2025-01-28', 'Familia con niños', 1, CURRENT_TIMESTAMP),
(1, 6, 'RES-2025-006', 4, 10000000.00, 'Confirmada', '2025-02-15', '2025-02-19', 'Celebración de aniversario', 2, CURRENT_TIMESTAMP),
(2, 7, 'RES-2025-007', 2, 1900000.00, 'Cancelada', '2025-02-05', '2025-02-07', 'Problema de salud', 3, NULL),
(3, 8, 'RES-2025-008', 5, 8000000.00, 'Confirmada', '2025-03-01', '2025-03-07', 'Grupo corporativo', 2, CURRENT_TIMESTAMP),
(4, 1, 'RES-2025-009', 1, 1350000.00, 'Confirmada', '2025-01-15', '2025-01-20', 'Viajero solo', 1, CURRENT_TIMESTAMP),
(5, 3, 'RES-2025-010', 2, 2200000.00, 'Pendiente', '2025-01-20', '2025-01-24', 'Pareja de jubilados', 3, NULL);

-- ============================================================================
-- Resumen de datos insertados
-- ============================================================================
-- Usuarios: 12
-- Clientes: 5
-- Empleados: 7
-- Proveedores: 6
-- Paquetes Turísticos: 8
-- Reservas: 10
