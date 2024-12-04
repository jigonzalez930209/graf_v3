import { COLORS, supportedFileTypesArray } from '@shared/constants'
import { encoding } from '@shared/constants'
import { IFileBinary, IFileRaw } from '@shared/models/files'
import { fileType } from './utils'
import { readFile, writeFile } from 'fs-extra'
import { dialog, BrowserWindow } from 'electron'
import { INotification } from '@shared/models/graf'
import path from 'path'

type GetFile = IFileRaw | undefined

export const getFiles = async (): Promise<GetFile[] | undefined> => {
  const result = await dialog.showOpenDialog(BrowserWindow.getAllWindows()[0], {
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'TEQ4 files',
        extensions: ['teq4', 'teq4Z', 'csv']
      }
    ]
  })

  if (result.canceled) {
    return undefined
  }

  const files: Promise<IFileRaw | undefined>[] = result.filePaths
    .map(async (filePath, i): Promise<IFileRaw | undefined> => {
      const fileName = path.normalize(filePath).split(path.sep).pop()
      if (!fileName) return undefined

      const type = fileType(fileName)
      const file = await readFile(filePath, { encoding })

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

  if (files?.length === 0) return undefined

  return Promise.all(files)
}

export const readFilesFromPath = async (pathFile: string[]): Promise<GetFile[] | undefined> => {
  try {
    const files = pathFile
      .map(async (filePath, i): Promise<IFileRaw | undefined> => {
        const fileName = path.normalize(filePath).split(path.sep).pop()
        if (!fileName) return undefined

        const type = fileType(fileName)
        const file = await readFile(filePath, { encoding })

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

    if (files?.length === 0) return undefined

    return Promise.all(files) as Promise<IFileRaw[]>
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export const importFilesFromLoader = async (): Promise<IFileRaw[] | undefined> => {
  const path = process.argv[1].toLowerCase()

  if (
    path === '.' ||
    path.includes('setup') ||
    path.includes('installer') ||
    path.includes('dmg') ||
    path.includes('upd')
  )
    return undefined
  else {
    console.log(process.argv)
    const file = readFilesFromPath([process.argv[1]]) as Promise<IFileRaw[] | undefined>
    process.argv[1] = '.'
    return file
  }
}

export const saveExcelFile = async (
  fileName: string,
  content: ArrayBuffer
): Promise<INotification> => {
  const result = await dialog.showSaveDialog(BrowserWindow.getAllWindows()[0], {
    title: 'Save Excel file',
    defaultPath: fileName,
    filters: [
      {
        name: 'Excel file',
        extensions: ['xlsx']
      }
    ]
  })

  if (result.canceled)
    return {
      type: 'warning',
      content: 'File saving canceled',
      title: 'Warning'
    }
  try {
    await writeFile(result.filePath as string, Buffer.from(content))
    return {
      type: 'success',
      content: 'File saved successfully',
      title: 'Success'
    }
  } catch (e) {
    console.log(e)
    return {
      type: 'error',
      content: 'File saving error' + e,
      title: 'Error'
    }
  }
}

export const getBinaryFiles = async (): Promise<IFileBinary[] | undefined> => {
  const result = await dialog.showOpenDialog(BrowserWindow.getAllWindows()[0], {
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Graf supported files (txt, csv, xlsx, xls)',
        extensions: ['txt', 'csv', 'xlsx', 'xls']
      }
    ]
  })

  if (result.canceled) {
    return undefined
  }

  const files: Promise<IFileBinary | undefined>[] = result.filePaths
    .map(async (filePath): Promise<IFileBinary | undefined> => {
      const fileName = path.normalize(filePath).split(path.sep).pop()

      if (!fileName) return undefined

      const type = fileType(fileName)
      const file = await readFile(filePath)

      if (supportedFileTypesArray.includes(type as IFileBinary['type'])) {
        return {
          name: fileName,
          type: type as IFileBinary['type'],
          content: file
        }
      }

      return undefined
    })
    .filter((i) => i !== undefined)

  if (files?.length === 0) return undefined

  return Promise.all(files) as Promise<IFileBinary[]>
}
