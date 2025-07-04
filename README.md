# Proyecto FerreTechSC
Este repositorio contiene una aplicación web desarrollada con el stack **MEAN (MongoDB, Express, Angular y Node.js)**. El sistema está integrado con servicios externos como **Google Drive**, **Twilio WhatsApp**, y **Zapier**, y cuenta con un pipeline de **Integración Continua (CI)** a través de **GitHub Actions**.

## 🚀 Funcionalidades principales

- Registro y gestión de comprobantes en PDF
- Envío de comprobantes vía WhatsApp usando Twilio
- Subida de comprobantes a una carpeta en Google Drive
- Registro automático en Google Sheets vía Zapier para comprobantes enviados por WhatsApp
- Pruebas unitarias en Angular
- Automatización con GitHub Actions (CI)
- Despliegue continuo del backend y/o frontend (CD)

## FRONTEND
Desarrollado con Angular
1. Redirigir a la carpeta FRONTEND con el comando *cd FRONTEND*
2. Instalar dependecias con el comando *npm install*
3. Instalar angular con el comando *npm install -g @angular/cli* (Opcional)
4. Ejecutar el programa en el puerto 4200 con el comando *ng serve --o*
### Pruebas unitarias
1. Se realizaron pruebas unitarias a algunos de los componentes más importantes del sistema:
   - Ventas
   - Cotizaciones
   - Compras
   - Listado de Comprobantes
   - Entregas
   - Ingresos
   - Salidas.
2. Ejecutamos las pruebas unitarias con el comando *ng test*
3. Se podrá visualizar únicamente las pruebas seleccionadas con el código *fit* en Chrome y también el LOG en la terminal.

## BACKEND
Desarrollado con NodeJS y Express.
1. Redirigir a la carpeta BACKEND con el comando *cd BACKEND*
2. Instalar dependecias con el comando *npm install*
3. Instalar librerías de pdf con el comando *npm install pdfkit moment* y *npm install moment*
4. Instalar **fs** y **path** con los comandos *npm install fs* y *npm install path* (Opcional)
5. Instalar dependencias para interactuar con WhatsApp con el comando *npm install twilio*
6. Instalar dependencias para interactuar con Google Drive con el comando *npm install googleapis google-auth-library*
7. Ejecutar el programa en el puerto 4000 con el comando *npm run dev*
8. Es necesario ingresar las variables de entorno a un archivo .env para que se pueda ejecutar el programa.
9. Asimismo es necesario ingresar el archivo credentials.json, obtenido de Google Cloud.

## Integración Continua (CI)

### ¿Cuándo se ejecuta este workflow?

El pipeline se ejecuta automáticamente cuando:
- Se hace un `push` a la rama `main`
- Se abre o actualiza un `pull request` a la rama `main`

### Pasos que realiza el workflow

| Paso                         | Descripción                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| **Checkout del código**      | Clona el repositorio para usarlo en el runner (maquina virtual)            |
| **Configurar Node.js**       | Usa NodeJS v20 como entorno de ejecución                                  |
| **Instalar Angular**         | Instala dependencias en `FRONTEND/` usando `npm ci`                        |
| **Test Angular**             | Ejecuta pruebas unitarias de Angular con Karma y ChromeHeadless            |
| **Instalar Backend**         | Instala dependencias en `BACKEND/` usando `npm ci`                         |
| **Subir PDF a Drive**        | Usa `utils/driveUploader.js` para subir un comprobante a Google Drive      |
| **Notificar a Zapier**       | Envia un POST con datos del comprobante a un webhook de Zapier             |
| **Enviar mensaje por WhatsApp** | Ejecuta `utils/enviarWsp.js` para mandar el comprobante vía Twilio WhatsApp |

---

## 🔐 Secrets requeridos

Para que el pipeline funcione correctamente, debes configurar los siguientes **Secrets** en GitHub Actions:

| Secret                  | Descripción                                               |
|-------------------------|-----------------------------------------------------------|
| `DRIVE_FOLDER_ID`       | ID de la carpeta de Google Drive para subir PDFs         |
| `ZAPIER_WEBHOOK_URL`    | URL del webhook de Zapier para registrar el comprobante  |
| `ACC_SSID`              | SID de tu cuenta de Twilio (WhatsApp API)                |
| `AUTH_TOKEN`            | Token de autenticación de Twilio                         |

Para agregarlos:

1. Ve a tu repositorio → `Settings` → `Secrets and variables` → `Actions`
2. Haz clic en `New repository secret` y agrega cada uno con su valor correspondiente.


## Otros pasos
1. Es necesario enviar el mensaje *join establish-zulu* al número de Twilio +1 (415) 523-8886 para poder recibir el comprobante.
