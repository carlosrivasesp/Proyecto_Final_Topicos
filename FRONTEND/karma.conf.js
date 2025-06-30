// karma.conf.js

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      // NOTA: Ya no usamos el lanzador de Chrome por defecto
      // require('karma-chrome-launcher'), 
      
      // AÑADIDO: Registramos el lanzador de Puppeteer que instalaste
      require('karma-puppeteer-launcher'),

      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // Opciones de configuración de Jasmine aquí
      },
      clearContext: false // deja la salida del Spec Runner de Jasmine visible en el navegador
    },
    jasmineHtmlReporter: {
      suppressAll: true // elimina los rastros duplicados
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/frontend'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true, // Puedes ponerlo en false si solo usas --watch=false
    
    // CORRECCIÓN CLAVE: Le decimos a Karma que use Puppeteer en modo Headless
    browsers: ['PuppeteerHeadlessNoSandbox'],

    // AÑADIDO: Configuramos un lanzador personalizado para el entorno de nube
    customLaunchers: {
      PuppeteerHeadlessNoSandbox: {
        base: 'Puppeteer',
        flags: [
          '--no-sandbox', // ESENCIAL para entornos de contenedores/nube
          '--disable-gpu',
          '--disable-dev-shm-usage' // Ayuda a prevenir cuelgues en entornos con memoria limitada
        ]
      }
    },
    
    singleRun: false, // `ng test` lo controla con --watch=false
    restartOnFileChange: true
  });
};