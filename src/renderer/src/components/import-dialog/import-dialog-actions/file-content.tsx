import * as React from 'react'
import { HotTable } from '@handsontable/react'
import { registerAllModules } from 'handsontable/registry'
import { HyperFormula } from 'hyperformula'
import tinycolor from 'tinycolor2'

import 'handsontable/dist/handsontable.full.min.css'

import { TemplateListItem } from '@/utils/import-dialog-interfaces'
import { textRenderer } from 'handsontable/renderers'
import { CellProperties } from 'handsontable/settings'
import Core from 'handsontable/core'

registerAllModules()

type FileContentProps = {
  data: string[][] | undefined
  template: TemplateListItem | undefined
}
const FileContent = ({ data, template }: FileContentProps) => {
  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable'
  })

  const hotTableComponent = React.useRef(null)

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
      TD.style.fontWeight = 'bold'
      TD.style.color = color
      TD.style.background = tinycolor(color).lighten(40).toString()
      TD.style.textAlign = 'center'
    }
  }

  return (
    <div className="my-3 h-full overflow-hidden">
      {data?.length && (
        <div id="example-preview">
          <HotTable
            ref={hotTableComponent}
            settings={{
              height: '37vh',
              width: '35vw',
              licenseKey: 'non-commercial-and-evaluation',
              colHeaders: true,
              rowHeaders: true,
              manualRowResize: true,
              manualColumnResize: true,
              readOnly: true,
              formulas: {
                engine: hyperformulaInstance
              },
              data
            }}
            cells={(row, col) => {
              const cellProperties: CellProperties = {} as CellProperties
              if (row === template?.template?.row) {
                cellProperties.renderer = renderCellColors('gray')
              }
              let color = ''
              if (template?.template?.columns) {
                const column = Object.values(template.template.columns).find((v) => v?.col === col)
                if (column) {
                  color = column.color
                }
              }
              cellProperties.renderer = renderCellColors(color)
              return cellProperties
            }}
          />
        </div>
      )}
    </div>
  )
}
export default FileContent
