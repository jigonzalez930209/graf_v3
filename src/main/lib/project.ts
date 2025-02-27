import { encoding, supportedFileTypesArray } from '@shared/constants'
import { INotification } from '@shared/models/graf'
import { BrowserWindow, dialog } from 'electron'
import { readFile, writeFileSync } from 'fs-extra'
import { fileType } from './utils'
import { IFileRaw } from '@shared/models/files'
import path from 'path'

export const saveProject = async (project: string, isSilent = false): Promise<INotification> => {
  const defaultExtension = '.graft'

  if (isSilent) {
    if (project) {
      await writeFileSync(`graf-state${defaultExtension}`, project, { encoding })
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
  const result = await dialog.showSaveDialog({
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

  let filePath = result.filePath
  if (!filePath)
    return {
      type: 'error',
      content: 'Project not saved',
      title: 'Error'
    }

  if (path.extname(filePath) !== defaultExtension) {
    filePath = filePath + defaultExtension
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
        extensions: ['graft', 'all']
      }
    ]
  })

  if (result.canceled) {
    return undefined
  }

  const [filePath] = result.filePaths
  const fileName = path.normalize(filePath).split(path.sep).pop()
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
