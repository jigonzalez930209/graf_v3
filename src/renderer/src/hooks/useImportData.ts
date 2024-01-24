import * as React from 'react'

import { GrafContext } from '../context/GraftContext'
import { IProcessFile } from '@shared/models/files'
import { generateRandomId } from '../utils/common'
import { supportedFileTypeObject } from '@shared/constants'

export type ImportData = {
  name: string
  content: IProcessFile['content']
  color?: string
  impParams?: IProcessFile['impedance']
}

const useImportData = () => {
  const { setFile } = React.useContext(GrafContext)

  const importDataTeq4Z = ({ name, content, color, impParams }: ImportData) => {
    const file: IProcessFile = {
      id: generateRandomId(),
      name,
      type: supportedFileTypeObject.teq4z as IProcessFile['type'],
      content,
      color: color || 'gray',
      selected: false,
      impedance: impParams
    }
    setFile(file)
  }

  return { importDataTeq4Z }
}

// TODO: Add import multiples files

export default useImportData
