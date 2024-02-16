import { encoding, supportedFileTypesArray } from '@shared/constants'
import { INotification } from '@shared/models/graf'
import { BrowserWindow, dialog } from 'electron'
import { readFile, writeFileSync } from 'fs-extra'
import { fileType } from './utils'
import { IFileRaw } from '@shared/models/files'

export const saveProject = async (project: string, isSilent = false): Promise<INotification> => {
  if (isSilent) {
    if (project) {
      await writeFileSync('graf-state.graft', project, { encoding })
      return {
        type: 'success',
        content: 'Project saved',
        title: 'Success'
      }
    }
    return {
      type: 'error',
      content: 'not project',
      title: 'Warming'
    }
  }
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

export const getGrafState = async (isSilent = false): Promise<IFileRaw | undefined> => {
  if (isSilent) {
    try {
      const grafState = await readFile('graf-state.graft', { encoding })
      return {
        name: 'graf-state.graft',
        type: 'graft',
        content: grafState
      }
    } catch {
      return {
        name: 'lol',
        type: 'graft',
        content: ''
      }
    }
  }
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
