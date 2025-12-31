import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code generated! Please scan it with your WhatsApp.');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    if (message.body.toLowerCase() === 'ping') {
        await message.reply('pong');
    } else {
        // Simple auto-response for testing
        await message.reply('Olá! Esta é uma resposta automática do sistema ZapPreserve. Em breve entraremos em contato.');
    }
});

client.initialize();
