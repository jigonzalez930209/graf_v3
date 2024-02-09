import _ from 'lodash'
import XLSX from 'xlsx'

import { IProcessFile, VoltameterParameters } from '@shared/models/files'
import { ConcInputValue, FrequencyValues } from '@shared/models/graf'

const excelFileType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8'

type WebBook = {
  Sheets: { [key: string]: XLSX.WorkSheet }
  SheetNames: string[]
}

const exportExcelFrequencyAnalysis = async ({
  uniqueFrequencyCalc,
  concInputValues
}: {
  uniqueFrequencyCalc: FrequencyValues[]
  concInputValues: ConcInputValue[]
}) => {
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
  const data = new Blob([excelBuffer], { type: excelFileType })
  return data.arrayBuffer().then((buffer) => buffer)
}

type calculateColumnProps = {
  key: string
  value: string[]
  type: 'teq4' | 'teq4z'
  index?: number
  totalPoints?: number
  totalTime?: number
}

const calculateColumn = ({
  key,
  value,
  type,
  index,
  totalPoints,
  totalTime
}: calculateColumnProps) => {
  if (type === 'teq4') {
    const time = (totalTime! / totalPoints!) * (index! + 1)
    const res = {
      Time: time,
      Voltage: parseFloat(new Number(value[0]).toFixed(10)),
      Current: parseFloat(new Number(value[1]).toFixed(10))
    }
    return res[key]
  }
  if (type === 'teq4z') {
    const calculate = {
      Time: parseFloat(value[0]),
      Frequency: parseFloat(value[1]),
      Module: parseFloat(value[2]),
      Face: parseFloat(value[3]),
      ZR: parseFloat(value[2]) * Math.cos((parseFloat(value[3]) * Math.PI) / 180),
      ZI: -parseFloat(value[2]) * Math.sin((parseFloat(value[3]) * Math.PI) / 180)
    }

    return calculate[key]
  }
}

type exportExcelProps = {
  files: IProcessFile[]
  sameSheet: boolean
  columns: string[]
}
const exportExcelImpedance = async ({
  files,
  sameSheet = true,
  columns
}: exportExcelProps): Promise<ArrayBuffer> => {
  if (sameSheet) {
    const processFiles = files.reduce((acc, f, fi) => {
      const data = f.content.map((c) =>
        columns.reduce(
          (ac, curr) => ({
            ...ac,
            [`${curr} (${fi + 1})`]: calculateColumn({ key: curr, value: c, type: 'teq4z' })
          }),
          { [`${f.name} (${fi + 1})`]: ' ' }
        )
      )
      return acc.length ? acc.map((a, i) => _.merge(a, data[i])) : data
    }, [] as unknown[])

    const impedance = XLSX.utils.json_to_sheet(processFiles)

    const wb: WebBook = {
      Sheets: { impedance },
      SheetNames: ['impedance']
    }

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: excelFileType })
    return await data.arrayBuffer()
  }
  const wb: WebBook = {
    Sheets: {},
    SheetNames: []
  }
  files.forEach((f) => {
    const impedance = XLSX.utils.json_to_sheet(
      f.content.map((d) => {
        const data = columns.reduce(
          (ac, curr) => ({
            ...ac,
            [`${curr}`]: calculateColumn({ key: curr, value: d, type: 'teq4z' })
          }),
          {}
        )

        return data
      })
    )
    wb.Sheets[f.name] = impedance
    wb.SheetNames.push(f.name)
  })
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: excelFileType })
  return await data.arrayBuffer()
}

const exportExcelVoltametry = async ({
  files,
  sameSheet = true,
  columns
}: exportExcelProps): Promise<ArrayBuffer> => {
  if (sameSheet) {
    const processFiles = files.reduce((acc, f, fi) => {
      const data = f.content.map((c, i) =>
        columns.reduce(
          (ac, curr) => ({
            ...ac,
            [`${curr} (${fi + 1})`]: calculateColumn({
              key: curr,
              value: c,
              type: 'teq4',
              index: i,
              totalPoints: f.content.length,
              totalTime: f.voltammeter?.totalTime
            })
          }),
          { [`${f.name} (${fi + 1})`]: ' ' }
        )
      )
      return acc.length ? acc.map((a, i) => _.merge(a, data[i])) : data
    }, [] as unknown[])
    const voltametry = XLSX.utils.json_to_sheet(processFiles)

    const wb: WebBook = {
      Sheets: { voltametry },
      SheetNames: ['voltametry']
    }

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: excelFileType })
    return await data.arrayBuffer()
  }
  const wb: WebBook = {
    Sheets: {},
    SheetNames: []
  }
  files.forEach((f) => {
    const voltametry = XLSX.utils.json_to_sheet(
      f.content.map((d, i) => {
        const data = columns.reduce(
          (ac, curr) => ({
            ...ac,
            [`${curr}`]: calculateColumn({
              key: curr,
              value: d,
              type: 'teq4',
              index: i,
              totalPoints: f.content.length,
              totalTime: f.voltammeter?.totalTime
            })
          }),
          {}
        )

        return data
      })
    )
    wb.Sheets[f.name] = voltametry
    wb.SheetNames.push(f.name)
  })
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: excelFileType })
  return await data.arrayBuffer()
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
