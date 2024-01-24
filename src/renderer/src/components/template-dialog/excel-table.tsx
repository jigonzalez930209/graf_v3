import * as React from 'react'
import { HotTable } from '@handsontable/react'
import { registerAllModules } from 'handsontable/registry'
import { textRenderer } from 'handsontable/renderers'
import { CellProperties, GridSettings } from 'handsontable/settings'
import { HyperFormula } from 'hyperformula'
import tinycolor from 'tinycolor2'

import 'handsontable/dist/handsontable.full.min.css'

import { ExcelTableProps } from '@/utils/import-dialog-interfaces'
import Core from 'handsontable/core'

registerAllModules()

const ExcelTable = ({ data, setData, selected, setSelected, columns }: ExcelTableProps) => {
  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable'
  })

  const [settings, setSettings] = React.useState<GridSettings>(() => {
    const initialState = {
      data: data && data,
      height: '75vh',
      width: '92vw',
      licenseKey: 'non-commercial-and-evaluation',
      colHeaders: true,
      rowHeaders: true,
      manualRowResize: true,
      manualColumnResize: true,
      readOnly: true,
      formulas: {
        engine: hyperformulaInstance,
        sheetName: 'Sheet1'
      }
    }

    return initialState
  })

  // TODO: add a button to calculate the formula in next iteration

  const handleSelection = (row: number, col: number) => {
    if (col < 0) {
      setSelected((prev) => ({ ...prev, row: row, col: prev?.col || 0 }))
    }
    if (row < 0) {
      setSelected((prev) => ({ ...prev, col: col, row: prev?.row || 0 }))
    }
  }
  const renderCellColors = (prop: string) => {
    const color = prop
    return function firstRowRenderer(
      this: never,
      instance: Core,
      TD: HTMLTableCellElement,
      row: number,
      col: number,
      prop: string | number,
      value: string | number | boolean | null | undefined,
      cellProperties: CellProperties
    ) {
      textRenderer.apply(this, [instance, TD, row, col, prop, value, cellProperties])
      TD.style.fontWeight = color ? 'bold' : 'normal'
      TD.style.color = color
      TD.style.background = color ? tinycolor(color).lighten(40).toString() : ''
      TD.style.textAlign = color ? 'center' : 'left'
    }
  }

  const hotTableComponent = React.useRef(null)

  const onBeforeHotChange = (changes) => {
    const newData = settings.data ? [...settings.data] : []

    changes.forEach(([row, column, _, newValue]) => {
      newData[row][column] = newValue
    })
    setData(newData)
  }

  React.useEffect(() => {
    if (data && data.length) setSettings((prev) => ({ ...prev, data }))
  }, [data])

  return (
    <div className="my-3 h-full overflow-hidden">
      {data && (
        <div id="example-preview">
          <HotTable
            ref={hotTableComponent}
            beforeChange={onBeforeHotChange}
            settings={settings}
            afterSelection={handleSelection}
            cells={(row, col) => {
              const cellProperties: CellProperties = {} as CellProperties
              if (row === selected?.row - 1) {
                cellProperties.renderer = renderCellColors('gray')
              }
              cellProperties.renderer = renderCellColors(
                Object.values(columns).find((v) => v?.col === col)?.color || ''
              )

              return cellProperties
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ExcelTable
