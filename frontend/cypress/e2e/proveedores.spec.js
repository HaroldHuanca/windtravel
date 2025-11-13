describe('Proveedores - CRUD vía UI (mocked API)', () => {
  const usuario = { id: 1, nombre: 'Juan', apellido: 'García', email: 'juan.garcia@email.com' };

  beforeEach(() => {
    cy.wrap([]).as('proveedoresState');

    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply({ statusCode: 200, body: { token: 'fake-jwt', usuario } });
    }).as('login');

    cy.intercept('GET', '/api/proveedores', (req) => {
      cy.get('@proveedoresState').then((proveedores) => {
        req.reply({ statusCode: 200, body: proveedores });
      });
    }).as('getProveedores');

    cy.intercept('POST', '/api/proveedores', (req) => {
      cy.get('@proveedoresState').then((proveedores) => {
        const nuevo = Object.assign({ id: Date.now() }, req.body);
        proveedores.push(nuevo);
        cy.wrap(proveedores).as('proveedoresState');
        req.reply({ statusCode: 201, body: nuevo });
      });
    }).as('createProveedor');

    cy.intercept('PUT', /\/api\/proveedores\/\d+/, (req) => {
      cy.get('@proveedoresState').then((proveedores) => {
        const id = parseInt(req.url.split('/').pop(), 10);
        const idx = proveedores.findIndex(p => p.id === id);
        if (idx !== -1) {
          proveedores[idx] = { ...proveedores[idx], ...req.body };
          cy.wrap(proveedores).as('proveedoresState');
          req.reply({ statusCode: 200, body: proveedores[idx] });
        } else {
          req.reply({ statusCode: 404 });
        }
      });
    }).as('updateProveedor');

    cy.intercept('DELETE', /\/api\/proveedores\/\d+/, (req) => {
      cy.get('@proveedoresState').then((proveedores) => {
        const id = parseInt(req.url.split('/').pop(), 10);
        const idx = proveedores.findIndex(p => p.id === id);
        if (idx !== -1) {
          proveedores.splice(idx, 1);
          cy.wrap(proveedores).as('proveedoresState');
          req.reply({ statusCode: 200, body: {} });
        } else {
          req.reply({ statusCode: 404 });
        }
      });
    }).as('deleteProveedor');
  });

  it('login, crear, editar y eliminar proveedor', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(usuario.email);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');

    cy.visit('/proveedores');
    cy.wait('@getProveedores');

    cy.contains('Nuevo Proveedor').click();
    cy.get('input[name="nombre"]').type('Proveedor Test');
    cy.get('input[name="tipo_proveedor"]').type('Alojamiento');
    cy.get('input[name="contacto_nombre"]').type('Contacto Test');
    cy.contains('Guardar').click();
    cy.wait('@createProveedor');
    cy.wait('@getProveedores');
    cy.contains('Proveedor Test').should('exist');

    // editar
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').first().click();
    });
    cy.get('input[name="tipo_proveedor"]').clear().type('Transporte');
    cy.contains('Guardar').click();
    cy.wait('@updateProveedor');
    cy.wait('@getProveedores');
    cy.contains('Transporte').should('exist');

    // eliminar
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').eq(1).click();
    });
    cy.on('window:confirm', () => true);
    cy.wait('@deleteProveedor');
    cy.wait('@getProveedores');
    cy.contains('Proveedor Test').should('not.exist');
  });
});
