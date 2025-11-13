describe('Clientes - CRUD vía UI (mocked API)', () => {
  const usuario = { id: 1, nombre: 'Juan', apellido: 'García', email: 'juan.garcia@email.com' };

  beforeEach(() => {
    // estado in-memory para simular API (en cierre síncrono)
    let clientesState = [];

    cy.intercept('POST', '**/api/auth/login', (req) => {
      req.reply({ statusCode: 200, body: { token: 'fake-jwt', usuario } });
    }).as('login');

    // Usuarios para el select
    cy.intercept('GET', '**/api/usuarios', (req) => {
      req.reply({ statusCode: 200, body: [usuario] });
    }).as('getUsuarios');

    // GET clientes - responder con el array mutable
    cy.intercept('GET', '**/api/clientes', (req) => {
      req.reply({ statusCode: 200, body: clientesState });
    }).as('getClientes');

    // POST clientes - agregar a estado
    cy.intercept('POST', '**/api/clientes', (req) => {
      const newCliente = Object.assign({ id: Date.now() }, req.body, { nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email });
      clientesState.push(newCliente);
      req.reply({ statusCode: 201, body: newCliente });
    }).as('createCliente');

    // PUT clientes
    cy.intercept('PUT', /\/api\/clientes\/\d+/, (req) => {
      const id = parseInt(req.url.split('/').pop(), 10);
      const idx = clientesState.findIndex(c => c.id === id);
      if (idx !== -1) {
        clientesState[idx] = { ...clientesState[idx], ...req.body };
        req.reply({ statusCode: 200, body: clientesState[idx] });
      } else {
        req.reply({ statusCode: 404 });
      }
    }).as('updateCliente');

    // DELETE clientes
    cy.intercept('DELETE', /\/api\/clientes\/\d+/, (req) => {
      const id = parseInt(req.url.split('/').pop(), 10);
      const idx = clientesState.findIndex(c => c.id === id);
      if (idx !== -1) {
        clientesState.splice(idx, 1);
        req.reply({ statusCode: 200, body: {} });
      } else {
        req.reply({ statusCode: 404 });
      }
    }).as('deleteCliente');
  });

  it('login, crear, editar y eliminar cliente', () => {
    // login via UI
    cy.visit('/login');
    cy.get('input[type="email"]').type(usuario.email);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');

    // ir a clientes
    cy.visit('/clientes');
    cy.wait('@getClientes');

    // abrir formulario crear
    cy.contains('Nuevo Cliente').click();

    // seleccionar usuario y rellenar campos
    cy.get('select[name="usuario_id"]').select('1');
    cy.get('input[name="documento_identidad"]').type('DOC-TEST-1');
    cy.get('input[name="direccion"]').type('Calle Test 123');
    cy.get('input[name="ciudad"]').type('Bogotá');

    // submit
    cy.contains('Guardar').click();
    cy.wait('@createCliente');

    // la lista se recarga: verificar que aparece el documento
    cy.wait('@getClientes');
    cy.contains('DOC-TEST-1').should('exist');

    // editar: click en el botón editar del primer registro
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').first().click();
    });

    // cambiar ciudad y guardar
    cy.get('input[name="ciudad"]').clear().type('Medellín');
    cy.contains('Guardar').click();
    cy.wait('@updateCliente');
    cy.wait('@getClientes');
    cy.contains('Medellín').should('exist');

    // eliminar
    cy.get('table tbody tr').first().within(() => {
      // click delete (second button)
      cy.get('button').eq(1).click();
    });
    // confirmar ventana
    cy.on('window:confirm', () => true);
    cy.wait('@deleteCliente');
    cy.wait('@getClientes');
    cy.contains('DOC-TEST-1').should('not.exist');
  });
});
