const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),

  // Serial Port
  listPorts: () => ipcRenderer.invoke('serial-list'),
  openPort: (path, baudRate) => ipcRenderer.invoke('serial-open', path, baudRate),
  closePort: () => ipcRenderer.invoke('serial-close'),
  writeSerial: (data) => ipcRenderer.invoke('serial-write', data),

  // Events
  onSerialData: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('serial-data', subscription);
    // Return a cleanup function
    return () => ipcRenderer.removeListener('serial-data', subscription);
  },
  onWindowStateChange: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('window-state-change', subscription);
    // Return a cleanup function
    return () => ipcRenderer.removeListener('window-state-change', subscription);
  }
});
