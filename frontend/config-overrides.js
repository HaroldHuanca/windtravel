module.exports = function override(config, env) {
  // Modificar la configuración de HtmlWebpackPlugin
  const htmlWebpackPlugin = config.plugins.find(
    plugin => plugin.constructor.name === 'HtmlWebpackPlugin'
  );

  if (htmlWebpackPlugin) {
    htmlWebpackPlugin.options.templateContent = () => `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="TravelCRM - Sistema de gestión de paquetes turísticos" />
          <title>TravelCRM</title>
        </head>
        <body>
          <noscript>Necesitas habilitar JavaScript para ejecutar esta aplicación.</noscript>
          <div id="root"></div>
        </body>
      </html>
    `;
  }

  return config;
};
