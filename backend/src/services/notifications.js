/**
 * src/services/notifications.js
 */

const axios = require('axios');

async function sendExpoNotification(expoPushToken, title, body, data={}) {
  try {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
    };
    await axios.post('https://exp.host/--/api/v2/push/send', message, {
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
    });
    console.log('Notificação enviada com sucesso (', body, ') ');
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    throw error;    
  }
};

module.exports = { sendExpoNotification };
