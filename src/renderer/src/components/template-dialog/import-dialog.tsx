import React, { useState } from 'react'
import { LoaderProvider } from '@/context/Loading'
import useImportData from '@/hooks/useImportData'
import { IProcessFile } from '@shared/models/files'
import { HandleSelectColumns, handleImport } from '@/utils/dialog-table-utils'
import {
  CurrentSelected,
  ExcelTableData,
  ExcelTableSelected
} from '@/utils/import-dialog-interfaces'
import _ from 'lodash'
import { LayoutTemplate } from 'lucide-react'
import { useSnackbar } from 'notistack'

import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '../ui/dialog'
import CustomTooltip from '../ui/tooltip'
import ExcelTable from './excel-table'
import ImportFile from './template-dialog-actions/import-file'
import OpenTemplate from './template-dialog-actions/open-template'
import SaveTemplate from './template-dialog-actions/save-template'
import SelectionFooter from './template-dialog-actions/selection-footer'
import useLoader from '@renderer/hooks/useLoader'

// TODO: Add params input

const ImportDialog = () => {
  const { importDataTeq4Z } = useImportData()
  const { isLoading, startLoading, stopLoading } = useLoader()
  const [data, setData] = useState<ExcelTableData>()
  const [selected, setSelected] = useState<ExcelTableSelected>()
  const [open, setOpen] = useState(false)
  const [columns, setColumns] = useState<HandleSelectColumns>({
    frequency: { col: 0, color: 'red' },
    module: undefined,
    phase: undefined,
    zi: undefined,
    zr: undefined
  })

  const [isModulePhase, setIsModulePhase] = React.useState(true)

  const { enqueueSnackbar } = useSnackbar()

  const [params, setParams] = useState<IProcessFile['impedance'] & { name: string }>({
    name: '',
    V: 0,
    eFrequency: 0,
    sFrequency: 0,
    signalAmplitude: 0,
    totalPoints: 0
  })

  const handleSelect = (currentSelected: CurrentSelected, isClean = false) => {
    if (isClean) {
      setColumns((prev) => ({
        frequency: prev.frequency,
        module: undefined,
        phase: undefined,
        zi: undefined,
        zr: undefined
      }))
      return
    }
    setColumns((prev) => {
      let collide = false
      Object.entries(prev).forEach(([key, value]) => {
        if (value?.['col'] === selected?.col) {
          prev[key] = undefined
          collide = true
        }
      })
      return {
        ...prev,
        [currentSelected.variable]: { col: selected?.col, color: currentSelected.color }
      }
    })
    setSelected((prev) => ({ ...prev, col: undefined }) as ExcelTableSelected)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger>
        <CustomTooltip
          title="Make a new import template"
          Icon={<LayoutTemplate className="h-5 w-5" />}
        />
      </DialogTrigger>
      <DialogContent className="absolute flex h-[91%] max-w-[95%] flex-col gap-0 overflow-y-auto overflow-x-hidden mt-6">
        <DialogTitle className="flex items-center gap-10">
          Import Data From Text File
          <ImportFile
            setColumns={setColumns}
            setData={setData}
            setSelected={setSelected}
            setParams={setParams}
          />
          <SaveTemplate isModulePhase={isModulePhase} selected={selected} columns={columns} />
          <OpenTemplate
            data={data}
            setColumns={setColumns}
            setSelected={setSelected}
            setIsModulePhase={setIsModulePhase}
          />
        </DialogTitle>

        <ExcelTable
          data={data}
          setData={setData}
          selected={selected || { row: 0, col: 0 }}
          columns={columns}
          setSelected={setSelected}
        />

        <DialogFooter className="relative bottom-0 right-0 mt-auto grid grid-cols-6 items-center justify-between">
          <SelectionFooter
            selected={selected || { row: 0, col: 0 }}
            handleSelect={handleSelect}
            isModulePhase={isModulePhase}
            setIsModulePhase={setIsModulePhase}
          />
          <div className="flex justify-end gap-3">
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              disabled={Object.values(columns).filter((c) => c !== undefined).length < 3}
              onClick={() => {
                handleImport({
                  columns,
                  data,
                  params,
                  importDataTeq4Z,
                  enqueueSnackbar,
                  startLoading,
                  stopLoading,
                  setOpen,
                  selected: selected as ExcelTableSelected
                })
              }}
            >
              Import
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImportDialog
