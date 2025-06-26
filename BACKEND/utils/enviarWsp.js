const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.ACC_SSID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const enviarPorWhatsapp = async (telefono, mensaje, mediaUrl) => {
  try {
    const messageData = {
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${telefono}`,
      body: `${mensaje}\n📄 Puedes ver el comprobante aquí: ${mediaUrl}`,
    };

    const message = await client.messages.create(messageData);

    console.log('Mensaje enviado. SID:', message.sid);
    console.log('Estado:', message.status);

    return message;
  } catch (error) {
    console.error('Error enviando WhatsApp:', error);
    throw error;
  }
};


module.exports = enviarPorWhatsapp;
