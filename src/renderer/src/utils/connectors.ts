import { COLORS, supportedFileTypeObject } from '@shared/constants'
import { read, utils } from 'xlsx'
import { IFileRaw, IProcessFile } from '@shared/models/files'
import { generateRandomNumber } from './utils'
import { generateRandomId } from './common'
import _ from 'lodash'
import { IGraftState } from '@shared/models/graf'
import { ITemplateFile } from '@shared/models/template'

export const readImpedanceFile = (fileRaw: IFileRaw): IProcessFile | undefined => {
  if (fileRaw.type !== 'teq4z') return undefined
  const arrayFile = fileRaw.content.split(/(?:\r\n|\r|\n)/g)
  const pointNumber = parseInt(arrayFile[105])
  const data = arrayFile.slice(146, 146 + pointNumber)
  const dataPoint: string[][] = data.map((line) => line.split(','))
  const impedance = {
    V: parseFloat(arrayFile[10].split(',')[1]),
    signalAmplitude: parseFloat(arrayFile[113].split(',')[0]),
    sFrequency: parseFloat(arrayFile[103].split(',')[0]),
    eFrequency: parseFloat(arrayFile[104].split(',')[0]),
    totalPoints: parseInt(arrayFile[105].split(',')[0])
  }
  return {
    id: generateRandomId(),
    color: fileRaw.color || COLORS[generateRandomNumber(COLORS.length - 1)],
    type: supportedFileTypeObject.teq4z as IProcessFile['type'],
    name: fileRaw.name,
    pointNumber,
    content: dataPoint,
    selected: false,
    impedance
  }
}

export const readVoltammeterFile = (fileRaw: IFileRaw): IProcessFile | undefined => {
  if (fileRaw.type !== supportedFileTypeObject.teq4) return undefined
  const arrayFile = fileRaw.content.split(/(?:\r\n|\r|\n)/g)
  const countX = parseInt(arrayFile[23].split(',')[1])
  const countY = parseInt(arrayFile[24].split(',')[1])
  const dataX = _.slice(arrayFile, 146, 146 + countX)
  const dataY = _.slice(arrayFile, 146 + countX, 146 + countX + countY)
  const dataPoint: string[][] = dataX.map((x, index) => [x, dataY[index]])
  const samplesSec = parseInt(arrayFile[27].split(',')[1])
  const range = parseInt(arrayFile[13].split(',')[1])
  const cicles = parseInt(arrayFile[17].split(',')[1])
  const totalTime = countX / samplesSec
  const voltammeter = {
    samplesSec,
    range,
    totalTime,
    cicles
  }
  return {
    id: generateRandomId(),
    color: fileRaw.color || COLORS[generateRandomNumber(COLORS.length - 1)],
    type: supportedFileTypeObject.teq4 as IProcessFile['type'],
    name: fileRaw.name,
    content: dataPoint,
    selected: false,
    voltammeter
  }
}
export const readCsvFile = (fileRaw: IFileRaw): IProcessFile | undefined => {
  if (fileRaw.type !== supportedFileTypeObject.csv) return undefined
  const contentXLSX = read(fileRaw.content, { type: 'string' })
  const content = Object.values(
    utils.sheet_to_json(contentXLSX.Sheets[contentXLSX.SheetNames[0]])
  ).map((i) => Object.values(i as object))

  const columns = Object.keys(
    utils.sheet_to_json(contentXLSX.Sheets[contentXLSX.SheetNames[0]])[0] as object
  )
  const invariableContent = [columns, ...content]

  const selectedInvariableContentIndex = invariableContent.reduce(
    (acc, curr, index) => (curr.length > acc.value ? { value: curr.length, index: index } : acc),
    { index: 0, value: content[0].length }
  ).index

  return {
    id: generateRandomId(),
    color: fileRaw.color || COLORS[generateRandomNumber(COLORS.length - 1)],
    type: supportedFileTypeObject.csv as IProcessFile['type'],
    name: fileRaw.name,
    content: content,
    selectedInvariableContentIndex: selectedInvariableContentIndex,
    invariableContent: invariableContent,
    selected: false,

    csv: { columns: columns }
  }
}

export const readGrafFile = (fileRaw: IFileRaw): IGraftState | undefined => {
  if (fileRaw.type !== supportedFileTypeObject.graft) return undefined
  const state = JSON.parse(fileRaw.content)?.graft as IGraftState
  return state
}

export const readTemplateFile = (fileRaw: IFileRaw): ITemplateFile | undefined => {
  if (fileRaw.type !== supportedFileTypeObject.template) return undefined
  const content = JSON.parse(fileRaw.content).template as ITemplateFile
  return content
}

export const readTemplateFiles = (templates: IFileRaw[]): ITemplateFile[] | undefined => {
  if (templates.length > 0) return undefined
  const processedFiles = templates.map((file) => {
    if (file.type === supportedFileTypeObject.template) {
      return readTemplateFile(file)
    }
    return undefined
  })

  const validFiles = processedFiles.filter((i) => i !== undefined) as ITemplateFile[]
  if (validFiles.length === 0) return undefined
  return validFiles
}

// Read
export const readNativeFiles = (files: IFileRaw[]): IProcessFile[] | undefined => {
  const processedFiles = files.map((file) => {
    if (file.type === supportedFileTypeObject.teq4) {
      return readVoltammeterFile(file)
    } else if (file.type === supportedFileTypeObject.teq4z) {
      return readImpedanceFile(file)
    } else if (file.type === supportedFileTypeObject.csv) {
      return readCsvFile(file)
    }
    return undefined
  })

  const validFiles = processedFiles.filter((i) => i !== undefined) as IProcessFile[]
  if (validFiles.length === 0) return undefined
  return validFiles
}

export const readFilesUnsortedFileType = (
  files: IFileRaw[]
): IProcessFile[] | undefined | IGraftState => {
  if (files.length === 0) return undefined

  if (files.find((f) => f.type === supportedFileTypeObject.graft)) {
    const graft = readGrafFile(
      files.find((f) => f.type === supportedFileTypeObject.graft) as IFileRaw
    )

    if (graft) return graft
    return undefined
  }

  if (files.find((f) => f.type === supportedFileTypeObject.template)) return undefined

  return readNativeFiles(files)
}

export const stringifyToSave = <T>(state: T, key: string): string => {
  const result = JSON.stringify({ [key]: state })
  return result
}
