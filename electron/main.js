const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const communicationManager = require('./services/CommunicationManager');
const SerialService = require('./services/SerialService');

// Initialize Communication Manager with Serial Strategy
const serialStrategy = new SerialService();
communicationManager.setStrategy(serialStrategy);

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
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Allow loading local resources if needed
    },
  });

  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools automatically in dev mode (commented out)
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
    
    // 创建一个简单的菜单来支持 F12 和 Ctrl+R
    const template = [
      {
        label: 'View',
        submenu: [
          {
            label: 'Toggle Developer Tools',
            accelerator: 'F12',
            click: () => {
              mainWindow.webContents.toggleDevTools();
            }
          },
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
              mainWindow.reload();
            }
          }
        ]
      }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    // In production, load the built index.html
    // Adjusted path since main.js is in electron/ folder
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Send window state events to renderer
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-state-change', 'maximized');
  });
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-state-change', 'normal');
  });
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

// --- Serial Port Logic (via CommunicationManager) ---

// 1. List ports
ipcMain.handle('serial-list', async () => {
  return await communicationManager.listPorts();
});

// 2. Open port
ipcMain.handle('serial-open', async (event, path, baudRate = 115200) => {
  return await communicationManager.connect(path, baudRate);
});

// 3. Close port
ipcMain.handle('serial-close', async () => {
  return await communicationManager.disconnect();
});

// 4. Write data
ipcMain.handle('serial-write', async (event, data) => {
  return await communicationManager.send(data);
});

// Listen for data from CommunicationManager and forward to Renderer
communicationManager.on('data', (data) => {
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) {
    windows[0].webContents.send('serial-data', data);
  }
});
