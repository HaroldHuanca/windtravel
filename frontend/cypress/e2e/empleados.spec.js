describe('Empleados - CRUD vía UI (mocked API)', () => {
  const usuario = { id: 1, nombre: 'Juan', apellido: 'García', email: 'juan.garcia@email.com' };

  beforeEach(() => {
    cy.wrap([]).as('empleadosState');

    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply({ statusCode: 200, body: { token: 'fake-jwt', usuario } });
    }).as('login');

    cy.intercept('GET', '/api/usuarios', (req) => {
      req.reply({ statusCode: 200, body: [usuario] });
    }).as('getUsuarios');

    cy.intercept('GET', '/api/empleados', (req) => {
      cy.get('@empleadosState').then((empleados) => {
        req.reply({ statusCode: 200, body: empleados });
      });
    }).as('getEmpleados');

    cy.intercept('POST', '/api/empleados', (req) => {
      cy.get('@empleadosState').then((empleados) => {
        const nuevo = Object.assign({ id: Date.now(), nombre: usuario.nombre, apellido: usuario.apellido }, req.body);
        empleados.push(nuevo);
        cy.wrap(empleados).as('empleadosState');
        req.reply({ statusCode: 201, body: nuevo });
      });
    }).as('createEmpleado');

    cy.intercept('PUT', /\/api\/empleados\/\d+/, (req) => {
      cy.get('@empleadosState').then((empleados) => {
        const id = parseInt(req.url.split('/').pop(), 10);
        const idx = empleados.findIndex(e => e.id === id);
        if (idx !== -1) {
          empleados[idx] = { ...empleados[idx], ...req.body };
          cy.wrap(empleados).as('empleadosState');
          req.reply({ statusCode: 200, body: empleados[idx] });
        } else {
          req.reply({ statusCode: 404 });
        }
      });
    }).as('updateEmpleado');

    cy.intercept('DELETE', /\/api\/empleados\/\d+/, (req) => {
      cy.get('@empleadosState').then((empleados) => {
        const id = parseInt(req.url.split('/').pop(), 10);
        const idx = empleados.findIndex(e => e.id === id);
        if (idx !== -1) {
          empleados.splice(idx, 1);
          cy.wrap(empleados).as('empleadosState');
          req.reply({ statusCode: 200, body: {} });
        } else {
          req.reply({ statusCode: 404 });
        }
      });
    }).as('deleteEmpleado');
  });

  it('login, crear, editar y eliminar empleado', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(usuario.email);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');

    cy.visit('/empleados');
    cy.wait('@getEmpleados');

    cy.contains('Nuevo Empleado').click();
    cy.get('select[name="usuario_id"]').select('1');
    cy.get('input[name="numero_empleado"]').type('EMP-TEST-1');
    cy.get('input[name="departamento"]').type('Ventas');
    cy.get('input[name="puesto"]').type('Asesor');
    cy.get('input[name="fecha_contratacion"]').type('2025-01-01');
    cy.contains('Guardar').click();
    cy.wait('@createEmpleado');
    cy.wait('@getEmpleados');
    cy.contains('EMP-TEST-1').should('exist');

    // editar
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').first().click();
    });
    cy.get('input[name="puesto"]').clear().type('Senior Asesor');
    cy.contains('Guardar').click();
    cy.wait('@updateEmpleado');
    cy.wait('@getEmpleados');
    cy.contains('Senior Asesor').should('exist');

    // eliminar
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').eq(1).click();
    });
    cy.on('window:confirm', () => true);
    cy.wait('@deleteEmpleado');
    cy.wait('@getEmpleados');
    cy.contains('EMP-TEST-1').should('not.exist');
  });
});
