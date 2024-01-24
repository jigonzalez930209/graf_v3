import { IColorScheme, IFileType } from './graf'

type IFile = {
  id: number
  name: string
  content: string | string[][]
  selected: boolean
  columns?: string[]
  invariableContent?: string[][]
  selectedInvariableContentIndex?: number
}

type IExportData = {
  name: string
  value: {
    Time?: number
    Frequency?: number
    Module?: number
    Phase?: number
    ZI?: number
    ZR?: number
  }[]
}[]

type IProcessFile = {
  id: string
  name: string
  type: 'teq4' | 'teq4z' | 'csv'
  pointNumber?: number
  content: string[][]
  selected: boolean | string
  invariableContent?: string[][]
  selectedInvariableContentIndex?: number
  color: string
  impedance?: {
    V: number
    signalAmplitude: number
    sFrequency: number
    eFrequency: number
    totalPoints: number
  }
  voltammeter?: {
    samplesSec: number
    range: number
    totalTime: number
    cicles: number
  }
  csv?: {
    columns: string[]
  }
}

type IFiles = {
  files: IFile[]
}

type IFileRaw = {
  name: string
  type: IFileType
  content: string
  color?: IColorScheme
}

type IFileBinary = {
  name: string
  type: IFileType
  content: ArrayBuffer
}

export type { IFile, IExportData, IProcessFile, IFiles, IFileRaw, IFileBinary }
