import { app, BrowserWindow, ipcMain, Tray } from "electron";
import * as moment from "moment";
import * as path from "path";
import { Configuration } from "./configuration";

let window: BrowserWindow;
let tray: Tray;
let intervalHandler: NodeJS.Timer;
let config = new Configuration();

console.log(process.execPath)
console.log(process.platform)


function createTray(): void {
    tray = new Tray(path.join(__dirname, '..', 'assets', 'clock.png'))
    tray.setTitle(moment().format(config.dateformat))
    tray.on('right-click', toggleWindow)
    tray.on('double-click', toggleWindow)
    tray.on('click', function (event) {
        toggleWindow()
    })
}

function getWindowPosition(): {x: number, y: number} {
    const windowBounds = window.getBounds();
    const trayBounds = tray.getBounds();
    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4);

    return { x, y };
}

function createWindow(): void {
    window = new BrowserWindow({
        width: 360,
        height: 250,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            // Prevents renderer process code from not running when window is
            // hidden
            backgroundThrottling: false
        }
    });

    window.loadURL(`file://${path.join(__dirname, 'index.html')}`);
  
    // Hide the window when it loses focus
    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide();
        }
    });
}
  
function toggleWindow(): void {
    if (window.isVisible()) {
        window.hide();
    } else {
        showWindow();
    }
}

function showWindow(): void {
    const position = getWindowPosition();
    window.setPosition(position.x, position.y, false);
    window.show();
    window.focus();
}

function createInterval(): void {
    deleteInterval();
    intervalHandler = setInterval(() => {
        tray.setTitle(moment().format(config.dateformat))
    }, 1000);
}

function deleteInterval(): void {
    if (intervalHandler) {
        clearInterval(intervalHandler);
        intervalHandler = null;
    }
}

if (app.dock) {
//   app.dock.hide();
}

app.on("ready", () => {
    createTray();
    createWindow();
    createInterval();
});

app.on('window-all-closed', () => {
    deleteInterval();
    app.quit();
});

ipcMain.on('show-window', () => {
    showWindow();
});

ipcMain.on('reload-window', () => {
    window.reload();
});

ipcMain.on('run-startup', (value: boolean) => {
    const exeName = path.basename(process.execPath);
    app.setLoginItemSettings({
        openAtLogin: value,
        path: process.execPath,
        args: [
        '--processStart', "${exeName}",
        '--process-start-args', "--hidden"
        ]
    });
});