import * as FileSaver from 'file-saver'
import _, { set } from 'lodash'
import XLSX from 'xlsx'

import { COLORS } from '@shared/constants'
import { IProcessFile } from '@shared/models/files'
import { ConcInputValue, FrequencyValues } from '@shared/models/graf'

const exportExcelFrequencyAnalysis = async ({
  uniqueFrequencyCalc,
  concInputValues
}: {
  uniqueFrequencyCalc: FrequencyValues[]
  concInputValues: ConcInputValue[]
}) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8'
  const fileExtension = '.xlsx'
  const frequency = XLSX.utils.json_to_sheet(
    uniqueFrequencyCalc.map((g, i) => ({
      frequencyLog: g[i].frequency,
      '': '',
      module_slope: g[i].module.m,
      phase_slope: g[i].phase.m,
      zi_slope: g[i].zi.m,
      zr_slope: g[i].zr.m,
      ' ': '',
      'module_R^2': g[i].module.r,
      'phaseR_R^2': g[i].phase.r,
      'zi_R^2': g[i].zi.r,
      'zr_R^2': g[i].zr.r,
      '  ': '',
      module_b: g[i].module.b,
      phase_b: g[i].phase.b,
      zi_b: g[i].zi.b,
      zr_b: g[i].zr.b
    }))
  )
  const files = XLSX.utils.json_to_sheet(
    concInputValues.map((c) => ({
      file: c.name,
      concentration: c.value
    }))
  )
  const wb = {
    Sheets: { frequency: frequency, conc: files },
    SheetNames: ['frequency', 'conc']
  }
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: fileType })
  return data.arrayBuffer().then((buffer) => buffer)
  // FileSaver.saveAs(data, fileName + fileExtension)
}

const exportExcelImpedance = () => {
  throw new Error('Not implemented')
}
const exportExcelVoltametry = () => {
  throw new Error('Not Voltametry')
}

const homogenizeMatrix = (matrix, defaultValue) => {
  // Get the maximum length of all rows
  const maxLength = Math.max(...matrix.map((row) => row.length))

  // Fill rows with blank values or the default value
  const homogenizedMatrix = matrix.map((row) => {
    // If the row is shorter than the maximum length, fill with blank values or the default value
    while (row.length < maxLength) {
      row.push(defaultValue)
    }
    return row
  })

  return homogenizedMatrix
}

const generateRandomId = () => (+new Date() * Math.random()).toString(36).substring(0, 6)

const arrayBufferToString = (buffer: ArrayBuffer, encoding = 'UTF-8'): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const blob = new Blob([buffer], { type: 'text/plain' })
    const reader = new FileReader()
    reader.onload = (evt) => {
      if (evt.target) {
        resolve(evt.target.result as string)
      } else {
        reject(new Error('Could not convert array to string!'))
      }
    }
    reader.readAsText(blob, encoding)
  })
}

const stringToArrayBuffer = (text: string, encoding = 'UTF-8'): Promise<ArrayBuffer> => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const blob = new Blob([text], { type: `text/plain;charset=${encoding}` })
    const reader = new FileReader()
    reader.onload = (evt) => {
      if (evt.target) {
        resolve(evt.target.result as ArrayBuffer)
      } else {
        reject(new Error('Could not convert string to array!'))
      }
    }
    reader.readAsArrayBuffer(blob)
  })
}
export {
  exportExcelFrequencyAnalysis as exportExcelFrequency,
  exportExcelImpedance,
  exportExcelVoltametry,
  homogenizeMatrix,
  generateRandomId,
  arrayBufferToString,
  stringToArrayBuffer
}
