document.getElementById('refreshPrinters').addEventListener('click', async () => {
    const printers = await window.electronAPI.getPrinters();
    const printerList = document.getElementById('printerList');
    printerList.innerHTML = printers.map((printer) => `<li>${printer.name}</li>`).join('');
});

document.getElementById('registerPrinters').addEventListener('click', () => {
    const printers = document.querySelectorAll('#printerList li');
    const printerNames = Array.from(printers).map((li) => li.textContent);

    window.electronAPI.sendToBackend({
        type: 'REGISTER_PRINTERS',
        printers: printerNames,
    });
});
