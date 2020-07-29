import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null;

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // #if development
  window.loadURL(process.env.entry!);
  window.webContents.openDevTools();
  // #else
  window.loadURL(`file://${__dirname}/index.html`);
  // #endif

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// create main BrowserWindow when electron is ready
app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createWindow();
});
