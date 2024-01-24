type IVariables = 'module' | 'phase' | 'frequency' | 'zi' | 'zr'
type IColors = 'blue' | 'green' | 'red' | 'orange' | 'purple'

type ICurrentSelected = {
  variable: IVariables
  color: IColors
  active: boolean
}

type ITemplate = {
  columns: {
    col: number
    variable: IVariables
    color: IColors
    active: boolean
  }[]
  row: number
  isModulePhase: boolean
}

type ITemplateFile = {
  name: string
  template: ITemplate
  notification: { message: string; variant: 'success' | 'error' }
}

type IColumnsTemplate = {
  col: number
  variable: IVariables
  color: IColors
}[]

export type { IVariables, IColors, ICurrentSelected, ITemplate, ITemplateFile, IColumnsTemplate }
