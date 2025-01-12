let wsUrl = null;
let isConnected = false;
let isLoggedIn = false;

document.addEventListener('DOMContentLoaded', () => {

    window.ipcRenderer.on('setWsUrl', (event, url) => {
        wsUrl = url;
        setClientId();
    });

    window.ipcRenderer.on('setAuthToken', (event, authToken) => {
        console.log(authToken);
        setClientId(authToken);
    });

    window.ipcRenderer.on('printerRegistrationResponse', (event, response) => {
        document.getElementById('message').textContent = response;
    });

    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const authForm = document.getElementById('auth-form');
    const authError = document.getElementById('auth-error');

    // Check if user is authenticated
    const checkAuthentication = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            isLoggedIn = true;
            showMainApp();
        } else {
            showAuthScreen();
        }
    };

    // Show login/signup screen
    const showAuthScreen = () => {
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
        setClientId();
    };

    // Show main app
    const showMainApp = () => {
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
    };

    // Handle login/signup form submission
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.type === 'success') {
                localStorage.setItem('authToken', data.data.access_token); // Save token securely
                localStorage.setItem('refreshToken', data.data.refresh_token); // Save token securely
                isLoggedIn = true;
                setClientId();
                showMainApp();
            } else {
                throw new Error(data.message || 'Authentication failed');
            }
        } catch (error) {
            authError.textContent = error.message;
            authError.classList.remove('hidden');
        }
    });

    checkAuthentication();

    function setClientId(token) {

        if (token) {
            localStorage.setItem('authToken', token);
            isLoggedIn = true;
            authContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
        }

        if (isConnected) return;
        if (!isLoggedIn) return;

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return;
        }

        const socket = window.webSocket.connect(wsUrl, authToken);

        window.addEventListener('message', (event) => {
            if (event.data.type === 'connected') {
                document.getElementById('status').textContent = 'Connected to WebSocket server'
                document.getElementById('clientId').textContent = event.data.clientId;
                isConnected = true;
                window.electronAPI.registerPrinter({
                    name: 'Printer-001',
                    connectionType: 'usb',
                    connectionDetail: 'COM3',
                })
            } else if (event.data.type === 'printJob') {
                const jobDiv = document.createElement('div');
                jobDiv.textContent = `Print Job: ${JSON.stringify(event.data.data)}`;
                document.getElementById('received_jobs').appendChild(jobDiv);
            }
        });
    }

});


// Handler for the link click
document.getElementById('downloadAgent').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default anchor link behavior
    const url = event.target.href;

    // Open the URL in the default browser
    window.electronShell.openExternal(url);
});

