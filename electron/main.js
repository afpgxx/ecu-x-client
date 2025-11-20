const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Helper to check if we are in dev mode (running via npm run dev)
const isDev = !app.isPackaged;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    backgroundColor: '#1a1d21',
    frame: false, // Frameless window for custom UI
    webPreferences: {
      nodeIntegration: true, // Required for window.require('electron') in Renderer
      contextIsolation: false, // Simplified for this demo
      webSecurity: false // Allow loading local resources if needed
    },
  });

  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools automatically in dev mode
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // In production, load the built index.html
    // Adjusted path since main.js is in electron/ folder
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
};

// This method will be called when Electron has finished initialization
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// --- IPC Handlers ---
ipcMain.on('window-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  }
});

ipcMain.on('window-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});
