// karma.conf.js
const path = require('path');

module.exports = function (config) {
  config.set({
    // ... (todo el código anterior de karma.conf.js) ...

    // ******** ESTO ES LO QUE LIMITA QUÉ ARCHIVOS SE EJECUTAN ********
    files: [
      { pattern: './src/app/app.component.spec.ts', watched: true },
      { pattern: './src/app/components/entregas/entregas.component.spec.ts', watched: true },
      { pattern: './src/app/components/venta/venta.component.spec.ts', watched: true }
    ],
    // ***************************************************************

    // ******** PREPROCESADORES: CRÍTICO para compilar TypeScript ********
    // Le dice a Karma cómo procesar los archivos antes de cargarlos.
    // Aquí le decimos que todos los archivos .ts deben ser compilados por el plugin de Angular.
    preprocessors: {
      '**/*.ts': ['@angular-devkit/build-angular'] // Esto es genérico para todos los .ts que Karma cargue
    }
    // *****************************************************************
  });
};