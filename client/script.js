// Populate Printer Dropdown
const clientId ="1ol8GZSwBE2ETFZFAAAB"

document.addEventListener('DOMContentLoaded', async () => {
    const printerDropdown = document.getElementById('printerDropdown');
    try {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'x-client-id': clientId
        });

        const response = await fetch('http://localhost:3000/printers', { headers });

        if (response.ok) {
            const printers = await response.json();
            printers.forEach(printer => {
                const option = document.createElement('option');
                option.value = printer.name;
                option.textContent = printer.name;
                printerDropdown.appendChild(option);
            });
        } else {
            console.error('Failed to load printers:', response.statusText);
            alert('Failed to load printers');
        }
    } catch (error) {
        console.error('Error loading printers:', error);
        alert('Error loading printers');
    }
});

// Handle Print Job Submission
document.getElementById('printJobForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('file');
    const settings = document.getElementById('settings').value;
    const printerName = document.getElementById('printerDropdown').value;

    if (!fileInput.files.length || !printerName) {
        alert('Please select a file and a printer.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('settings', settings);
    formData.append('printerName', printerName);

    try {
        const response = await fetch('http://localhost:3000/jobs/submit', {
            method: 'POST',
            body: formData,
            headers: {
                'x-client-id': clientId
            }
        });

        if (response.ok) {
            alert('Print job submitted successfully!');
        } else {
            const result = await response.json();
            alert(result.message || 'Failed to submit print job.');
        }
    } catch (error) {
        console.error('Error submitting print job:', error);
        alert('Error submitting print job.');
    }
});

// Handle Printer Registration
document.getElementById('registerPrinterForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const printerName = document.getElementById('printerName').value;
    const printerType = document.getElementById('printerType').value;
    const connectionDetail = document.getElementById('connectionDetail').value;

    if (!printerName || !printerType || !connectionDetail) {
        alert('Please fill out all fields.');
        return;
    }

    const printerData = {
        name: printerName,
        connectionType: printerType,
        connectionDetail
    };

    try {
        const response = await fetch('http://localhost:3000/printers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': clientId
            },
            body: JSON.stringify(printerData)
        });

        if (response.ok) {
            alert('Printer registered successfully!');
        } else {
            const result = await response.json();
            alert(result.message || 'Failed to register printer.');
        }
    } catch (error) {
        console.error('Error registering printer:', error);
        alert('Error registering printer.');
    }
});

// Update UI based on Printer Type
document.getElementById('printerType').addEventListener('change', (e) => {
    const type = e.target.value;
    const connectionDetailLabel = document.querySelector('label[for="connectionDetail"]');
    const connectionDetailInput = document.getElementById('connectionDetail');

    if (type === 'usb') {
        connectionDetailLabel.textContent = 'USB Port:';
        connectionDetailInput.placeholder = 'Enter USB Port (e.g., COM3)';
    } else {
        connectionDetailLabel.textContent = 'IP Address:';
        connectionDetailInput.placeholder = 'Enter Printer IP Address';
    }
});
