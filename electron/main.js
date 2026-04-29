const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const EXPRESS_PORT = 5000;
const NEXT_PORT    = 3000;
const isDev        = !app.isPackaged;

let mainWindow;
let expressProcess;
let nextProcess;

// ─── Utility: wait until a port is accepting connections ────────────────────
function waitForPort(port, retries = 30, delay = 500) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const check = () => {
            const req = http.get(`http://localhost:${port}`, () => resolve());
            req.on('error', () => {
                if (++attempts >= retries) {
                    reject(new Error(`Port ${port} never became ready`));
                } else {
                    setTimeout(check, delay);
                }
            });
            req.end();
        };
        check();
    });
}

// ─── Start Express API Server ───────────────────────────────────────────────
function startExpressServer() {
    const serverPath = path.join(__dirname, '..', 'server', 'index.js');

    // Tell the server where to store the database file
    const appDataPath = app.getPath('userData');

    expressProcess = spawn('node', [serverPath], {
        env: {
            ...process.env,
            PORT: EXPRESS_PORT,
            NODE_ENV: 'production',
            ELECTRON_APP_DATA: appDataPath,
        },
        // Show Express output in the terminal (helpful for debugging)
        stdio: 'inherit',
    });

    expressProcess.on('error', (err) => {
        dialog.showErrorBox('Backend Error', `Failed to start API server:\n${err.message}`);
    });
}

// ─── Start Next.js Server ───────────────────────────────────────────────────
function startNextServer() {
    // In dev: use `next dev`. In production: use the standalone server.
    if (isDev) {
        // use local npm path / npx
        nextProcess = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'dev', '--port', NEXT_PORT], {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit',
            shell: true
        });
    } else {
        const serverJs = path.join(process.resourcesPath, 'next-standalone', 'server.js');
        nextProcess = spawn('node', [serverJs], {
            env: {
                ...process.env,
                PORT: NEXT_PORT,
                HOSTNAME: '127.0.0.1',
            },
            stdio: 'inherit',
        });
    }

    nextProcess.on('error', (err) => {
        dialog.showErrorBox('Frontend Error', `Failed to start Next.js:\n${err.message}`);
    });
}

// ─── Create the Browser Window ──────────────────────────────────────────────
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 600,
        title: 'Church Management System',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        // Show a loading screen while servers start up
        show: false,
    });

    // Show window only when ready to avoid blank flicker
    mainWindow.once('ready-to-show', () => mainWindow.show());

    mainWindow.loadURL(`http://localhost:${NEXT_PORT}`);

    // Remove the default menu bar
    mainWindow.setMenuBarVisibility(false);

    mainWindow.on('closed', () => { mainWindow = null; });
}

// ─── App Lifecycle ──────────────────────────────────────────────────────────
app.whenReady().then(async () => {
    // Initialize DB on first run
    const { initDB } = require('../server/init_db.js');
    const dbFile = path.join(app.getPath('userData'), 'cms.db');

    if (!fs.existsSync(dbFile)) {
        console.log('First run detected — initializing database...');
        try {
           process.env.ELECTRON_APP_DATA = app.getPath('userData');
           await initDB(); 
        } catch (err) {
           dialog.showErrorBox('Database Error', `Failed to initialize the database:\n${err.message}`);
           app.quit();
           return;
        }
    }

    // Only start background servers if NOT in development or if explicitly asked
    const shouldSpawn = !isDev || process.argv.includes('--spawn-servers');

    if (shouldSpawn) {
        startExpressServer();
        startNextServer();
    }

    try {
        console.log('Waiting for servers to start...');
        // Wait for both servers to be ready before opening the window
        await Promise.all([
            waitForPort(EXPRESS_PORT),
            waitForPort(NEXT_PORT),
        ]);
        console.log('Both servers ready. Opening window.');
        createWindow();
    } catch (err) {
        dialog.showErrorBox(
            'Startup Error',
            'The application servers failed to start.\n\n' + err.message
        );
        app.quit();
    }
});

app.on('window-all-closed', () => {
    // Kill background servers on exit
    if (expressProcess) expressProcess.kill();
    if (nextProcess)    nextProcess.kill();
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
