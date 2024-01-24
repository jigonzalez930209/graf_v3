import React from 'react'
import { CellValue, RowObject } from 'handsontable/common'
import { IColumns } from './graf'
import { ICurrentSelected } from './template'

type SelectionFooterProps = {
  selected: { row: number; col: number }
  isModulePhase: boolean
  setIsModulePhase: React.Dispatch<React.SetStateAction<boolean>>
  handleSelect: (currentSelected: ICurrentSelected, isClean?: boolean) => void
}

type ExcelTableProps = {
  columns: IColumns
  data: ExcelTableData
  setData: React.Dispatch<React.SetStateAction<ExcelTableData>>
  selected: ExcelTableSelected
  setSelected: React.Dispatch<React.SetStateAction<ExcelTableSelected>>
}

type ExcelTableSelected = {
  row: number
  col: number
}

type ExcelTableData =
  | Array<{ [key: string]: string }>
  | Array<Array<string | number | boolean>>
  | CellValue[][]
  | RowObject[]

export type { SelectionFooterProps, ExcelTableProps, ExcelTableSelected, ExcelTableData }
