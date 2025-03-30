const fs = require('fs');
const XLSX = require('xlsx');
const { google } = require('googleapis');
const { exec } = require('child_process');
const moment = require('moment');
const { spawn } = require('child_process');
const path = require('path');
const player = require('node-wav-player');

// 0 - Play notification sound
async function playWavFile(filePath) {
    try {
        await player.play({
            path: filePath,
            sync: false // Set to true if you want to wait until the sound finishes
        });
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

// 1 - Get week range
const today = moment();
const startDate = today.clone().startOf('isoWeek');
const endDate = today.clone().endOf('isoWeek');
const startDateSt = startDate.format('DD/MM');
const endDateSt = endDate.format('DD/MM');
const startTime = startDate.startOf('day').toDate();
const endTime = endDate.endOf('day').toDate();

// 2 - Read Excel File
async function readExcelFile() {
    const workbook = XLSX.readFile('files/nomer.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(1); // Remove headers
}

// 3 - Google Sheets Authentication
async function authorizeGoogleSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'files/service_account.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    return google.sheets({ version: 'v4', auth });
}

// 4 - Fetch Data from Google Sheets
async function fetchGoogleSheet(sheetId, sheetName) {
    const sheets = await authorizeGoogleSheets();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${sheetName}!A:B`, // Read columns A and B (time & ID)
    });
    const rows = response.data.values || [];
    return rows.map(row => ({ time: row[0], id: row[1] }));
}

const messageQueue = [];
let isProcessing = false;

// 5 - Send WhatsApp Message
async function sendWA(waNumber, msg) {
    return new Promise((resolve, reject) => {
        msgQueue.push({ waNumber, msg, resolve, reject });
        processQueue();
    });
}

async function processQueue() {
    if (isProcessing || msgQueue.length === 0) return;

    isProcessing = true;
    const { waNumber, msg, resolve, reject } = msgQueue.shift();

    try {
        console.log(`Sending msg to ${waNumber}: ${msg}`);
        
        await sendWA2(waNumber, msg);  // Replace with your sending function

        resolve(); // Mark as successful
    } catch (error) {
        console.error(`Failed to send msg: ${error}`);
        reject(error);
    } finally {
        isProcessing = false;
        processQueue(); // Process the next msg
    }
}

async function sendWA(waNumber, msg) {
    const jsFile = path.join(__dirname, 'index.js'); // Reference index.js in the same directory
    const jsPar = 'terminalbot';
    const escapedMsg = JSON.stringify(msg); 
    const child = spawn('node', [jsFile, jsPar, `["${waNumber}"]`, escapedMsg], {
        shell: true,
        stdio: 'inherit' // Inherit standard input/output for logs
    });

    child.on('error', (error) => {
        console.error(`Error sending WA: ${error.message}`);
    });

    child.on('exit', (code) => {
        if (code !== 0) {
            console.error(`sendWA process exited with code ${code}`);
        }
    });
}

// 6 - Process Reports
async function processReports() {
    // Read Excel File
    const data = await readExcelFile();

    // Fetch Google Sheets
    const sIdYaum = '1fFoRpucMi7OILz6E_53Ikv_XO4eVBkxi_Mo0cCgjmc0';
    const yaumiyanData = await fetchGoogleSheet(sIdYaum, 'Form Responses 1');
    const sIdGrup = '1KFXqxiyx3sN5oKBA08GW1ROPBtk7n3uFpiQPwEPhIXw';
    const grupData = await fetchGoogleSheet(sIdGrup, 'Form Responses 1'); // Adjust sheet name if different

    // Individual Reports
    for (const [id, waNumber] of data) {
        const hasSent = yaumiyanData.some(entry =>
            moment(entry.time, 'MM/DD/YYYY HH:mm:ss').isBetween(startTime, endTime) &&
            entry.id.toUpperCase() === id
        );

        const msg = hasSent
            ? `Siip 👍, kegiatan harian untuk periode ${startDateSt} - ${endDateSt} sudah dilaporkan.`
            : `Kegiatan harian ${id} untuk periode ${startDateSt} - ${endDateSt} belum dilaporkan.\n\nYuk lapor segera di s.id/5harian 🙏`;

        console.log(`${id} ${hasSent ? '✅' : '🔴'}`);
        sendWA(waNumber, msg);
    }

    // Group Reports
    const grups = data.filter(item => item[3] == 2).map(item => [item[1], item[2]]);
    for (const [waNumber, id] of grups) {
        const hasSent = grupData.some(entry =>
            moment(entry.time, 'MM/DD/YYYY HH:mm:ss').isBetween(startTime, endTime) &&
            entry.id.toUpperCase() === id
        );

        const msg = hasSent
            ? `Siip 👍, rapat ${id} untuk periode ${startDateSt} - ${endDateSt} sudah dilaporkan.`
            : `Rapat ${id} untuk periode ${startDateSt} - ${endDateSt} belum dilaporkan.\n\nYuk lapor segera di s.id/5bertemu 🙏`;

        console.log(`Grup ${id} ${hasSent ? '🍏' : '🍎'}`);
        sendWA(waNumber, msg);
    }
    
    playWavFile('files/notif.wav');
}

// Run the script
processReports().catch(console.error);
