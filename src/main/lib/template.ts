import { encoding } from '@shared/constants'
import { IFileRaw } from '@shared/models/files'
import { BrowserWindow, dialog } from 'electron'
import { fileType } from './utils'
import { readFileSync, writeFileSync } from 'fs-extra'
import { COLORS, supportedFileTypesArray } from '@shared/constants'

import { INotification } from '@shared/models/graf'
import path from 'path'

export const getTemplates = async (): Promise<IFileRaw[] | INotification> => {
  const result = await dialog.showOpenDialog(BrowserWindow.getAllWindows()[0], {
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Template files',
        extensions: ['template']
      }
    ]
  })

  if (result.canceled) {
    return {
      type: 'error',
      content: 'Templates not loaded',
      title: 'Error'
    }
  }

  const templates: (IFileRaw | undefined)[] = result.filePaths
    .map((filePath, i): IFileRaw | undefined => {
      const fileName = path.normalize(filePath).split(path.sep).pop()
      if (!fileName) return undefined
      const type = fileType(fileName)
      const file = readFileSync(filePath, { encoding })
      if (supportedFileTypesArray.includes(type as IFileRaw['type'])) {
        return {
          name: fileName,
          type: type as IFileRaw['type'],
          content: file,
          color: COLORS[i]
        }
      }
      return undefined
    })
    .filter((i) => i !== undefined)

  if (templates?.length === 0)
    return {
      type: 'error',
      content: 'Templates not loaded',
      title: 'Error'
    }

  return Promise.all(templates) as Promise<IFileRaw[]>
}

export const saveTemplate = async (template: string): Promise<INotification> => {
  const result = await dialog.showSaveDialog(BrowserWindow.getAllWindows()[0], {
    properties: ['createDirectory'],
    filters: [
      {
        name: 'Template files',
        extensions: ['template']
      }
    ]
  })

  if (result.canceled) {
    return {
      type: 'error',
      content: 'Template not saved',
      title: 'Error'
    }
  }

  const { filePath } = result
  if (!filePath)
    return {
      type: 'error',
      content: 'Template not saved',
      title: 'Error'
    }
  await writeFileSync(filePath, template, { encoding })
  return {
    type: 'success',
    content: 'Template saved',
    title: 'Success'
  }
}
