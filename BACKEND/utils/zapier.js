// utils/zapier.js
const axios = require('axios');
require('dotenv').config();


const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL

const enviarComprobanteZapier = async (datos) => {
  try {
    await axios.post(ZAPIER_WEBHOOK_URL, datos);
    console.log('✅ Comprobante enviado a Zapier');
  } catch (error) {
    console.error('❌ Error al enviar a Zapier:', error.message);
  }
};

module.exports = { enviarComprobanteZapier };
