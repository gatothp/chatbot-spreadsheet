// to run notification from nodejs script
const { spawn } = require('child_process');
const path = require('path');
const waNumber = [6285294033154];
const msg = 'Assalamualaikum talent-5 🙏,\n\nsaya app utk notifikasi amalan harian dan pekanan. mohon:\n1. simpan nomer ini sbg \"Notif Imani\" dalam contact agar tak terdeteksi sbg spam.\n2. utk konfirmasi pesan terkirim dgn tepat, reply dgn mengetik ID antum\n\nutk jelasnya, bisa kontak walas-5 nya.\n\n😊 PHG01';

// Send WhatsApp Message
async function sendWA(waNumber, msg) {
    const jsFile = path.join(__dirname, 'index.js'); // Reference index.js in the same directory
    const jsPar = 'terminalbot';
    const escapedMsg = JSON.stringify(msg); 

    return new Promise((resolve, reject) => {
        const child = spawn('node', [jsFile, jsPar, `["${waNumber}"]`, escapedMsg], {
            shell: true,
            stdio: 'inherit' // Inherit standard input/output for logs
        });

        child.on('error', (error) => {
            console.error(`Error sending WA: ${error.message}`);
            reject(error);
        });

        child.on('exit', (code) => {
            if (code !== 0) {
                console.error(`sendWA process exited with code ${code}`);
                reject(new Error(`sendWA process exited with code ${code}`));
            } else {
                resolve();
            }
        });
    });
}

sendWA(waNumber, msg).catch(console.error);
