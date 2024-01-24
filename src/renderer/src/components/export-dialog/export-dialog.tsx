import React from 'react'
import { GrafContext } from '@/context/GraftContext'
import { COLUMNS_IMPEDANCE, COLUMNS_VOLTAMETER } from '@/utils'

import FileSort from '../file-sort'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'
import ExcelFileExport from './excel-file-export'

type ExportDialogProps = {
  children?: React.ReactNode
}

const ExportDialog = ({ children }: ExportDialogProps) => {
  const {
    graftState: { fileType }
  } = React.useContext(GrafContext)
  const [state, setState] = React.useState(
    fileType === 'teq4z'
      ? COLUMNS_IMPEDANCE.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
      : COLUMNS_VOLTAMETER.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
  )
  const [exportData, setExportData] = React.useState<JSX.Element>()
  const [isSameSheet] = React.useState(true)
  const [filename, setFilename] = React.useState(Date.now().toString())

  const [open, setOpen] = React.useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    })
  }

  const error = !Object.values(state).find((c) => c === true) || filename.length < 3

  React.useEffect(() => {
    setExportData(undefined)
    const timer = setTimeout(() => {
      setExportData(
        <div>
          <ExcelFileExport
            filename={filename}
            isSameSheet={isSameSheet}
            columns={Object.entries(state)
              .filter(([, v], _) => v === true)
              .map(([k, _]) => k)}
          />
        </div>
      )
    }, 10)

    return () => {
      clearTimeout(timer)
    }
  }, [filename, state, isSameSheet])

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle> Select a columns to export </DialogTitle>
        {open && (
          <div className="flex flex-row">
            <div className="flex flex-col gap-4">
              <label>Select columns to save</label>
              <div className="flex w-full flex-col gap-4">
                {fileType === 'teq4z' &&
                  COLUMNS_IMPEDANCE.map((column) => (
                    <div key={column} className="flex w-full items-center gap-3">
                      <input
                        type="checkbox"
                        checked={state[column]}
                        onChange={handleChange}
                        id={column}
                      />
                      <label className="ml-5" key={column}>
                        {column}
                      </label>
                    </div>
                  ))}
                {fileType === 'teq4' &&
                  COLUMNS_VOLTAMETER.map((column) => (
                    <div key={column} className="flex w-full items-center gap-3">
                      <input
                        type="checkbox"
                        checked={state[column]}
                        onChange={handleChange}
                        id={column}
                      />
                      <label className="ml-5" key={column}>
                        {column}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <FileSort maxHeight="h-[35vh]" />
            </div>
          </div>
        )}
        <div className="m-3">
          <label htmlFor="filename">File Name</label>
          <Input
            className="w-full rounded-md border border-gray-300 p-2"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            name="filename"
          />
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default">
            {!error ? exportData : <Skeleton className="h-4 w-[100px]" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExportDialog
