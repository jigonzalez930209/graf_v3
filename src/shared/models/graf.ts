import { VariantType } from 'notistack'
import { IProcessFile } from './files'
import { UpdateInfo } from 'electron-updater'

type INotificationType = 'error' | 'warning' | 'success' | 'info' | undefined | VariantType

interface INotification {
  title: string
  content: string[] | string
  type: INotificationType
}

interface IGraftState {
  notifications: INotification
  state: null
  fileType: IFileType
  loading: boolean
  graftType: IGrafType
  impedanceType: IGraftImpedanceType
  stepBetweenPoints: IStepBetweenPoints
  lineOrPointWidth: number
  drawerOpen: boolean
  csvFileColum: ICsvFileColum[]
  files: IProcessFile[]
  platform: IPlatform
  isFilesGrouped: boolean
  colorScheme: IColorScheme
  selectedFilesCount: number
  uniqueFrequencyCalc: FrequencyValues[]
  concInputValues: ConcInputValue[]
  updateContent: UpdateInfo | null
  progressEvent: IProgressEvent
}

type IPlatform = 'web' | 'desktop' | null

type IGrafType = 'line' | 'scatter'

type IGraftImpedanceType = 'Bode' | 'Nyquist' | 'ZiZrVsFreq'

type IFileType = 'teq4' | 'teq4z' | 'csv' | 'graft' | 'template' | 'xls' | 'xlsx' | 'txt' | null

type IGraftData = 'IMPEDANCE_MODULE_PHASE' | 'IMPEDANCE_ZiZr' | 'VC_V_vs_I' | 'VC_t_vs_I'

type IStepBetweenPoints = number

type ICsvFileColum = {
  id: string
  fileName: string
  selected: boolean | string
  x?: IColumns
  y?: IColumns
  y2?: IColumns
  notSelected?: IColumns
}

type IColumns = {
  name: string
  index: number
  color?: string
}[]

type IColorScheme = string

type SortedByFrequency = {
  [freq: number]: {
    module: number
    value: number
    phase: number
    zi: number
    zr: number
  }[]
}

type FrequencyValues = {
  [i: number]: {
    frequency: number
    module: { m: number; b: number; r: number }
    phase: { m: number; b: number; r: number }
    zi: { m: number; b: number; r: number }
    zr: { m: number; b: number; r: number }
  }
}

type ConcInputValue = {
  id: IProcessFile['id']
  name: IProcessFile['name']
  value: number
}

type IProgressEventType = 'progress' | 'error' | 'success' | undefined

type IProgressEvent = {
  type: IProgressEventType
  timeOut?: number | undefined
  name: string
  message: string
}

export type {
  IGraftState,
  IFileType,
  IGraftData,
  IGrafType,
  IGraftImpedanceType,
  IStepBetweenPoints,
  IPlatform,
  ICsvFileColum,
  IColorScheme,
  FrequencyValues,
  ConcInputValue,
  SortedByFrequency,
  IColumns,
  INotification,
  IProgressEvent
}
