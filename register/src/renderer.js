document.addEventListener('DOMContentLoaded', () => {

    window.ipcRenderer.on('setWsUrl', (event, wsUrl) => {

        const socket = window.webSocket.connect(wsUrl);

        window.addEventListener('message', (event) => {
            if (event.data.type === 'connected') {
                document.getElementById('status').textContent = 'Connected to WebSocket server'
                document.getElementById('clientId').textContent = event.data.clientId;
                console.log(event.data)
            } else if (event.data.type === 'printJob') {
                const jobDiv = document.createElement('div');
                jobDiv.textContent = `Print Job: ${JSON.stringify(event.data.data)}`;
                document.getElementById('received_jobs').appendChild(jobDiv);
            }
        });

        window.electronAPI.registerPrinter('Printer-001')

    });

    // Example: Register a printer when the page loads
    // In our scenario
    // Need to get all printers connected to the client using `printer module` and sent to backend. 
    window.ipcRenderer.on('printerRegistrationResponse', (event, response) => {
        document.getElementById('message').textContent = response;
    });
});