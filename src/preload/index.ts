import { contextBridge } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow constructor options')
}

try {
  process.once('loaded', () => {
    window.process = process
  })

  contextBridge.exposeInMainWorld('context', {
    locale: 'es-AR',
    getFiles: async () => {
      const { ipcRenderer } = require('electron')
      const files = await ipcRenderer.invoke('getFiles')
      return files
    },
    getGrafState: async () => {
      const { ipcRenderer } = require('electron')
      const grafState = await ipcRenderer.invoke('getGrafState')
      return grafState
    },
    getTemplates: async () => {
      const { ipcRenderer } = require('electron')
      const templates = await ipcRenderer.invoke('getTemplates')
      return templates
    },
    getBinaryFiles: async () => {
      const { ipcRenderer } = require('electron')
      const binaryFiles = await ipcRenderer.invoke('getBinaryFiles')
      return binaryFiles
    },

    saveProject: async (state: string) => {
      const { ipcRenderer } = require('electron')
      const notification = await ipcRenderer.invoke('saveGrafState', state)
      return notification
    },
    saveTemplate: async (templates: string) => {
      const { ipcRenderer } = require('electron')
      const notification = await ipcRenderer.invoke('saveTemplates', templates)
      return notification
    },
    saveExcelFile: async (fileName: string, content: Blob) => {
      const { ipcRenderer } = require('electron')
      const arrayBuffer = await content.arrayBuffer()
      const notification = await ipcRenderer.invoke('saveExcelFile', fileName, arrayBuffer)
      return notification
    },

    readFilesFromPath: async (path: string[]) => {
      const { ipcRenderer } = require('electron')
      const files = await ipcRenderer.invoke('readFilesFromPath', path)
      return files
    },

    importFilesFromLoader: async () => {
      const { ipcRenderer } = require('electron')
      const files = await ipcRenderer.invoke('importFilesFromLoader')
      return files
    },

    onLoadFileInfo: async () => {
      const { ipcRenderer } = require('electron')
      const fileInfo = await ipcRenderer.invoke('onLoadFileInfo')
      return fileInfo
    },
    openDevTools: async () => {
      const { ipcRenderer } = require('electron')
      await ipcRenderer.invoke('openDevTools')
    },

    getAppName: async () => {
      const { ipcRenderer } = require('electron')
      const appName = await ipcRenderer.invoke('getAppName')
      return appName
    },

    getAppInfo: async () => {
      const { ipcRenderer } = require('electron')
      const appInfo = await ipcRenderer.invoke('getAppInfo')
      return appInfo
    },
    checkUpdates: async () => {
      const { ipcRenderer } = require('electron')
      return await ipcRenderer.invoke('checkUpdates')
    },
    quitAndInstall: async () => {
      const { ipcRenderer } = require('electron')
      return await ipcRenderer.invoke('quitAndInstall')
    },
    downloadUpdate: async () => {
      const { ipcRenderer } = require('electron')
      return await ipcRenderer.invoke('downloadUpdate')
    },
    quit: () => {
      const { ipcRenderer } = require('electron')
      ipcRenderer.invoke('quit')
    }
  })
} catch (e) {
  console.error(e)
}
