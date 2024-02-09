import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow constructor options')
}

try {
  process.once('loaded', () => {
    window.process = process
  })

  contextBridge.exposeInMainWorld('context', {
    locale: 'es-AR',
    on: (event, args) => ipcRenderer.on(event, args),
    send: (event, args) => ipcRenderer.send(event, args),
    invoke: (event, args) => ipcRenderer.invoke(event, args),
    removeAllListeners: (event) => ipcRenderer.removeAllListeners(event),

    getFiles: async () => {
      const files = await ipcRenderer.invoke('getFiles')
      return files
    },
    getGrafState: async () => {
      const grafState = await ipcRenderer.invoke('getGrafState')
      return grafState
    },
    getTemplates: async () => {
      const templates = await ipcRenderer.invoke('getTemplates')
      return templates
    },
    getBinaryFiles: async () => {
      const binaryFiles = await ipcRenderer.invoke('getBinaryFiles')
      return binaryFiles
    },

    saveProject: async (state: string) => {
      const notification = await ipcRenderer.invoke('saveGrafState', state)
      return notification
    },
    saveTemplate: async (templates: string) => {
      const notification = await ipcRenderer.invoke('saveTemplates', templates)
      return notification
    },
    saveExcelFile: async (fileName: string, content: ArrayBuffer) => {
      const notification = await ipcRenderer.invoke('saveExcelFile', fileName, content)
      return notification
    },

    readFilesFromPath: async (path: string[]) => {
      const files = await ipcRenderer.invoke('readFilesFromPath', path)
      return files
    },

    importFilesFromLoader: async () => {
      const files = await ipcRenderer.invoke('importFilesFromLoader')
      return files
    },

    onLoadFileInfo: async () => {
      const fileInfo = await ipcRenderer.invoke('onLoadFileInfo')
      return fileInfo
    },
    openDevTools: async () => {
      await ipcRenderer.invoke('openDevTools')
    },

    getAppName: async () => {
      const appName = await ipcRenderer.invoke('getAppName')
      return appName
    },

    getAppInfo: async () => {
      const appInfo = await ipcRenderer.invoke('getAppInfo')
      return appInfo
    },
    checkUpdates: async () => {
      return await ipcRenderer.invoke('checkUpdates')
    },
    quitAndInstall: async () => {
      return await ipcRenderer.invoke('quitAndInstall')
    },
    quit: () => {
      ipcRenderer.invoke('quit')
    }
  })
} catch (e) {
  console.error(e)
}
