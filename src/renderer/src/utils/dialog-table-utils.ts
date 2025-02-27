import { ImportData } from '@/hooks/useImportData'
import { IProcessFile } from '@shared/models/files'
import {
  Colors,
  ExcelTableData,
  Template,
  ExcelTableSelected
} from '@/utils/import-dialog-interfaces'
import { EnqueueSnackbar } from 'notistack'

export type HandleSelectColumns = {
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

type Indexes = {
  frequency: number
  module: number | undefined
  phase: number | undefined
  zi: number | undefined
  zr: number | undefined
}

type HandleImportProps = {
  columns: Template['columns']
  selected: ExcelTableSelected
  data: ExcelTableData | undefined
  startLoading: () => void
  stopLoading: () => void
  setOpen?: (open: boolean) => void
  params: IProcessFile['impedance'] & { name: string }
  importDataTeq4Z: (d: ImportData) => void
  enqueueSnackbar: EnqueueSnackbar
}
const handleImport = ({
  stopLoading,
  startLoading,
  columns,
  selected,
  data,
  importDataTeq4Z,
  params,
  setOpen,
  enqueueSnackbar
}: HandleImportProps): boolean => {
  startLoading()
  try {
    const indexes: Indexes = {
      frequency: columns.frequency.col,
      module: columns.module && columns.module.col,
      phase: columns.phase && columns.phase.col,
      zr: columns.zr && columns.zr.col,
      zi: columns.zi && columns.zi.col
    }

    console.log('index', indexes)

    const sortData =
      selected.row > 0
        ? data
            ?.filter((_, i) => i >= selected?.row)
            .map((row) => {
              const params = calculateParams(row, indexes)
              return params
            })
        : data?.map((row) => {
            const params = calculateParams(row, indexes)
            return params
          })

    const currentParams = { ...params }
    if (sortData && sortData.length > 0) {
      importDataTeq4Z({
        name: params.name,
        impParams: {
          ...currentParams,
          eFrequency: Math.max(...sortData.map((s) => s[1])),
          sFrequency: Math.min(...sortData.map((s) => s[1])),
          totalPoints: sortData.length
        },
        content: sortData as string[][]
      })
    }

    setOpen?.(false)
    return true
  } catch (e) {
    enqueueSnackbar('Something went wrong' + e, { variant: 'error' })
    console.log(e)
    return false
  } finally {
    stopLoading()
  }
}

const calculateParams = (row, indexes: Indexes): [string, number, number, number] => {
  const freq = row[indexes.frequency]
  const module =
    (indexes.module || indexes.module === 0) &&
    (parseFloat(row[indexes?.module as number]) as number)
  const phase =
    (indexes.phase || indexes.phase === 0) && (parseFloat(row[indexes?.phase as number]) as number)
  const zi = (indexes.zi || indexes.zi === 0) && (parseFloat(row[indexes?.zi as number]) as number)

  const zr = (indexes.zr || indexes.zr === 0) && (parseFloat(row[indexes?.zr as number]) as number)

  return [
    '',
    freq,
    module ? module : Math.sqrt((zi as number) ** 2 + (zr as number) ** 2),
    phase ? phase : -Math.atan((zi as number) / (zr as number)) * (180 / Math.PI)
  ]
}

export { handleImport }
