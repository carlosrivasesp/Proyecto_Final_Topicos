Proyecto Final Tópicos
Este proyecto es una aplicación web completa que consta de un Backend (servidor) y un Frontend (interfaz de usuario).
Estructura del Proyecto
El proyecto está organizado en dos directorios principales:
BACKEND/: Contiene la lógica del servidor, la API y la interacción con la base de datos.
FRONTEND/: Contiene la aplicación web desarrollada con Angular.
Requisitos Previos
Asegúrate de tener instalados los siguientes programas en tu sistema:
Node.js: Se recomienda la versión v18.x para compatibilidad con todas las dependencias. Puedes descargarlo desde nodejs.org.
npm (Node Package Manager): Viene incluido con Node.js.
Angular CLI: Necesario para desarrollar y ejecutar la aplicación Frontend. Si no lo tienes, instálalo globalmente:
npm install -g @angular/cli


Git: Para la gestión de versiones del código.
Configuración y Ejecución del Proyecto
Sigue estos pasos para poner en marcha tanto el Backend como el Frontend:
1. Backend
Navega al directorio del Backend:
cd BACKEND/


Instala las dependencias del Backend:
npm install

Dependencias clave del Backend:
pdf: Para la generación de documentos PDF.
whatsapp: Integración para el envío de mensajes (probablemente a través de un servicio como Twilio u otro proveedor de API de WhatsApp).
Google Cloud: Para servicios en la nube (ej. almacenamiento, funciones, etc.).
Twilio: (Mencionado como "el de whatsapp") Es un servicio de comunicación que puede ser utilizado para enviar mensajes de WhatsApp.
Inicia el servidor Backend:
npm run dev

El servidor se iniciará y estará escuchando en el puerto configurado (usualmente http://localhost:3000 o similar).
2. Frontend
Navega al directorio del Frontend:
cd FRONTEND/


Instala las dependencias del Frontend:
npm install


Inicia la aplicación Frontend:
ng serve --open

Esto compilará la aplicación y la abrirá automáticamente en tu navegador predeterminado (usualmente http://localhost:4200).
Pruebas Unitarias (Frontend)
Para ejecutar las pruebas unitarias del Frontend:
Asegúrate de estar en el directorio FRONTEND/.
Ejecuta el comando de pruebas:
ng test

Esto iniciará Karma (el corredor de pruebas) y ejecutará todas las pruebas unitarias definidas en tu proyecto Angular. Para ejecutar una prueba específica, puedes usar:
ng test --watch=false --include="src/app/components/venta/venta.component.spec.ts"

(Reemplaza la ruta con la del archivo .spec.ts que desees probar).
Gestión de Versiones (Git)
Para subir tus cambios al repositorio de Git:
Asegúrate de estar en el directorio raíz del proyecto (PROYECTO_FINAL_TOPICOS/).
Añade tus cambios al área de preparación:
git add .


Confirma tus cambios con un mensaje descriptivo:
git commit -m "Mensaje descriptivo de tus cambios"


Sube tus cambios al repositorio remoto:
git push


Ejecución de Archivos YAML (CI/CD o Configuración)
La ejecución de archivos .yml (YAML) generalmente está asociada con:
Configuraciones de CI/CD (Integración Continua/Despliegue Continuo): Si tienes un archivo como .github/workflows/main.yml o azure-pipelines.yml, estos son ejecutados automáticamente por plataformas como GitHub Actions, Azure DevOps, GitLab CI, etc., cuando se cumplen ciertas condiciones (ej. un git push a una rama específica). No se "corren" directamente desde la terminal como un script de Node.js.
Archivos de configuración de Docker Compose: Si tienes un docker-compose.yml, se ejecuta con docker-compose up.
Configuraciones de Kubernetes: Se aplican con kubectl apply -f archivo.yml.
Para poder decirte cómo correr tu archivo YAML, necesito saber para qué se utiliza (ej. CI/CD, Docker Compose, Kubernetes, etc.) y dónde está ubicado. Si es para CI/CD, no necesitas ejecutarlo manualmente; el sistema lo hará.
Espero que este README sea muy útil para ti y para cualquiera que necesite trabajar con tu proyecto. ¡Avísame si quieres añadir o modificar algo!
