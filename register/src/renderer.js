document.addEventListener('DOMContentLoaded', () => {
    // Connect to the WebSocket server
    const socket = window.webSocket.connect('http://localhost:3000');

    // Listen for messages posted from the preload script
    window.addEventListener('message', (event) => {
        if (event.data.type === 'connected') {
            // Display the client ID in the DOM
            document.getElementById('status').textContent = 'Connected to WebSocket server'
            document.getElementById('clientId').textContent = event.data.clientId;
            console.log(event.data)
        } else if (event.data.type === 'printJob') {
            // Append received print job to the DOM
            const jobDiv = document.createElement('div');
            jobDiv.textContent = `Print Job: ${JSON.stringify(event.data.data)}`;
            document.getElementById('received_jobs').appendChild(jobDiv);
        }
    });

    // Example: Register a printer when the page loads
    window.electronAPI.registerPrinter('Printer-001')

    window.ipcRenderer.on('printerRegistrationResponse', (event, response) => {
        document.getElementById('message').textContent = response;
    });
});