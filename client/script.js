// Handle Print Job Submission
document.getElementById('printJobForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('file');
    const settings = document.getElementById('settings').value;

    if (!fileInput.files.length) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('settings', settings);

    try {
        const response = await fetch('/submit-job', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Print job submitted successfully!');
        } else {
            alert('Failed to submit print job.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting print job.');
    }
});

// Handle Printer Registration
document.getElementById('registerPrinterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const printerName = document.getElementById('printerName').value;
    const printerType = document.getElementById('printerType').value;
    const connectionDetail = document.getElementById('connectionDetail').value;

    const printerData = {
        printerName,
        printerType,
        connectionDetail,
    };

    try {
        const response = await fetch('/register-printer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(printerData),
        });

        if (response.ok) {
            alert('Printer registered successfully!');
        } else {
            alert('Failed to register printer.');
        }
    } catch (error) {
        console.error('Error:', error);
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
