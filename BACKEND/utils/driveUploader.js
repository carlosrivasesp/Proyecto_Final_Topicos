const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const KEYFILEPATH = path.join(__dirname, '../config/credentials.json'); // Ajusta la ruta
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const driveService = google.drive({ version: 'v3', auth });

const uploadFileToDrive = async (filePath, fileName, folderId) => {
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(filePath),
  };

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, webViewLink, webContentLink',
  });

  const fileId = response.data.id;

  // Hacer el archivo público
  await driveService.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return {
    id: fileId,
    webViewLink: response.data.webViewLink, // para abrir en navegador
    webContentLink: response.data.webContentLink, // para descarga directa
  };
};

module.exports = uploadFileToDrive;
