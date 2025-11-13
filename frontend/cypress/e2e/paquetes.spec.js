describe('Paquetes - CRUD vía UI (mocked API)', () => {
  const usuario = { id: 1, nombre: 'Juan', apellido: 'García', email: 'juan.garcia@email.com' };

  beforeEach(() => {
    let paquetesState = [];

    cy.intercept('POST', '**/api/auth/login', (req) => {
      req.reply({ statusCode: 200, body: { token: 'fake-jwt', usuario } });
    }).as('login');

    cy.intercept('GET', '**/api/paquetes', (req) => {
      req.reply({ statusCode: 200, body: paquetesState });
    }).as('getPaquetes');

    cy.intercept('POST', '**/api/paquetes', (req) => {
      const nuevo = Object.assign({ id: Date.now() }, req.body);
      paquetesState.push(nuevo);
      req.reply({ statusCode: 201, body: nuevo });
    }).as('createPaquete');

    cy.intercept('PUT', /\/api\/paquetes\/\d+/, (req) => {
      const id = parseInt(req.url.split('/').pop(), 10);
      const idx = paquetesState.findIndex(p => p.id === id);
      if (idx !== -1) {
        paquetesState[idx] = { ...paquetesState[idx], ...req.body };
        req.reply({ statusCode: 200, body: paquetesState[idx] });
      } else {
        req.reply({ statusCode: 404 });
      }
    }).as('updatePaquete');

    cy.intercept('DELETE', /\/api\/paquetes\/\d+/, (req) => {
      const id = parseInt(req.url.split('/').pop(), 10);
      const idx = paquetesState.findIndex(p => p.id === id);
      if (idx !== -1) {
        paquetesState.splice(idx, 1);
        req.reply({ statusCode: 200, body: {} });
      } else {
        req.reply({ statusCode: 404 });
      }
    }).as('deletePaquete');
  });

  it('login, crear, editar y eliminar paquete', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(usuario.email);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');

    cy.visit('/paquetes');
    cy.wait('@getPaquetes');

    cy.contains('Nuevo Paquete').click();
    cy.get('input[name="nombre"]').type('Escape Test');
    cy.get('input[name="destino"]').type('Cartagena');
    cy.get('input[name="duracion_dias"]').type('3');
    cy.get('input[name="precio_base"]').type('1000000');
    cy.get('input[name="precio_actual"]').type('900000');
    cy.get('input[name="capacidad_maxima"]').type('10');
    cy.get('input[name="disponibles"]').type('10');
    cy.get('input[name="fecha_inicio"]').type('2025-01-01');
    cy.get('input[name="fecha_fin"]').type('2025-01-04');
    cy.contains('Guardar').click();
    cy.wait('@createPaquete');
    cy.wait('@getPaquetes');
    cy.contains('Escape Test').should('exist');

    // editar
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').first().click();
    });
    cy.get('input[name="precio_actual"]').clear().type('850000');
    cy.contains('Guardar').click();
    cy.wait('@updatePaquete');
    cy.wait('@getPaquetes');
    cy.contains('850000').should('exist');

    // eliminar
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').eq(1).click();
    });
    cy.on('window:confirm', () => true);
    cy.wait('@deletePaquete');
    cy.wait('@getPaquetes');
    cy.contains('Escape Test').should('not.exist');
  });
});
