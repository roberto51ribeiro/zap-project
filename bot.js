import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

// Initialize WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

// Initialize Express App
const app = express();
const port = 3000;
app.use(bodyParser.json());

// N8N Webhook URL (Running on same server)
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/whatsapp';

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code generated! Please scan it with your WhatsApp.');
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

// Forward incoming messages to n8n
client.on('message', async (message) => {
    console.log(`Received message from ${message.from}: ${message.body}`);
    try {
        await axios.post(N8N_WEBHOOK_URL, {
            from: message.from,
            body: message.body,
            timestamp: message.timestamp,
            notifyName: message._data.notifyName
        });
        console.log('Message forwarded to n8n');
    } catch (error) {
        console.error('Error forwarding to n8n:', error.message);
    }
});

// Endpoint for n8n to send messages
app.post('/send-message', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: 'Missing phone or message' });
    }

    try {
        const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;
        await client.sendMessage(chatId, message);
        console.log(`Sent message to ${chatId}: ${message}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Start services
client.initialize();
app.listen(port, () => {
    console.log(`Bot bridge listening on port ${port}`);
});
