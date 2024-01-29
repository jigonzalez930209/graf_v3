import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { autoUpdater } from 'electron-updater'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/graph-icon.png?asset'
import { ReadFilesFromPath, SaveExcelFile, SaveProject, SaveTemplate } from '@shared/types'
import { getFiles, getGrafState, getTemplates, saveProject } from './lib'
import { saveTemplate } from './lib/template'
import {
  getBinaryFiles,
  importFilesFromLoader,
  readFilesFromPath,
  saveExcelFile
} from './lib/files'

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    modal: true,
    skipTaskbar: false,
    ...(process.platform === 'linux'
      ? { icon }
      : { icon: join(__dirname, '../../resources/graph-icon.png') }),
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 40
    },
    trafficLightPosition: { x: 10, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools({
      mode: 'right',
      activate: false,
      title: 'DevTools Graf_v3'
    })
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Get files from current path in main process.
  ipcMain.handle('getFiles', () => getFiles())
  ipcMain.handle('getGrafState', () => getGrafState())
  ipcMain.handle('getTemplates', () => getTemplates())
  ipcMain.handle('getBinaryFiles', () => getBinaryFiles())

  // Saver files to current path from renderer process.
  ipcMain.handle('saveGrafState', (_, ...args: Parameters<SaveProject>) => saveProject(...args))
  ipcMain.handle('saveTemplates', (_, ...args: Parameters<SaveTemplate>) => saveTemplate(...args))
  ipcMain.handle('saveExcelFile', (_, ...args: Parameters<SaveExcelFile>) => saveExcelFile(...args))

  // Read files from path in main process.
  ipcMain.handle('readFilesFromPath', (_, ...args: Parameters<ReadFilesFromPath>) =>
    readFilesFromPath(...args)
  )

  // Import files from loader in main process.
  ipcMain.handle('importFilesFromLoader', () => importFilesFromLoader())

  ipcMain.handle('openDevTools', () =>
    BrowserWindow.getAllWindows()?.[0]?.webContents.openDevTools({
      mode: 'right',
      activate: true,
      title: 'DevTools Graf_v3'
    })
  )

  ipcMain.handle('getAppName', () => app.name)
  ipcMain.handle('getAppInfo', () => ({
    name: app.name,
    version: app.getVersion(),
    arc: process.arch,
    electronVersion: process.versions.electron
  }))

  ipcMain.handle('onLoadFileInfo', () => {
    return process.argv[1]
  })

  ipcMain.handle('checkUpdates', async () => {
    const result = await autoUpdater.checkForUpdates()
    const version = app.getVersion()
    if (result?.updateInfo?.version === version) {
      return undefined
    }
    return result?.updateInfo
  })
  ipcMain.handle('quitAndInstall', () => {
    autoUpdater.quitAndInstall(true, true)
  })
  ipcMain.handle('downloadUpdate', async () => {
    autoUpdater.signals.progress((p) => {
      BrowserWindow.getAllWindows()?.[0].setProgressBar(p.percent / 100, { mode: 'normal' })
    })
    const result = await autoUpdater.downloadUpdate()
    return result
  })

  ipcMain.handle('quit', () => {
    app.quit()
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
