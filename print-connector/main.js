const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocket = require('ws');
const printer = require('printer');

let mainWindow;
let ws;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: `${__dirname}/preload.js`,
        },
    });

    mainWindow.loadFile('index.html');

    // Establish WebSocket connection to backend
    const backendUrl = 'ws://localhost:3000';
    ws = new WebSocket(backendUrl);

    ws.on('open', () => {
        console.log('Connected to backend WebSocket');
        // Send available printers to backend
        const printers = printer.getPrinters();
        ws.send(JSON.stringify({ type: 'REGISTER_PRINTERS', printers }));
    });

    ws.on('message', (data) => {
        const message = JSON.parse(data);

        if (message.type === 'PRINT_JOB') {
            handlePrintJob(message.job);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed.');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Handle print jobs
function handlePrintJob(job) {
    console.log('Received print job:', job);

    printer.printDirect({
        data: Buffer.from(job.content, 'base64'),
        printer: job.printerName,
        type: job.type || 'RAW', // Default to RAW type for print
        success: () => {
            console.log(`Print job ${job.id} completed.`);
            ws.send(JSON.stringify({ type: 'JOB_COMPLETE', jobId: job.id }));
        },
        error: (err) => {
            console.error(`Print job ${job.id} failed:`, err);
            ws.send(JSON.stringify({ type: 'JOB_FAILED', jobId: job.id, error: err.message }));
        },
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
