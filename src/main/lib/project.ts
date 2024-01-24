import { encoding, supportedFileTypesArray } from '@shared/constants'
import { INotification } from '@shared/models/graf'
import { BrowserWindow, dialog } from 'electron'
import { readFile, writeFileSync } from 'fs-extra'
import { fileType } from './utils'
import { IFileRaw } from '@shared/models/files'

export const saveProject = async (project: string): Promise<INotification> => {
  const result = await dialog.showSaveDialog(BrowserWindow.getAllWindows()[0], {
    properties: ['createDirectory'],
    filters: [
      {
        name: 'Project files',
        extensions: ['graft']
      }
    ]
  })

  if (result.canceled) {
    return {
      type: 'error',
      content: 'Project not saved',
      title: 'Error'
    }
  }

  const { filePath } = result
  if (!filePath)
    return {
      type: 'error',
      content: 'Project not saved',
      title: 'Error'
    }
  await writeFileSync(filePath, project, { encoding })
  return {
    type: 'success',
    content: 'Project saved',
    title: 'Success'
  }
}

export const getGrafState = async (): Promise<IFileRaw | undefined> => {
  const result = await dialog.showOpenDialog(BrowserWindow.getAllWindows()[0], {
    properties: ['openFile'],
    filters: [
      {
        name: 'Graf files',
        extensions: ['graft']
      }
    ]
  })

  if (result.canceled) {
    return undefined
  }

  const [filePath] = result.filePaths
  const fileName = filePath.split('\\').pop()
  if (!fileName) return undefined
  const type = fileType(fileName)
  const grafState = await readFile(filePath, { encoding })
  if (supportedFileTypesArray.includes(fileType(fileName) as IFileRaw['type'])) {
    return {
      name: fileName,
      type: type as IFileRaw['type'],
      content: grafState
    }
  }
  return undefined
}
