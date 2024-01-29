import * as React from 'react'

import {
  ConcInputValue,
  ICsvFileColum,
  FrequencyValues,
  IColorScheme,
  IFileType,
  IGraftImpedanceType,
  IGraftState,
  IGrafType,
  INotification,
  IPlatform
} from '@shared/models/graf'
import { IProcessFile } from '@shared/models/files'
import { UpdateInfo } from 'electron-updater'

export type GrafContextProps = {
  graftState: IGraftState
  setNotification: (notification: INotification) => void
  setSelectedFile: (selectedFileType: IFileType) => void
  setGraftType: (type: IGrafType) => void
  setImpedanceType: (type: IGraftImpedanceType) => void
  setStepBetweenPoints: (step: number) => void
  setLineOrPointWidth: (width: number) => void
  setDrawerOpen: (open: boolean) => void
  setSelectedColumns: (columns: ICsvFileColum[]) => void
  setFiles: (files: IProcessFile[]) => void
  setFile: (file: IProcessFile) => void
  addFiles: (files: IProcessFile[]) => void
  setGraftState: (graftState: IGraftState) => void
  updateFile: (file: IProcessFile) => void
  updateCSVfileColumn: (csvFileColum: ICsvFileColum) => void
  setPlatform: (platform: IPlatform) => void
  setIsFilesGrouped: (isFileGrouped: boolean) => void
  setColorScheme: (colorScheme: IColorScheme) => void
  setSelectedFilesCount: (count: number) => void
  setCalcToUniqueFrequency: (calcToUniqueFrequency: FrequencyValues[]) => void
  setSelectFilesToCalcUniqueFrequency: (inputFiles: ConcInputValue[]) => void
  setUpdateContent: (updateContent: UpdateInfo | null) => void
  setProgressEvent: (event: IGraftState['progressEvent']) => void
}

export const GrafContext = React.createContext<GrafContextProps>({} as GrafContextProps)
