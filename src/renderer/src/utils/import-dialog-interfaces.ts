import React from 'react'
import { CellValue, RowObject } from 'handsontable/common'

export type ExcelTableData =
  | Array<{ [key: string]: string }>
  | Array<Array<string | number | boolean>>
  | RowObject[]

export type ExcelTableSelected = {
  row: number
  col?: number
}

export type Columns = {
  col: number
  variable: Variables
  color: Colors
}[]

export type ExcelTableProps = {
  columns: Template['columns']
  data: ExcelTableData | undefined
  setData: React.Dispatch<React.SetStateAction<ExcelTableData | undefined>>
  selected: ExcelTableSelected
  setSelected: React.Dispatch<React.SetStateAction<ExcelTableSelected | undefined>>
}

export type Variables = 'module' | 'phase' | 'frequency' | 'zi' | 'zr'
export type Colors = 'blue' | 'green' | 'red' | 'orange' | 'purple'

export type SelectionFooterProps = {
  selected: ExcelTableSelected
  isModulePhase: boolean
  setIsModulePhase: React.Dispatch<React.SetStateAction<boolean>>
  handleSelect: (currentSelected: CurrentSelected, isClean?: boolean) => void
}

export type CurrentSelected = {
  variable: Variables
  color: Colors
}

type columParameters = {
  frequency: {
    col: number
    color: Colors
  }
  module:
    | {
        col: number
        color: Colors
      }
    | undefined
  phase:
    | {
        col: number
        color: Colors
      }
    | undefined
  zi:
    | {
        col: number
        color: Colors
      }
    | undefined
  zr:
    | {
        col: number
        color: Colors
      }
    | undefined
}

export type Template = {
  columns: columParameters
  row: number
  isModulePhase: boolean
}

export type TemplateList = TemplateListItem[]

export type TemplateListItem = {
  template: Template
  name: string
  id: string
}
