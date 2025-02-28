import { INotification } from '@shared/models/graf'
import {
  GetFiles,
  GetProject,
  GetTemplates,
  SaveTemplate,
  ImportFilesFromLoader,
  ReadFilesFromPath,
  SaveProject,
  SaveExcelFile,
  GetBinaryFiles
} from '@shared/types'
import { UpdateInfo } from 'electron-updater'
import { IpcRenderer } from 'electron'

declare global {
  interface Window {
    context: {
      on: IpcRenderer['on']
      send: IpcRenderer['send']
      invoke: IpcRenderer['invoke']
      removeAllListeners: IpcRenderer['removeAllListeners']
      locale: string

      // Get files from current path
      getFiles: GetFiles
      getGrafState: GetProject
      getTemplates: GetTemplates
      getBinaryFiles: GetBinaryFiles

      // Save files to current path
      saveProject: SaveProject
      saveTemplate: SaveTemplate
      saveExcelFile: SaveExcelFile

      // Read files from path
      readFilesFromPath: ReadFilesFromPath

      // Import files from loader
      importFilesFromLoader: ImportFilesFromLoader

      onLoadFileInfo: () => Promise<string[] | string>

      openDevTools: () => Promise<void>

      getAppName: () => Promise<string>

      getAppInfo: () => Promise<{
        name: string
        version: string
        arc: string
        electronVersion: string
      }>
      checkUpdates: () => Promise<UpdateInfo>
      quitAndInstall: () => Promise<void>
      downloadUpdate: () => Promise<string[]>

      quit: () => void
      maximize: () => boolean
      minimize: () => void
      getWindowSize: () => { width: number; height: number }
    }
  }
}
