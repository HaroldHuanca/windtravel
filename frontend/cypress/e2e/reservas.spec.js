describe('Reservas - CRUD vía UI (mocked API)', () => {
  const usuario = { id: 1, nombre: 'Juan', apellido: 'García', email: 'juan.garcia@email.com' };

  beforeEach(() => {
    let reservasState = [];

    cy.intercept('POST', '**/api/auth/login', (req) => {
      req.reply({ statusCode: 200, body: { token: 'fake-jwt', usuario } });
    }).as('login');

    // Mock para clientes y paquetes (selects / lookup)
    cy.intercept('GET', '**/api/clientes', (req) => {
      req.reply({ statusCode: 200, body: [{ id: 1, nombre: 'Juan', apellido: 'García', documento_identidad: '123' }] });
    }).as('getClientes');
    cy.intercept('GET', '**/api/paquetes', (req) => {
      req.reply({ statusCode: 200, body: [{ id: 1, nombre: 'Paquete Test', destino: 'Bogotá' }] });
    }).as('getPaquetes');
    cy.intercept('GET', '**/api/empleados', (req) => {
      req.reply({ statusCode: 200, body: [{ id: 1, nombre: 'Ana', apellido: 'López', numero_empleado: 'E-1' }] });
    }).as('getEmpleados');

    cy.intercept('GET', '**/api/reservas', (req) => {
      req.reply({ statusCode: 200, body: reservasState });
    }).as('getReservas');

    cy.intercept('POST', '**/api/reservas', (req) => {
      const nuevo = Object.assign({ id: Date.now(), numero_reserva: `RES-${Date.now()}` }, req.body);
      reservasState.push(nuevo);
      req.reply({ statusCode: 201, body: nuevo });
    }).as('createReserva');

    cy.intercept('PUT', /\/api\/reservas\/\d+/, (req) => {
      const id = parseInt(req.url.split('/').pop(), 10);
      const idx = reservasState.findIndex(r => r.id === id);
      if (idx !== -1) {
        reservasState[idx] = { ...reservasState[idx], ...req.body };
        req.reply({ statusCode: 200, body: reservasState[idx] });
      } else {
        req.reply({ statusCode: 404 });
      }
    }).as('updateReserva');

    cy.intercept('DELETE', /\/api\/reservas\/\d+/, (req) => {
      const id = parseInt(req.url.split('/').pop(), 10);
      const idx = reservasState.findIndex(r => r.id === id);
      if (idx !== -1) {
        reservasState.splice(idx, 1);
        req.reply({ statusCode: 200, body: {} });
      } else {
        req.reply({ statusCode: 404 });
      }
    }).as('deleteReserva');
  });

  it('login, crear, editar y eliminar reserva', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(usuario.email);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');

    cy.visit('/reservas');
    cy.wait('@getReservas');
    cy.wait('@getClientes');
    cy.wait('@getPaquetes');
    cy.wait('@getEmpleados');

    cy.contains('Gestión de Reservas', { timeout: 10000 }).should('exist');
    cy.contains('button', 'Nueva Reserva', { timeout: 10000 }).click();

    // seleccionar cliente y paquete (se asume que son selects o inputs de texto según UI)
    cy.get('select[name="cliente_id"]').select('1');
    cy.get('select[name="paquete_id"]').select('1');
    cy.get('input[name="cantidad_personas"]').type('2');
    cy.get('input[name="precio_total"]').type('500000');
    cy.get('input[name="fecha_viaje_inicio"]').type('2025-02-01');
    cy.get('input[name="fecha_viaje_fin"]').type('2025-02-05');
    cy.contains('Guardar').click();
    cy.wait('@createReserva');
    cy.wait('@getReservas');
    cy.contains('RES-').should('exist');

    // editar
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').first().click();
    });
    cy.get('input[name="cantidad_personas"]').clear().type('3');
    cy.contains('Guardar').click();
    cy.wait('@updateReserva');
    cy.wait('@getReservas');
    cy.contains('3').should('exist');

    // eliminar
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').eq(1).click();
    });
    cy.on('window:confirm', () => true);
    cy.wait('@deleteReserva');
    cy.wait('@getReservas');
    cy.contains('RES-').should('not.exist');
  });
});
